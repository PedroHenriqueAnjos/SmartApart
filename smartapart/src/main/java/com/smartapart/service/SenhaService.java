package com.smartapart.service;

import com.smartapart.model.Dono;
import com.smartapart.model.Funcionario;
import com.smartapart.model.Inquilino;
import com.smartapart.model.Sindico;
import com.smartapart.repository.DonoRepository;
import com.smartapart.repository.FuncionarioRepository;
import com.smartapart.repository.InquilinoRepository;
import com.smartapart.repository.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Troca de senha confirmada apenas pelo CPF.
 *   - "esqueci a senha": o CPF localiza a(s) conta(s) e a senha é trocada.
 *   - usuário logado: o CPF informado precisa ser o da conta (id + tipo).
 * Limite de 5 pedidos a cada 15 minutos por CPF (ou por usuário logado).
 */
@Service
public class SenhaService {

    private static final int MAX_PEDIDOS = 5;
    private static final long JANELA_PEDIDOS_MS = 15 * 60 * 1000L;

    @Autowired private SindicoRepository sindicoRepository;
    @Autowired private InquilinoRepository inquilinoRepository;
    @Autowired private DonoRepository donoRepository;
    @Autowired private FuncionarioRepository funcionarioRepository;

    private final Map<String, Deque<Long>> historico = new ConcurrentHashMap<>();

    public static class LimiteExcedidoException extends RuntimeException {
        public LimiteExcedidoException(String msg) { super(msg); }
    }

    private record Conta(String tipo, int id) {}

    public void redefinir(Map<String, Object> dados) {
        limparHistorico();

        String cpf = digitos(texto(dados, "cpf"));
        if (cpf.length() != 11) throw new IllegalArgumentException("CPF inválido.");

        String nova = texto(dados, "novaSenha");
        if (nova.length() < 6) throw new IllegalArgumentException("A senha deve ter pelo menos 6 caracteres.");
        if (nova.length() > 100) throw new IllegalArgumentException("A senha é muito longa.");

        List<Conta> contas;
        boolean logado = dados.get("id") != null && !texto(dados, "tipo").isBlank();

        if (logado) {
            int id;
            try {
                id = Integer.parseInt(texto(dados, "id").trim());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Dados inválidos.");
            }
            Conta conta = new Conta(normalizarTipo(texto(dados, "tipo")), id);
            registrarPedido(conta.tipo() + ":" + id);

            boolean confere = cpfDe(conta).map(SenhaService::digitos).filter(cpf::equals).isPresent();
            if (!confere) throw new IllegalArgumentException("O CPF não corresponde à sua conta.");
            contas = List.of(conta);
        } else {
            registrarPedido("cpf:" + cpf);
            contas = buscarPorCpf(cpf);
            if (contas.isEmpty()) throw new IllegalArgumentException("CPF não encontrado.");
        }

        for (Conta c : contas) {
            if (nova.equals(senhaDe(c).orElse(null))) {
                throw new IllegalArgumentException("A nova senha deve ser diferente da atual.");
            }
        }
        for (Conta c : contas) gravarSenha(c, nova);
    }

    // ---------- acesso às contas ----------
    private List<Conta> buscarPorCpf(String cpf) {
        List<Conta> r = new ArrayList<>();
        for (Sindico s : sindicoRepository.findAll())
            if (cpf.equals(digitos(s.getCpf()))) r.add(new Conta("SINDICO", s.getIdSindico()));
        for (Inquilino i : inquilinoRepository.findAll())
            if (cpf.equals(digitos(i.getCpf()))) r.add(new Conta("MORADOR", i.getIdInquilino()));
        for (Dono d : donoRepository.findAll())
            if (cpf.equals(digitos(d.getCpf()))) r.add(new Conta("DONO", d.getIdDono()));
        for (Funcionario f : funcionarioRepository.findAll())
            if (cpf.equals(digitos(f.getCpf()))) r.add(new Conta("PORTEIRO", f.getIdFuncionario()));
        return r;
    }

    private Optional<String> cpfDe(Conta c) {
        return switch (c.tipo()) {
            case "SINDICO" -> sindicoRepository.findById(c.id()).map(Sindico::getCpf);
            case "MORADOR" -> inquilinoRepository.findById(c.id()).map(Inquilino::getCpf);
            case "DONO" -> donoRepository.findById(c.id()).map(Dono::getCpf);
            case "PORTEIRO" -> funcionarioRepository.findById(c.id()).map(Funcionario::getCpf);
            default -> Optional.empty();
        };
    }

    private Optional<String> senhaDe(Conta c) {
        return switch (c.tipo()) {
            case "SINDICO" -> sindicoRepository.findById(c.id()).map(Sindico::getSenha);
            case "MORADOR" -> inquilinoRepository.findById(c.id()).map(Inquilino::getSenha);
            case "DONO" -> donoRepository.findById(c.id()).map(Dono::getSenha);
            case "PORTEIRO" -> funcionarioRepository.findById(c.id()).map(Funcionario::getSenha);
            default -> Optional.empty();
        };
    }

    private void gravarSenha(Conta c, String nova) {
        switch (c.tipo()) {
            case "SINDICO" -> sindicoRepository.findById(c.id()).ifPresent(s -> {
                s.setSenha(nova);
                sindicoRepository.save(s);
            });
            case "MORADOR" -> inquilinoRepository.findById(c.id()).ifPresent(i -> {
                i.setSenha(nova);
                inquilinoRepository.save(i);
            });
            case "DONO" -> donoRepository.findById(c.id()).ifPresent(d -> {
                d.setSenha(nova);
                donoRepository.save(d);
            });
            case "PORTEIRO" -> funcionarioRepository.findById(c.id()).ifPresent(f -> {
                f.setSenha(nova);
                funcionarioRepository.save(f);
            });
            default -> { }
        }
    }

    // ---------- utilitários ----------
    private void registrarPedido(String chave) {
        long agora = System.currentTimeMillis();
        Deque<Long> h = historico.computeIfAbsent(chave, k -> new ArrayDeque<>());
        synchronized (h) {
            while (!h.isEmpty() && agora - h.peekFirst() > JANELA_PEDIDOS_MS) h.pollFirst();
            if (h.size() >= MAX_PEDIDOS) {
                throw new LimiteExcedidoException("Muitas tentativas. Aguarde alguns minutos e tente de novo.");
            }
            h.addLast(agora);
        }
    }

    private void limparHistorico() {
        long agora = System.currentTimeMillis();
        historico.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                Long ultimo = e.getValue().peekLast();
                return ultimo == null || agora - ultimo > JANELA_PEDIDOS_MS;
            }
        });
    }

    private String normalizarTipo(String tipo) {
        String t = tipo.trim().toUpperCase();
        if (t.equals("INQUILINO")) t = "MORADOR";
        if (t.equals("FUNCIONARIO")) t = "PORTEIRO";
        if (!List.of("SINDICO", "MORADOR", "DONO", "PORTEIRO").contains(t)) {
            throw new IllegalArgumentException("Dados inválidos.");
        }
        return t;
    }

    private static String texto(Map<String, Object> m, String chave) {
        Object v = m.get(chave);
        return v == null ? "" : v.toString();
    }

    private static String digitos(String s) {
        return s == null ? "" : s.replaceAll("\\D", "");
    }
}

package com.smartapart.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartapart.model.Dono;
import com.smartapart.model.Funcionario;
import com.smartapart.model.Inquilino;
import com.smartapart.model.Sindico;
import com.smartapart.repository.DonoRepository;
import com.smartapart.repository.FuncionarioRepository;
import com.smartapart.repository.InquilinoRepository;
import com.smartapart.repository.SindicoRepository;

@Service
public class SenhaService {

    private static final int MAX_PEDIDOS = 5;
    private static final long JANELA_PEDIDOS_MS = 15 * 60 * 1000L;
    private static final int MAX_BYTES_BCRYPT = 72;

    @Autowired private SindicoRepository sindicoRepository;
    @Autowired private InquilinoRepository inquilinoRepository;
    @Autowired private DonoRepository donoRepository;
    @Autowired private FuncionarioRepository funcionarioRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final Map<String, Deque<Long>> historico = new ConcurrentHashMap<>();

    public static class LimiteExcedidoException extends RuntimeException {
        public LimiteExcedidoException(String msg) { super(msg); }
    }

    private record Conta(String tipo, int id) {}

    public String criptografar(String senhaDigitada) {
        if (senhaDigitada == null || senhaDigitada.isEmpty()) {
            return senhaDigitada;
        }
        if (senhaDigitada.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES_BCRYPT) {
            throw new IllegalArgumentException("A senha é muito longa.");
        }
        return encoder.encode(senhaDigitada);
    }

    public boolean estaCriptografada(String senhaArmazenada) {
        return senhaArmazenada != null && senhaArmazenada.matches("^\\$2[aby]\\$\\d{2}\\$.{53}$");
    }

    public boolean confere(String senhaDigitada, String senhaArmazenada) {
        if (senhaDigitada == null || senhaArmazenada == null) {
            return false;
        }
        if (estaCriptografada(senhaArmazenada)) {
            return encoder.matches(senhaDigitada, senhaArmazenada);
        }
        return senhaArmazenada.equals(senhaDigitada);
    }

    public void redefinir(Map<String, Object> dados) {
        limparHistorico();

        String cpf = digitos(texto(dados, "cpf"));
        if (cpf.length() != 11) throw new IllegalArgumentException("CPF inválido.");

        String nova = texto(dados, "novaSenha");
        if (nova.length() < 6) throw new IllegalArgumentException("A senha deve ter pelo menos 6 caracteres.");
        if (nova.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES_BCRYPT) {
            throw new IllegalArgumentException("A senha é muito longa.");
        }

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
            if (confere(nova, senhaDe(c).orElse(null))) {
                throw new IllegalArgumentException("A nova senha deve ser diferente da atual.");
            }
        }

        String hash = criptografar(nova);
        for (Conta c : contas) gravarSenha(c, hash);
    }

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

    private void gravarSenha(Conta c, String senhaHash) {
        switch (c.tipo()) {
            case "SINDICO" -> sindicoRepository.findById(c.id()).ifPresent(s -> {
                s.setSenha(senhaHash);
                sindicoRepository.save(s);
            });
            case "MORADOR" -> inquilinoRepository.findById(c.id()).ifPresent(i -> {
                i.setSenha(senhaHash);
                inquilinoRepository.save(i);
            });
            case "DONO" -> donoRepository.findById(c.id()).ifPresent(d -> {
                d.setSenha(senhaHash);
                donoRepository.save(d);
            });
            case "PORTEIRO" -> funcionarioRepository.findById(c.id()).ifPresent(f -> {
                f.setSenha(senhaHash);
                funcionarioRepository.save(f);
            });
            default -> { }
        }
    }

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
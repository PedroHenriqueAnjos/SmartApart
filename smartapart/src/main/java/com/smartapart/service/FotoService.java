package com.smartapart.service;

import com.smartapart.model.*;
import com.smartapart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FotoService {

    private static final int TAMANHO_MAXIMO_URL = 500;
    private static final String BUCKET = "avatars";

    // Ex.: https://abcdefgh.supabase.co (sem barra no final)
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Autowired
    private InquilinoRepository inquilinoRepository;
    @Autowired
    private DonoRepository donoRepository;
    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private SindicoRepository sindicoRepository;

    /** Valida a URL da foto. Retorna null quando a foto deve ser removida. */
    public String validarUrl(int id, String tipoUsuario, String fotoUrl) {
        if (fotoUrl == null || fotoUrl.isBlank()) {
            return null;
        }

        if (fotoUrl.length() > TAMANHO_MAXIMO_URL) {
            throw new IllegalArgumentException("URL muito longa");
        }

        // Só aceita arquivos do seu próprio bucket
        String prefixo = supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/";
        if (!fotoUrl.startsWith(prefixo)) {
            throw new IllegalArgumentException("URL de foto invalida");
        }

        // O arquivo precisa estar na pasta do próprio usuário: avatars/TIPO/ID/arquivo
        String caminho = fotoUrl.substring(prefixo.length());
        String pastaEsperada = tipoUsuario + "/" + id + "/";
        if (!caminho.startsWith(pastaEsperada)) {
            throw new IllegalArgumentException("A foto nao pertence a este usuario");
        }

        // Só o nome do arquivo depois da pasta, sem subpastas ou ".."
        String arquivo = caminho.substring(pastaEsperada.length());
        if (!arquivo.matches("[A-Za-z0-9\\-]+\\.(jpeg|jpg|png|webp)")) {
            throw new IllegalArgumentException("Nome de arquivo invalido");
        }

        return fotoUrl;
    }

    public Object atualizarFoto(int id, String tipoUsuario, String fotoUrl) {
        String fotoValidada = validarUrl(id, tipoUsuario, fotoUrl);

        switch (tipoUsuario.toUpperCase()) {
            case "MORADOR": {
                Inquilino i = inquilinoRepository.findById(id).orElse(null);
                if (i == null)
                    throw new IllegalArgumentException("Usuario nao encontrado");
                i.setFoto(fotoValidada);
                return inquilinoRepository.save(i);
            }
            case "DONO": {
                Dono d = donoRepository.findById(id).orElse(null);
                if (d == null)
                    throw new IllegalArgumentException("Usuario nao encontrado");
                d.setFoto(fotoValidada);
                return donoRepository.save(d);
            }
            case "SINDICO": {
                Sindico s = sindicoRepository.findById(id).orElse(null);
                if (s == null)
                    throw new IllegalArgumentException("Usuario nao encontrado");
                s.setFoto(fotoValidada);
                return sindicoRepository.save(s);
            }
            case "PORTEIRO":
            case "FUNCIONARIO": {
                Funcionario f = funcionarioRepository.findById(id).orElse(null);
                if (f == null)
                    throw new IllegalArgumentException("Usuario nao encontrado");
                f.setFoto(fotoValidada);
                return funcionarioRepository.save(f);
            }
            default:
                throw new IllegalArgumentException("Tipo de usuario invalido");
        }
    }

    public String buscarFoto(int id, String tipoUsuario) {
        switch (tipoUsuario.toUpperCase()) {
            case "MORADOR": {
                Inquilino i = inquilinoRepository.findById(id).orElse(null);
                return i != null ? i.getFoto() : null;
            }
            case "DONO": {
                Dono d = donoRepository.findById(id).orElse(null);
                return d != null ? d.getFoto() : null;
            }
            case "SINDICO": {
                Sindico s = sindicoRepository.findById(id).orElse(null);
                return s != null ? s.getFoto() : null;
            }
            case "PORTEIRO":
            case "FUNCIONARIO": {
                Funcionario f = funcionarioRepository.findById(id).orElse(null);
                return f != null ? f.getFoto() : null;
            }
            default:
                return null;
        }
    }
}

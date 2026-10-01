package com.smartapart.service;

import com.smartapart.model.*;
import com.smartapart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Base64;
import java.util.Arrays;

@Service
public class FotoService {

    private static final long TAMANHO_MAXIMO = 2 * 1024 * 1024;
    private static final String[] TIPOS_PERMITIDOS = { "image/jpeg", "image/png", "image/webp" };

    @Autowired
    private InquilinoRepository inquilinoRepository;
    @Autowired
    private DonoRepository donoRepository;
    @Autowired
    private FuncionarioRepository funcionarioRepository;
    @Autowired
    private SindicoRepository sindicoRepository;

    public String validarEProcessar(String fotoBase64) {
        if (fotoBase64 == null || fotoBase64.isBlank()) {
            throw new IllegalArgumentException("Foto invalida");
        }

        if (!fotoBase64.startsWith("data:")) {
            throw new IllegalArgumentException("Formato invalido");
        }

        int separador = fotoBase64.indexOf(",");
        if (separador == -1) {
            throw new IllegalArgumentException("Formato invalido");
        }

        String header = fotoBase64.substring(0, separador);
        String tipo = header.replace("data:", "").replace(";base64", "");

        boolean tipoPermitido = Arrays.asList(TIPOS_PERMITIDOS).contains(tipo);
        if (!tipoPermitido) {
            throw new IllegalArgumentException("Tipo de arquivo nao permitido. Use JPEG, PNG ou WebP");
        }

        String dadosBase64 = fotoBase64.substring(separador + 1);

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(dadosBase64);
        } catch (Exception e) {
            throw new IllegalArgumentException("Arquivo corrompido");
        }

        if (bytes.length > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException("Arquivo muito grande. Maximo 2MB");
        }

        if (!validarAssinaturaMagica(bytes, tipo)) {
            throw new IllegalArgumentException("Arquivo invalido ou corrompido");
        }

        return fotoBase64;
    }

    private boolean validarAssinaturaMagica(byte[] bytes, String tipo) {
        if (bytes.length < 4)
            return false;

        switch (tipo) {
            case "image/jpeg":
                return bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8;
            case "image/png":
                return bytes[0] == (byte) 0x89 && bytes[1] == (byte) 0x50
                        && bytes[2] == (byte) 0x4E && bytes[3] == (byte) 0x47;
            case "image/webp":
                return bytes[0] == (byte) 0x52 && bytes[1] == (byte) 0x49
                        && bytes[2] == (byte) 0x46 && bytes[3] == (byte) 0x46;
            default:
                return false;
        }
    }

    public Object atualizarFoto(int id, String tipoUsuario, String fotoBase64) {
        String fotoValidada = validarEProcessar(fotoBase64);

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
package com.smartapart.service;

import com.smartapart.model.*;
import com.smartapart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    @Autowired
    private DonoRepository donoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private SindicoRepository sindicoRepository;

    public LoginResponse login(LoginRequest request) {
        Optional<Sindico> sindico = sindicoRepository.findByCpfAndSenha(request.getCpf(), request.getSenha());
        if (sindico.isPresent()) {
            Sindico s = sindico.get();
            return new LoginResponse(s.getIdSindico(), s.getNome(), "SINDICO");
        }

        Optional<Inquilino> inquilino = inquilinoRepository.findByCpfAndSenha(request.getCpf(), request.getSenha());
        if (inquilino.isPresent()) {
            Inquilino i = inquilino.get();
            return new LoginResponse(i.getIdInquilino(), i.getNome(), "MORADOR");
        }

        Optional<Dono> dono = donoRepository.findByCpfAndSenha(request.getCpf(), request.getSenha());
        if (dono.isPresent()) {
            Dono d = dono.get();
            return new LoginResponse(d.getIdDono(), d.getNome(), "DONO");
        }

        Optional<Funcionario> funcionario = funcionarioRepository.findByCpfAndSenha(request.getCpf(),
                request.getSenha());
        if (funcionario.isPresent()) {
            Funcionario f = funcionario.get();
            String tipo = f.getFuncao().equalsIgnoreCase("Porteiro") ? "PORTEIRO" : "FUNCIONARIO";
            return new LoginResponse(f.getIdFuncionario(), f.getNome(), tipo);
        }

        return null;
    }
}
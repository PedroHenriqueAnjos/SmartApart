package com.smartapart.service;

import com.smartapart.model.Dono;
import com.smartapart.model.Funcionario;
import com.smartapart.model.Inquilino;
import com.smartapart.model.LoginRequest;
import com.smartapart.model.LoginResponse;
import com.smartapart.model.Sindico;
import com.smartapart.repository.DonoRepository;
import com.smartapart.repository.FuncionarioRepository;
import com.smartapart.repository.InquilinoRepository;
import com.smartapart.repository.SindicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Autowired
    private SenhaService senhaService;

    public LoginResponse login(LoginRequest request) {
        String cpf = request.getCpf();
        String senha = request.getSenha();

        for (Sindico s : sindicoRepository.findByCpf(cpf)) {
            if (senhaService.confere(senha, s.getSenha())) {
                if (!senhaService.estaCriptografada(s.getSenha())) {
                    s.setSenha(senhaService.criptografar(senha));
                    sindicoRepository.save(s);
                }
                return new LoginResponse(s.getIdSindico(), s.getNome(), "SINDICO");
            }
        }

        for (Inquilino i : inquilinoRepository.findByCpf(cpf)) {
            if (senhaService.confere(senha, i.getSenha())) {
                if (!senhaService.estaCriptografada(i.getSenha())) {
                    i.setSenha(senhaService.criptografar(senha));
                    inquilinoRepository.save(i);
                }
                return new LoginResponse(i.getIdInquilino(), i.getNome(), "MORADOR");
            }
        }

        for (Dono d : donoRepository.findByCpf(cpf)) {
            if (senhaService.confere(senha, d.getSenha())) {
                if (!senhaService.estaCriptografada(d.getSenha())) {
                    d.setSenha(senhaService.criptografar(senha));
                    donoRepository.save(d);
                }
                return new LoginResponse(d.getIdDono(), d.getNome(), "DONO");
            }
        }

        for (Funcionario f : funcionarioRepository.findByCpf(cpf)) {
            if (senhaService.confere(senha, f.getSenha())) {
                if (!senhaService.estaCriptografada(f.getSenha())) {
                    f.setSenha(senhaService.criptografar(senha));
                    funcionarioRepository.save(f);
                }
                String tipo = "Porteiro".equalsIgnoreCase(f.getFuncao()) ? "PORTEIRO" : "FUNCIONARIO";
                return new LoginResponse(f.getIdFuncionario(), f.getNome(), tipo);
            }
        }

        return null;
    }
}
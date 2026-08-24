package com.smartapart.service;

import com.smartapart.model.Inquilino;
import com.smartapart.model.Dono;
import com.smartapart.model.Funcionario;
import com.smartapart.repository.InquilinoRepository;
import com.smartapart.repository.DonoRepository;
import com.smartapart.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerfilService {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    @Autowired
    private DonoRepository donoRepository;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Inquilino atualizarInquilino(int id, String novoNome) {
        Inquilino inquilino = inquilinoRepository.findById(id).orElse(null);
        if (inquilino == null) {
            return null;
        }
        inquilino.setNome(novoNome);
        return inquilinoRepository.save(inquilino);
    }

    public Dono atualizarDono(int id, String novoNome) {
        Dono dono = donoRepository.findById(id).orElse(null);
        if (dono == null) {
            return null;
        }
        dono.setNome(novoNome);
        return donoRepository.save(dono);
    }

    public Funcionario atualizarFuncionario(int id, String novoNome) {
        Funcionario funcionario = funcionarioRepository.findById(id).orElse(null);
        if (funcionario == null) {
            return null;
        }
        funcionario.setNome(novoNome);
        return funcionarioRepository.save(funcionario);
    }
}
package com.smartapart.controller;

import com.smartapart.model.Funcionario;
import com.smartapart.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public Funcionario buscarPorId(@PathVariable int id) {
        return funcionarioRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Funcionario criar(@RequestBody Funcionario obj) {
        return funcionarioRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Funcionario atualizar(@PathVariable int id, @RequestBody Funcionario obj) {
        obj.setIdFuncionario(id);
        return funcionarioRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        funcionarioRepository.deleteById(id);
    }
}
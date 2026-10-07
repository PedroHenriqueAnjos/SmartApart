package com.smartapart.controller;

import java.util.List;

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

import com.smartapart.model.Sindico;
import com.smartapart.repository.SindicoRepository;
import com.smartapart.service.SenhaService;

@RestController
@RequestMapping("/sindicos")
@CrossOrigin(origins = "*")
public class SindicoController {

    @Autowired
    private SindicoRepository sindicoRepository;

    @Autowired
    private SenhaService senhaService;

    @GetMapping
    public List<Sindico> listarTodos() {
        return sindicoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Sindico buscarPorId(@PathVariable int id) {
        return sindicoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Sindico criar(@RequestBody Sindico obj) {
        obj.setSenha(senhaService.criptografar(obj.getSenha()));
        return sindicoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Sindico atualizar(@PathVariable int id, @RequestBody Sindico obj) {
        obj.setIdSindico(id);
        if (obj.getSenha() == null || obj.getSenha().isBlank()) {
            Sindico atual = sindicoRepository.findById(id).orElse(null);
            if (atual != null) {
                obj.setSenha(atual.getSenha());
            }
        } else {
            obj.setSenha(senhaService.criptografar(obj.getSenha()));
        }
        return sindicoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        sindicoRepository.deleteById(id);
    }
}
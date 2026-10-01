package com.smartapart.controller;

import com.smartapart.model.Salao;
import com.smartapart.repository.SalaoRepository;
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
@RequestMapping("/salaos")
@CrossOrigin(origins = "*")
public class SalaoController {

    @Autowired
    private SalaoRepository salaoRepository;

    @GetMapping
    public List<Salao> listarTodos() {
        return salaoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Salao buscarPorId(@PathVariable int id) {
        return salaoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Salao criar(@RequestBody Salao obj) {
        return salaoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Salao atualizar(@PathVariable int id, @RequestBody Salao obj) {
        obj.setIdSalao(id);
        return salaoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        salaoRepository.deleteById(id);
    }
}
package com.smartapart.controller;

import com.smartapart.model.Sindico;
import com.smartapart.repository.SindicoRepository;
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
@RequestMapping("/sindicos")
@CrossOrigin(origins = "*")
public class SindicoController {

    @Autowired
    private SindicoRepository sindicoRepository;

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
        return sindicoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Sindico atualizar(@PathVariable int id, @RequestBody Sindico obj) {
        obj.setIdSindico(id);
        return sindicoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        sindicoRepository.deleteById(id);
    }
}
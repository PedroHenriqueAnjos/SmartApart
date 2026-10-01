package com.smartapart.controller;

import com.smartapart.model.Bloco;
import com.smartapart.repository.BlocoRepository;
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
@RequestMapping("/blocos")
@CrossOrigin(origins = "*")
public class BlocoController {

    @Autowired
    private BlocoRepository blocoRepository;

    @GetMapping
    public List<Bloco> listarTodos() {
        return blocoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Bloco buscarPorId(@PathVariable int id) {
        return blocoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Bloco criar(@RequestBody Bloco obj) {
        return blocoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Bloco atualizar(@PathVariable int id, @RequestBody Bloco obj) {
        obj.setIdBloco(id);
        return blocoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        blocoRepository.deleteById(id);
    }
}
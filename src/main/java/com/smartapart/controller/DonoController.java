package com.smartapart.controller;

import com.smartapart.model.Dono;
import com.smartapart.repository.DonoRepository;
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
@RequestMapping("/donos")
@CrossOrigin(origins = "*")
public class DonoController {

    @Autowired
    private DonoRepository donoRepository;

    @GetMapping
    public List<Dono> listarTodos() {
        return donoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Dono buscarPorId(@PathVariable int id) {
        return donoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Dono criar(@RequestBody Dono obj) {
        return donoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Dono atualizar(@PathVariable int id, @RequestBody Dono obj) {
        obj.setIdDono(id);
        return donoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        donoRepository.deleteById(id);
    }
}
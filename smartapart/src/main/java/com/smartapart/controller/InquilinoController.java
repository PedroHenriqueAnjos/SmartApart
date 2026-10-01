package com.smartapart.controller;

import com.smartapart.model.Inquilino;
import com.smartapart.repository.InquilinoRepository;
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
@RequestMapping("/inquilinos")
@CrossOrigin(origins = "*")
public class InquilinoController {

    @Autowired
    private InquilinoRepository inquilinoRepository;

    @GetMapping
    public List<Inquilino> listarTodos() {
        return inquilinoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Inquilino buscarPorId(@PathVariable int id) {
        return inquilinoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Inquilino criar(@RequestBody Inquilino obj) {
        return inquilinoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Inquilino atualizar(@PathVariable int id, @RequestBody Inquilino obj) {
        obj.setIdInquilino(id);
        return inquilinoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        inquilinoRepository.deleteById(id);
    }
}
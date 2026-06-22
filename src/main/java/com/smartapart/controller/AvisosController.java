package com.smartapart.controller;

import com.smartapart.model.Avisos;
import com.smartapart.repository.AvisosRepository;
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
@RequestMapping("/avisoss")
@CrossOrigin(origins = "*")
public class AvisosController {

    @Autowired
    private AvisosRepository avisosRepository;

    @GetMapping
    public List<Avisos> listarTodos() {
        return avisosRepository.findAll();
    }

    @GetMapping("/{id}")
    public Avisos buscarPorId(@PathVariable int id) {
        return avisosRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Avisos criar(@RequestBody Avisos obj) {
        return avisosRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Avisos atualizar(@PathVariable int id, @RequestBody Avisos obj) {
        obj.setIdAvisos(id);
        return avisosRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        avisosRepository.deleteById(id);
    }
}
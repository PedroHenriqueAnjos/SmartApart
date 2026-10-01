package com.smartapart.controller;

import com.smartapart.model.Apartamento;
import com.smartapart.repository.ApartamentoRepository;
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
@RequestMapping("/apartamentos")
@CrossOrigin(origins = "*")
public class ApartamentoController {

    @Autowired
    private ApartamentoRepository apartamentoRepository;

    @GetMapping
    public List<Apartamento> listarTodos() {
        return apartamentoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Apartamento buscarPorId(@PathVariable int id) {
        return apartamentoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Apartamento criar(@RequestBody Apartamento obj) {
        return apartamentoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Apartamento atualizar(@PathVariable int id, @RequestBody Apartamento obj) {
        obj.setIdApartamento(id);
        return apartamentoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        apartamentoRepository.deleteById(id);
    }
}
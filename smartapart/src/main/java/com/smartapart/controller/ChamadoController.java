package com.smartapart.controller;

import com.smartapart.model.Chamado;
import com.smartapart.repository.ChamadoRepository;
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
@RequestMapping("/chamados")
@CrossOrigin(origins = "*")
public class ChamadoController {

    @Autowired
    private ChamadoRepository chamadoRepository;

    @GetMapping
    public List<Chamado> listarTodos() {
        return chamadoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Chamado buscarPorId(@PathVariable int id) {
        return chamadoRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Chamado criar(@RequestBody Chamado obj) {
        return chamadoRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Chamado atualizar(@PathVariable int id, @RequestBody Chamado obj) {
        obj.setIdChamado(id);
        return chamadoRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        chamadoRepository.deleteById(id);
    }
}
package com.smartapart.controller;

import com.smartapart.model.Avisos;
import com.smartapart.service.AvisoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/avisos")
public class AvisoController {

    @Autowired
    private AvisoService avisoService;

    @GetMapping
    public List<Avisos> listarTodos() {
        return avisoService.listarTodos();
    }

    @GetMapping("/recentes")
    public List<Avisos> listarRecentes() {
        return avisoService.listarRecentes();
    }

    @PostMapping
    public Avisos criar(@RequestBody Avisos aviso, @RequestParam String nomeSindico) {
        return avisoService.criar(aviso, nomeSindico);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable int id, @RequestParam String nomeSindico) {
        avisoService.remover(id, nomeSindico);
    }
}
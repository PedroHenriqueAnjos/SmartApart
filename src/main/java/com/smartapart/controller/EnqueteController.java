package com.smartapart.controller;

import com.smartapart.model.Enquete;
import com.smartapart.service.EnqueteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/enquetes")
public class EnqueteController {

    @Autowired
    private EnqueteService enqueteService;

    @GetMapping
    public List<Enquete> listarTodas() {
        return enqueteService.listarTodas();
    }

    @PostMapping
    public Enquete criar(@RequestBody Enquete enquete, @RequestParam String nomeSindico) {
        return enqueteService.criar(enquete, nomeSindico);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable int id, @RequestParam String nomeSindico) {
        enqueteService.remover(id, nomeSindico);
    }

    @PutMapping("/{id}/votar")
    public Enquete votar(@PathVariable int id, @RequestParam int opcao) {
        return enqueteService.votar(id, opcao);
    }
}
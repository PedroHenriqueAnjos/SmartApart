package com.smartapart.controller;

import com.smartapart.model.Visitante;
import com.smartapart.service.VisitanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/visitantes")
public class VisitanteController {

    @Autowired
    private VisitanteService visitanteService;

    @PostMapping
    public Visitante solicitar(@RequestBody Visitante visitante) {
        return visitanteService.solicitar(visitante);
    }

    @DeleteMapping("/{id}")
    public boolean cancelar(@PathVariable int id) {
        return visitanteService.cancelar(id);
    }

    @PutMapping("/{id}/confirmar")
    public Visitante confirmar(@PathVariable int id, @RequestParam String nomePorteiro) {
        return visitanteService.confirmar(id, nomePorteiro);
    }

    @GetMapping("/pendentes")
    public List<Visitante> listarPendentes() {
        return visitanteService.listarPendentes();
    }

    @GetMapping("/inquilino/{idInquilino}")
    public List<Visitante> listarPorInquilino(@PathVariable int idInquilino) {
        return visitanteService.listarPorInquilino(idInquilino);
    }

    @GetMapping("/dono/{idDono}")
    public List<Visitante> listarPorDono(@PathVariable int idDono) {
        return visitanteService.listarPorDono(idDono);
    }
}
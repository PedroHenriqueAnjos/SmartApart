package com.smartapart.controller;

import com.smartapart.model.Encomenda;
import com.smartapart.service.EncomendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/encomendas")
public class EncomendaController {

    @Autowired
    private EncomendaService encomendaService;

    @PostMapping
    public Encomenda registrar(@RequestBody Encomenda encomenda, @RequestParam String nomePorteiro) {
        return encomendaService.registrar(encomenda, nomePorteiro);
    }

    @PutMapping("/{id}/status")
    public Encomenda atualizarStatus(@PathVariable int id, @RequestParam String status,
            @RequestParam String nomePorteiro) {
        return encomendaService.atualizarStatus(id, status, nomePorteiro);
    }

    @GetMapping("/inquilino/{idInquilino}")
    public List<Encomenda> listarPorInquilino(@PathVariable int idInquilino) {
        return encomendaService.listarPorInquilino(idInquilino);
    }

    @GetMapping("/dono/{idDono}")
    public List<Encomenda> listarPorDono(@PathVariable int idDono) {
        return encomendaService.listarPorDono(idDono);
    }

    @PutMapping("/{id}/retirar")
    public Encomenda marcarComoRetirada(@PathVariable int id) {
        return encomendaService.marcarComoRetirada(id);
    }
}
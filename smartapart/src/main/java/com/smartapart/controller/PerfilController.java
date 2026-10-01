package com.smartapart.controller;

import com.smartapart.service.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/perfil")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PutMapping("/inquilino/{id}")
    public Object atualizarInquilino(@PathVariable int id, @RequestParam String nome) {
        return perfilService.atualizarInquilino(id, nome);
    }

    @PutMapping("/dono/{id}")
    public Object atualizarDono(@PathVariable int id, @RequestParam String nome) {
        return perfilService.atualizarDono(id, nome);
    }

    @PutMapping("/funcionario/{id}")
    public Object atualizarFuncionario(@PathVariable int id, @RequestParam String nome) {
        return perfilService.atualizarFuncionario(id, nome);
    }
}
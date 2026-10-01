package com.smartapart.controller;

import com.smartapart.model.AlterarFotoRequest;
import com.smartapart.service.FotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/foto")
public class FotoController {

    @Autowired
    private FotoService fotoService;

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarFoto(
            @PathVariable int id,
            @RequestParam String tipoUsuario,
            @RequestBody AlterarFotoRequest request) {
        try {
            Object resultado = fotoService.atualizarFoto(id, tipoUsuario, request.getFotoBase64());
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarFoto(
            @PathVariable int id,
            @RequestParam String tipoUsuario) {
        String foto = fotoService.buscarFoto(id, tipoUsuario);
        if (foto == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("foto", foto));
    }
}
package com.smartapart.controller;

import com.smartapart.model.Reserva;
import com.smartapart.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService ReservaService;

    @GetMapping("/inquilino/{idInquilino}")
    public List<Reserva> listarPorInquilino(@PathVariable int idInquilino) {
        return ReservaService.listarPorInquilino(idInquilino);
    }

    @PostMapping
    public ResponseEntity<Reserva> solicitar(@RequestBody Reserva reserva) {
        Reserva resultado = ReservaService.solicitar(reserva);
        if (resultado == null) {
            return ResponseEntity.status(409).build();
        }
        return ResponseEntity.ok(resultado);
    }

    @PutMapping("/{id}/cancelar")
    public Reserva cancelar(@PathVariable int id) {
        return ReservaService.cancelar(id);
    }
}
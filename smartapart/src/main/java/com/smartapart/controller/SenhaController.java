package com.smartapart.controller;

import com.smartapart.service.SenhaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/senha")
public class SenhaController {

    @Autowired
    private SenhaService senhaService;

    @PostMapping("/redefinir")
    public ResponseEntity<?> redefinir(@RequestBody Map<String, Object> corpo) {
        try {
            senhaService.redefinir(corpo);
            return ResponseEntity.ok(Map.of("mensagem", "Senha alterada"));
        } catch (SenhaService.LimiteExcedidoException e) {
            return ResponseEntity.status(429).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}

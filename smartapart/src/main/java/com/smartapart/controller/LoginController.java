package com.smartapart.controller;

import com.smartapart.model.LoginRequest;
import com.smartapart.model.LoginResponse;
import com.smartapart.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse resposta = loginService.login(request);
            if (resposta == null) {
                return ResponseEntity.status(401).build();
            }
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // @PostMapping
    // public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request)
    // {
    // LoginResponse resposta = loginService.login(request);
    // if (resposta == null) {
    // return ResponseEntity.status(401).build();
    // }
    // return ResponseEntity.ok(resposta);
    // }
}
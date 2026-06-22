package com.smartapart.controller;

import com.smartapart.model.Mensagem;
import com.smartapart.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public List<Mensagem> listar() {
        return chatService.listarMensagens();
    }

    @PostMapping
    public Mensagem enviar(@RequestBody Mensagem mensagem) {
        return chatService.enviar(mensagem);
    }
}
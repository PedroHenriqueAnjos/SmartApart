package com.smartapart.service;

import com.smartapart.model.Mensagem;
import com.smartapart.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private MensagemRepository mensagemRepository;

    public List<Mensagem> listarMensagens() {
        return mensagemRepository.findAllByOrderByDataEnvioAsc();
    }

    public Mensagem enviar(Mensagem mensagem) {
        mensagem.setDataEnvio(LocalDateTime.now());
        return mensagemRepository.save(mensagem);
    }
}
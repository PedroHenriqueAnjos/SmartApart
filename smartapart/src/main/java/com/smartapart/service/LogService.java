package com.smartapart.service;

import com.smartapart.model.LogAcao;
import com.smartapart.repository.LogAcaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogAcaoRepository logAcaoRepository;

    public void registrar(String descricao, String autor) {
        LogAcao log = new LogAcao();
        log.setDescricao(descricao);
        log.setAutor(autor);
        log.setDataAcao(LocalDateTime.now());
        logAcaoRepository.save(log);
    }

    public List<LogAcao> listarTodos() {
        return logAcaoRepository.findAllByOrderByDataAcaoDesc();
    }
}
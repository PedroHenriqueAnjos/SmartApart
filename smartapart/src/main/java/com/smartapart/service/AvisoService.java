package com.smartapart.service;

import com.smartapart.model.Avisos;
import com.smartapart.repository.AvisosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AvisoService {

    @Autowired
    private AvisosRepository avisosRepository;

    @Autowired
    private LogService logService;

    public List<Avisos> listarTodos() {
        return avisosRepository.findAll();
    }

    public List<Avisos> listarRecentes() {
        return avisosRepository.findTop5ByOrderByDataDesc();
    }

    public Avisos criar(Avisos aviso, String nomeSindico) {
        aviso.setData(LocalDate.now());
        Avisos salvo = avisosRepository.save(aviso);
        logService.registrar("Criou o aviso " + aviso.getAssunto(), nomeSindico);
        return salvo;
    }

    public void remover(int idAvisos, String nomeSindico) {
        Avisos aviso = avisosRepository.findById(idAvisos).orElse(null);
        if (aviso == null) {
            return;
        }
        avisosRepository.deleteById(idAvisos);
        logService.registrar("Removeu o aviso " + aviso.getAssunto(), nomeSindico);
    }
}
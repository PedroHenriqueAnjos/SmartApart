package com.smartapart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartapart.model.Visitante;
import com.smartapart.repository.VisitanteRepository;

@Service
public class VisitanteService {

    @Autowired
    private VisitanteRepository visitanteRepository;

    @Autowired
    private LogService logService;

    public Visitante solicitar(Visitante visitante) {
        visitante.setStatus("Pendente");
        return visitanteRepository.save(visitante);
    }

    public boolean cancelar(int idVisitante) {
        Visitante visitante = visitanteRepository.findById(idVisitante).orElse(null);
        if (visitante == null) {
            return false;
        }
        if (!visitante.getStatus().equals("Pendente")) {
            return false;
        }
        visitanteRepository.deleteById(idVisitante);
        return true;
    }

    public Visitante confirmar(int idVisitante, String nomePorteiro) {
        Visitante visitante = visitanteRepository.findById(idVisitante).orElse(null);
        if (visitante == null) {
            return null;
        }
        visitante.setStatus("Liberado");
        logService.registrar("Liberou o visitante " + visitante.getNome(), nomePorteiro);
        return visitanteRepository.save(visitante);
    }

    public List<Visitante> listarPendentes() {
        return visitanteRepository.findByStatus("Pendente");
    }

    public List<Visitante> listarPorInquilino(int idInquilino) {
        return visitanteRepository.findByIdInquilino(idInquilino);
    }

    public List<Visitante> listarPorDono(int idDono) {
        return visitanteRepository.findByIdDono(idDono);
    }
}
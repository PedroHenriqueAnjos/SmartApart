package com.smartapart.service;

import com.smartapart.model.Encomenda;
import com.smartapart.repository.EncomendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EncomendaService {

    @Autowired
    private EncomendaRepository encomendaRepository;

    @Autowired
    private LogService logService;

    public List<Encomenda> listarTodas() {
        return encomendaRepository.findAll();
    }

    public Encomenda registrar(Encomenda encomenda, String nomePorteiro) {
        encomenda.setDataRecebimento(LocalDateTime.now());
        encomenda.setStatus("Recebida");
        Encomenda salva = encomendaRepository.save(encomenda);
        logService.registrar("Registrou uma encomenda no apartamento " + encomenda.getIdApartamento(), nomePorteiro);
        return salva;
    }

    public Encomenda atualizarStatus(int idEncomenda, String status, String nomePorteiro) {
        Encomenda encomenda = encomendaRepository.findById(idEncomenda).orElse(null);
        if (encomenda == null) {
            return null;
        }
        encomenda.setStatus(status);
        logService.registrar("Atualizou a encomenda " + idEncomenda + " para " + status, nomePorteiro);
        return encomendaRepository.save(encomenda);
    }

    public List<Encomenda> listarPorInquilino(int idInquilino) {
        return encomendaRepository.findByIdInquilino(idInquilino);
    }

    public List<Encomenda> listarPorDono(int idDono) {
        return encomendaRepository.findByIdDono(idDono);
    }

    public Encomenda marcarComoRetirada(int idEncomenda) {
        Encomenda encomenda = encomendaRepository.findById(idEncomenda).orElse(null);
        if (encomenda == null) {
            return null;
        }
        encomenda.setStatus("Retirada");
        return encomendaRepository.save(encomenda);
    }
}
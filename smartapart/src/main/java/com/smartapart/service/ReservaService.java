package com.smartapart.service;

import com.smartapart.model.Reserva;
import com.smartapart.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    public List<Reserva> listarPorInquilino(int idInquilino) {
        return reservaRepository.findByIdInquilino(idInquilino);
    }

    public Reserva solicitar(Reserva reserva) {

        reserva.setStatus("PENDENTE");

        return reservaRepository.save(reserva);
    }

    public Reserva cancelar(int id) {

        Reserva reserva = reservaRepository.findById(id).orElse(null);

        if (reserva != null) {
            reserva.setStatus("CANCELADA");
            reservaRepository.save(reserva);
        }

        return reserva;
    }
    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public Reserva confirmar(int id, String nomePorteiro) {
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva == null) {
            return null;
        }
        reserva.setStatus("CONFIRMADA");
        return reservaRepository.save(reserva);
    }
}
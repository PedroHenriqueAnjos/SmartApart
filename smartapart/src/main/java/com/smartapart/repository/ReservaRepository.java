package com.smartapart.repository;

import com.smartapart.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByIdInquilino(int idInquilino);

    List<Reserva> findByIdSalaoAndDataPrevistaAndStatusNot(int idSalao, LocalDate dataPrevista, String status);
}

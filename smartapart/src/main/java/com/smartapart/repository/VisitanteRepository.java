package com.smartapart.repository;

import com.smartapart.model.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitanteRepository extends JpaRepository<Visitante, Integer> {
    List<Visitante> findByStatus(String status);

    List<Visitante> findByIdInquilino(Integer idInquilino);

    List<Visitante> findByIdDono(Integer idDono);
}
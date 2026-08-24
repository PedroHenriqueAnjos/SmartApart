package com.smartapart.repository;

import com.smartapart.model.Encomenda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EncomendaRepository extends JpaRepository<Encomenda, Integer> {
    List<Encomenda> findByIdInquilino(Integer idInquilino);

    List<Encomenda> findByIdDono(Integer idDono);
}
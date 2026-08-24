package com.smartapart.repository;

import com.smartapart.model.Avisos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvisosRepository extends JpaRepository<Avisos, Integer> {
    List<Avisos> findTop5ByOrderByDataDesc();
}
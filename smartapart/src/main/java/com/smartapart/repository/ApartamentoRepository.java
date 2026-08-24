package com.smartapart.repository;

import com.smartapart.model.Apartamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartamentoRepository extends JpaRepository<Apartamento, Integer> {

}
package com.smartapart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartapart.model.Dono;

public interface DonoRepository extends JpaRepository<Dono, Integer> {
    List<Dono> findByCpf(String cpf);
}
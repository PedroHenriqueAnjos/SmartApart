package com.smartapart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartapart.model.Sindico;

public interface SindicoRepository extends JpaRepository<Sindico, Integer> {
    List<Sindico> findByCpf(String cpf);
}
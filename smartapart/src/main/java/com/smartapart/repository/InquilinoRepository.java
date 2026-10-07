package com.smartapart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartapart.model.Inquilino;

public interface InquilinoRepository extends JpaRepository<Inquilino, Integer> {
    List<Inquilino> findByCpf(String cpf);
}
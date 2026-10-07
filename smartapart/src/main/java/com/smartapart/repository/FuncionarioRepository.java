package com.smartapart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartapart.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    List<Funcionario> findByCpf(String cpf);
}
package com.smartapart.repository;

import com.smartapart.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
    Optional<Funcionario> findByCpfAndSenha(String cpf, String senha);
}
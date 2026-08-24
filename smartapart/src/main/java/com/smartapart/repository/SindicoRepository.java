package com.smartapart.repository;

import com.smartapart.model.Sindico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SindicoRepository extends JpaRepository<Sindico, Integer> {
    Optional<Sindico> findByCpfAndSenha(String cpf, String senha);
}
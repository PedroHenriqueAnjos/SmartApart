package com.smartapart.repository;

import com.smartapart.model.Inquilino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InquilinoRepository extends JpaRepository<Inquilino, Integer> {
    Optional<Inquilino> findByCpfAndSenha(String cpf, String senha);
}
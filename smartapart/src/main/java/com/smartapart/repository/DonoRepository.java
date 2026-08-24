package com.smartapart.repository;

import com.smartapart.model.Dono;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DonoRepository extends JpaRepository<Dono, Integer> {
    Optional<Dono> findByCpfAndSenha(String cpf, String senha);
}
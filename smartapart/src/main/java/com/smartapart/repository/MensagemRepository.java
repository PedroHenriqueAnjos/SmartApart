package com.smartapart.repository;

import com.smartapart.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Integer> {
    List<Mensagem> findAllByOrderByDataEnvioAsc();
}
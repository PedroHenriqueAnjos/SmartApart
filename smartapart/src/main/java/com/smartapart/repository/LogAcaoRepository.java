
package com.smartapart.repository;

import com.smartapart.model.LogAcao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogAcaoRepository extends JpaRepository<LogAcao, Integer> {
    List<LogAcao> findAllByOrderByDataAcaoDesc();
}
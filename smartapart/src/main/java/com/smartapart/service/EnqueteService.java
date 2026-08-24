package com.smartapart.service;

import com.smartapart.model.Enquete;
import com.smartapart.repository.EnqueteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class EnqueteService {

    @Autowired
    private EnqueteRepository enqueteRepository;

    @Autowired
    private LogService logService;

    public List<Enquete> listarTodas() {
        return enqueteRepository.findAll();
    }

    public Enquete criar(Enquete enquete, String nomeSindico) {
        enquete.setData(LocalDate.now());
        Enquete salva = enqueteRepository.save(enquete);
        logService.registrar("Criou a enquete " + enquete.getAssunto(), nomeSindico);
        return salva;
    }

    public void remover(int idEnquete, String nomeSindico) {
        Enquete enquete = enqueteRepository.findById(idEnquete).orElse(null);
        if (enquete == null) {
            return;
        }
        enqueteRepository.deleteById(idEnquete);
        logService.registrar("Removeu a enquete " + enquete.getAssunto(), nomeSindico);
    }

    public Enquete votar(int idEnquete, int opcao) {
        Enquete enquete = enqueteRepository.findById(idEnquete).orElse(null);
        if (enquete == null) {
            return null;
        }

        if (opcao == 1) {
            enquete.setOp1(enquete.getOp1() + 1);
        } else if (opcao == 2) {
            enquete.setOp2(enquete.getOp2() + 1);
        } else if (opcao == 3) {
            enquete.setOp3(enquete.getOp3() + 1);
        } else if (opcao == 4) {
            enquete.setOp4(enquete.getOp4() + 1);
        } else {
            return enquete;
        }

        return enqueteRepository.save(enquete);
    }
}
package com.smartapart.controller;

import com.smartapart.model.LogAcao;
import com.smartapart.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/log")
public class LogController {

    @Autowired
    private LogService logService;

    @GetMapping
    public List<LogAcao> listar() {
        return logService.listarTodos();
    }
}
package com.smartapart.controller;

import com.smartapart.model.Tarefa;
import com.smartapart.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
@CrossOrigin(origins = "*")
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;

    @GetMapping
    public List<Tarefa> listarTodos() {
        return tarefaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Tarefa buscarPorId(@PathVariable int id) {
        return tarefaRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Tarefa criar(@RequestBody Tarefa obj) {
        return tarefaRepository.save(obj);
    }

    @PutMapping("/{id}")
    public Tarefa atualizar(@PathVariable int id, @RequestBody Tarefa obj) {
        obj.setIdTarefa(id);
        return tarefaRepository.save(obj);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        tarefaRepository.deleteById(id);
    }
}
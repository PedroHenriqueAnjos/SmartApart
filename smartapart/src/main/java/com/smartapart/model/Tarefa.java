package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "Tarefa")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Tarefa")
    private int idTarefa;

    @Column(name = "Id_Funcionario")
    private int idFuncionario;

    @Column(name = "Id_Chamado")
    private int idChamado;

    @Column(name = "Status")
    private String status;

    @Column(name = "Data_Criacao")
    private LocalDateTime dataCriacao;

    public Tarefa() {}

    public int getIdTarefa() { return idTarefa; }
    public void setIdTarefa(int idTarefa) { this.idTarefa = idTarefa; }

    public int getIdFuncionario() { return idFuncionario; }
    public void setIdFuncionario(int idFuncionario) { this.idFuncionario = idFuncionario; }

    public int getIdChamado() { return idChamado; }
    public void setIdChamado(int idChamado) { this.idChamado = idChamado; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
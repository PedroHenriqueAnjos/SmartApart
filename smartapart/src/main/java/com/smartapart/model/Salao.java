package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Salao")
public class Salao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Salao")
    private int idSalao;

    @Column(name = "Nome")
    private String nome;

    @Column(name = "Status")
    private String status;

    public Salao() {}

    public int getIdSalao() { return idSalao; }
    public void setIdSalao(int idSalao) { this.idSalao = idSalao; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
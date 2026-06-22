package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Bloco")
public class Bloco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Bloco")
    private int idBloco;

    @Column(name = "Nome")
    private String nome;

    public Bloco() {}

    public int getIdBloco() { return idBloco; }
    public void setIdBloco(int idBloco) { this.idBloco = idBloco; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
}
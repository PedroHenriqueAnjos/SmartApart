package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Visitante")
public class Visitante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Visitante")
    private int idVisitante;

    @Column(name = "Nome")
    private String nome;

    @Column(name = "CPF", nullable = true)
    private String cpf;

    @Column(name = "Id_Inquilino", nullable = true)
    private Integer idInquilino;

    @Column(name = "Id_Dono", nullable = true)
    private Integer idDono;

    @Column(name = "Prestador_bool")
    private boolean prestador;

    @Column(name = "Status")
    private String status;

    public Visitante() {
    }

    public int getIdVisitante() {
        return idVisitante;
    }

    public void setIdVisitante(int idVisitante) {
        this.idVisitante = idVisitante;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Integer getIdInquilino() {
        return idInquilino;
    }

    public void setIdInquilino(Integer idInquilino) {
        this.idInquilino = idInquilino;
    }

    public Integer getIdDono() {
        return idDono;
    }

    public void setIdDono(Integer idDono) {
        this.idDono = idDono;
    }

    public boolean isPrestador() {
        return prestador;
    }

    public void setPrestador(boolean prestador) {
        this.prestador = prestador;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Sindico")
public class Sindico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Sindico")
    private int idSindico;

    @Column(name = "Nome")
    private String nome;

    @Column(name = "CPF")
    private String cpf;

    @Column(name = "Senha")
    private String senha;

    @Column(name = "Data_Posse")
    private LocalDate dataPosse;

    @Column(name = "Data_Final_Posse", nullable = true)
    private LocalDate dataFinalPosse;

    @Column(name = "Status")
    private String status;

    @Column(name = "foto", columnDefinition = "TEXT")
    private String foto;

    public Sindico() {
    }

    public int getIdSindico() {
        return idSindico;
    }

    public void setIdSindico(int idSindico) {
        this.idSindico = idSindico;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDataPosse() {
        return dataPosse;
    }

    public void setDataPosse(LocalDate dataPosse) {
        this.dataPosse = dataPosse;
    }

    public LocalDate getDataFinalPosse() {
        return dataFinalPosse;
    }

    public void setDataFinalPosse(LocalDate dataFinalPosse) {
        this.dataFinalPosse = dataFinalPosse;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }
}
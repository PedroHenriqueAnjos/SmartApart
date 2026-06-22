package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Avisos")
public class Avisos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Avisos")
    private int idAvisos;

    @Column(name = "Id_Sindico")
    private int idSindico;

    @Column(name = "Assunto")
    private String assunto;

    @Column(name = "Texto")
    private String texto;

    @Column(name = "Data")
    private LocalDate data;

    public Avisos() {}

    public int getIdAvisos() { return idAvisos; }
    public void setIdAvisos(int idAvisos) { this.idAvisos = idAvisos; }

    public int getIdSindico() { return idSindico; }
    public void setIdSindico(int idSindico) { this.idSindico = idSindico; }

    public String getAssunto() { return assunto; }
    public void setAssunto(String assunto) { this.assunto = assunto; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
}
package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "Chamado")
public class Chamado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Chamado")
    private int idChamado;

    @Column(name = "Assunto")
    private String assunto;

    @Column(name = "Descricao")
    private String descricao;

    @Column(name = "Status")
    private String status;

    @Column(name = "Data_Abertura")
    private LocalDateTime dataAbertura;

    public Chamado() {}

    public int getIdChamado() { return idChamado; }
    public void setIdChamado(int idChamado) { this.idChamado = idChamado; }

    public String getAssunto() { return assunto; }
    public void setAssunto(String assunto) { this.assunto = assunto; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataAbertura() { return dataAbertura; }
    public void setDataAbertura(LocalDateTime dataAbertura) { this.dataAbertura = dataAbertura; }
}
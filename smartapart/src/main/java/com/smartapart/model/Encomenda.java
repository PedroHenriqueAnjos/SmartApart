package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "Encomenda")
public class Encomenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Encomenda")
    private int idEncomenda;

    @Column(name = "Id_Inquilino", nullable = true)
    private Integer idInquilino;

    @Column(name = "Id_Dono", nullable = true)
    private Integer idDono;

    @Column(name = "Id_Apartamento")
    private int idApartamento;

    @Column(name = "Data_Recebimento")
    private LocalDateTime dataRecebimento;

    @Column(name = "Status")
    private String status;

    public Encomenda() {}

    public int getIdEncomenda() { return idEncomenda; }
    public void setIdEncomenda(int idEncomenda) { this.idEncomenda = idEncomenda; }

    public Integer getIdInquilino() { return idInquilino; }
    public void setIdInquilino(Integer idInquilino) { this.idInquilino = idInquilino; }

    public Integer getIdDono() { return idDono; }
    public void setIdDono(Integer idDono) { this.idDono = idDono; }

    public int getIdApartamento() { return idApartamento; }
    public void setIdApartamento(int idApartamento) { this.idApartamento = idApartamento; }

    public LocalDateTime getDataRecebimento() { return dataRecebimento; }
    public void setDataRecebimento(LocalDateTime dataRecebimento) { this.dataRecebimento = dataRecebimento; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
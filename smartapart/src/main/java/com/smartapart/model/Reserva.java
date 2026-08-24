package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Reserva")
    private int idReserva;

    @Column(name = "Id_Inquilino")
    private int idInquilino;

    @Column(name = "Id_Salao")
    private int idSalao;

    @Column(name = "Data_Prevista")
    private LocalDate dataPrevista;

    @Column(name = "Status")
    private String status;

    public Reserva() {}

    public int getIdReserva() { return idReserva; }
    public void setIdReserva(int idReserva) { this.idReserva = idReserva; }

    public int getIdInquilino() { return idInquilino; }
    public void setIdInquilino(int idInquilino) { this.idInquilino = idInquilino; }

    public int getIdSalao() { return idSalao; }
    public void setIdSalao(int idSalao) { this.idSalao = idSalao; }

    public LocalDate getDataPrevista() { return dataPrevista; }
    public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "Apartamento")
public class Apartamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Apartamento")
    private int idApartamento;

    @Column(name = "Id_Bloco")
    private int idBloco;

    @Column(name = "Id_Inquilino", nullable = true)
    private Integer idInquilino;

    @Column(name = "Id_Dono")
    private int idDono;

    @Column(name = "Numero")
    private int numero;

    public Apartamento() {}

    public int getIdApartamento() { return idApartamento; }
    public void setIdApartamento(int idApartamento) { this.idApartamento = idApartamento; }

    public int getIdBloco() { return idBloco; }
    public void setIdBloco(int idBloco) { this.idBloco = idBloco; }

    public Integer getIdInquilino() { return idInquilino; }
    public void setIdInquilino(Integer idInquilino) { this.idInquilino = idInquilino; }

    public int getIdDono() { return idDono; }
    public void setIdDono(int idDono) { this.idDono = idDono; }

    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }
}
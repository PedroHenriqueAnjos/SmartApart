package com.smartapart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mensagem")
    private int idMensagem;

    @Column(name = "nome_remetente")
    private String nomeRemetente;

    @Column(name = "tipo_remetente")
    private String tipoRemetente;

    private String texto;

    @Column(name = "data_envio")
    private LocalDateTime dataEnvio;

    public int getIdMensagem() {
        return idMensagem;
    }

    public void setIdMensagem(int idMensagem) {
        this.idMensagem = idMensagem;
    }

    public String getNomeRemetente() {
        return nomeRemetente;
    }

    public void setNomeRemetente(String nomeRemetente) {
        this.nomeRemetente = nomeRemetente;
    }

    public String getTipoRemetente() {
        return tipoRemetente;
    }

    public void setTipoRemetente(String tipoRemetente) {
        this.tipoRemetente = tipoRemetente;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
}
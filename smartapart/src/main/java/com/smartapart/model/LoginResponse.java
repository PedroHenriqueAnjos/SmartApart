package com.smartapart.model;

public class LoginResponse {

    private int id;
    private String nome;
    private String tipo;

    public LoginResponse(int id, String nome, String tipo) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getTipo() { return tipo; }
}
package com.smartapart.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Enquete")
public class Enquete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Enquete")
    private int idEnquete;

    @Column(name = "Id_Sindico")
    private int idSindico;

    @Column(name = "Assunto")
    private String assunto;

    @Column(name = "texto_op1")
    private String textoOp1;

    @Column(name = "texto_op2")
    private String textoOp2;

    @Column(name = "texto_op3")
    private String textoOp3;

    @Column(name = "texto_op4")
    private String textoOp4;

    @Column(name = "op_1")
    private int op1;

    @Column(name = "op_2")
    private int op2;

    @Column(name = "op_3")
    private int op3;

    @Column(name = "op_4")
    private int op4;

    @Column(name = "Data")
    private LocalDate data;

    public Enquete() {
    }

    public int getIdEnquete() {
        return idEnquete;
    }

    public void setIdEnquete(int idEnquete) {
        this.idEnquete = idEnquete;
    }

    public int getIdSindico() {
        return idSindico;
    }

    public void setIdSindico(int idSindico) {
        this.idSindico = idSindico;
    }

    public String getAssunto() {
        return assunto;
    }

    public void setAssunto(String assunto) {
        this.assunto = assunto;
    }

    public String getTextoOp1() {
        return textoOp1;
    }

    public void setTextoOp1(String textoOp1) {
        this.textoOp1 = textoOp1;
    }

    public String getTextoOp2() {
        return textoOp2;
    }

    public void setTextoOp2(String textoOp2) {
        this.textoOp2 = textoOp2;
    }

    public String getTextoOp3() {
        return textoOp3;
    }

    public void setTextoOp3(String textoOp3) {
        this.textoOp3 = textoOp3;
    }

    public String getTextoOp4() {
        return textoOp4;
    }

    public void setTextoOp4(String textoOp4) {
        this.textoOp4 = textoOp4;
    }

    public int getOp1() {
        return op1;
    }

    public void setOp1(int op1) {
        this.op1 = op1;
    }

    public int getOp2() {
        return op2;
    }

    public void setOp2(int op2) {
        this.op2 = op2;
    }

    public int getOp3() {
        return op3;
    }

    public void setOp3(int op3) {
        this.op3 = op3;
    }

    public int getOp4() {
        return op4;
    }

    public void setOp4(int op4) {
        this.op4 = op4;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }
}
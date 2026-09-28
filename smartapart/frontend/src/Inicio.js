import React, { useState, useEffect } from 'react';
import { getAvisosRecentes } from './api';
import './Inicio.css';
import { User, Package, MessageCircle, Users } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Inicio({ usuario, aoNavegar, ehPorteiro }) {
    // ---------- Avisos ----------
    const [avisos, setAvisos] = useState([]);
    const [carregandoAvisos, setCarregandoAvisos] = useState(true);
    const [erroAvisos, setErroAvisos] = useState('');

    // "Marcar como lido" fica salvo só neste navegador (não vai para o backend)
    const chaveLidos = `avisosLidos_${usuario.id}`;
    const [lidos, setLidos] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(chaveLidos)) || [];
        } catch {
            return [];
        }
    });

    // ---------- Enquetes ----------
    const [enquetes, setEnquetes] = useState([]);
    const [carregandoEnquetes, setCarregandoEnquetes] = useState(true);
    const [erroEnquetes, setErroEnquetes] = useState('');

    useEffect(() => {
        carregarAvisos();
        carregarEnquetes();
    }, []);

    const carregarAvisos = async () => {
        try {
            setCarregandoAvisos(true);
            setErroAvisos('');
            const dados = await getAvisosRecentes();
            setAvisos(Array.isArray(dados) ? dados : []);
        } catch (err) {
            setErroAvisos('Erro ao carregar avisos');
            console.error(err);
        } finally {
            setCarregandoAvisos(false);
        }
    };

    const carregarEnquetes = async () => {
        try {
            setCarregandoEnquetes(true);
            setErroEnquetes('');
            const res = await fetch(`${API_URL}/enquetes`);
            if (!res.ok) throw new Error();
            const dados = await res.json();
            setEnquetes(Array.isArray(dados) ? dados : []);
        } catch {
            setErroEnquetes('Erro ao carregar enquetes');
        } finally {
            setCarregandoEnquetes(false);
        }
    };

    const alternarLido = (idAviso) => {
        const novo = lidos.includes(idAviso)
            ? lidos.filter((id) => id !== idAviso)
            : [...lidos, idAviso];
        setLidos(novo);
        try {
            localStorage.setItem(chaveLidos, JSON.stringify(novo));
        } catch { /* sem armazenamento disponível: ignora */ }
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const totalVotos = (e) => (e.op1 || 0) + (e.op2 || 0) + (e.op3 || 0) + (e.op4 || 0);

    const porcentagem = (votos, total) => {
        if (total === 0) return 0;
        return Math.round(((votos || 0) / total) * 100);
    };

    // ---------- Atalhos clicáveis (imagem em cima, texto embaixo) ----------
    // Para usar imagem de verdade: coloque o arquivo em public/ e troque
    // o <Icone /> por <img src={`${process.env.PUBLIC_URL}/arquivo.png`} alt="" />
    const atalhos = [
        { aba: 'encomendas', rotulo: 'encomendas', Icone: Package },
        { aba: 'chat', rotulo: 'chat', Icone: MessageCircle, oculto: ehPorteiro },
        { aba: 'visitantes', rotulo: 'visitantes', Icone: Users },
    ].filter((a) => !a.oculto);

    return (
        <div id="Inicio_Pagina">

            <button id="Inicio_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                <User size={28} />
            </button>

            <div id="Aviso_Container">
                <h1>AVISOS</h1>

                {carregandoAvisos && <p className="mensagem-info">Carregando avisos...</p>}
                {erroAvisos && <p className="mensagem-erro">{erroAvisos}</p>}
                {!carregandoAvisos && !erroAvisos && avisos.length === 0 && (
                    <p className="mensagem-info">Nenhum aviso no momento</p>
                )}

                <div id="Avisos_Lista">
                    {avisos.map((aviso) => {
                        const lido = lidos.includes(aviso.idAvisos);
                        return (
                            <div key={aviso.idAvisos} className="aviso-bloco">
                                <div className={`aviso-card Green_Box_Full ${lido ? 'lido' : ''}`}>
                                    <div className="card-avatar"><User size={28} /></div>
                                    <div className="card-corpo">
                                        <h2 className="card-titulo">{aviso.assunto}</h2>
                                        <p className="aviso-texto">{aviso.texto}</p>
                                        <span className="card-data">{formatarData(aviso.data)}</span>
                                    </div>
                                </div>

                                <label className="aviso-lido">
                                    <input type="checkbox" checked={lido} onChange={() => alternarLido(aviso.idAvisos)} />
                                    <span>Marcar como lido</span>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

            <hr className="divisor-inicio" />

            <div id="Enquentes">
                <h1 id="h1_maldito">ENQUETES</h1>

                {carregandoEnquetes && <p className="mensagem-info">Carregando enquetes...</p>}
                {erroEnquetes && <p className="mensagem-erro">{erroEnquetes}</p>}
                {!carregandoEnquetes && !erroEnquetes && enquetes.length === 0 && (
                    <p className="mensagem-info">Nenhuma enquete no momento</p>
                )}

                <div className="enquetes-lista">
                    {enquetes.map((enq) => {
                        const total = totalVotos(enq);
                        const opcoes = [
                            { texto: enq.textoOp1, votos: enq.op1, num: 1 },
                            { texto: enq.textoOp2, votos: enq.op2, num: 2 },
                            { texto: enq.textoOp3, votos: enq.op3, num: 3 },
                            { texto: enq.textoOp4, votos: enq.op4, num: 4 },
                        ].filter((op) => op.texto);

                        return (
                            <div key={enq.idEnquete} className="enquete-card Green_Box_Full">
                                <div className="enquete-cabecalho">
                                    <div className="card-avatar"><User size={28} /></div>
                                    <div className="card-corpo">
                                        <h2 className="card-titulo">{enq.assunto}</h2>
                                        <p className="enquete-info">
                                            {formatarData(enq.data)} · {total} voto{total !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                {opcoes.map((op) => (
                                    <div key={op.num} className="enquete-opcao">
                                        <div className="opcao-trilho">
                                            <div className="Gold_Pill_Full opcao-preenchimento"
                                                style={{ width: `${porcentagem(op.votos, total)}%` }} />
                                        </div>
                                        <span className="opcao-texto">
                                            {op.texto} · {porcentagem(op.votos, total)}% ({op.votos || 0})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <hr className="divisor-inicio" />

            <nav id="Inicio_Atalhos" className="Green_Box_Full">
                {atalhos.map(({ aba, rotulo, Icone }) => (
                    <button key={aba} className="atalho" onClick={() => aoNavegar(aba)}>
                        <span className="atalho-imagem"><Icone size={44} /></span>
                        <span className="atalho-rotulo">{rotulo}</span>
                    </button>
                ))}
            </nav>

        </div>
    );
}

export default Inicio;
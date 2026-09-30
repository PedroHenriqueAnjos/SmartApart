import React, { useState, useEffect, useRef } from 'react';
import { getAvisosRecentes } from './api';
import './Inicio.css';
import { User, Package, MessageCircle, Users, BarChart2, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = "http://localhost:8080";

// Carrossel horizontal: um item por vez, com setas, pontos e arrastar/deslizar
function Carrossel({ id, itens, renderItem, rotulo }) {
    const faixaRef = useRef(null);
    const [indice, setIndice] = useState(0);

    const irPara = (novo) => {
        const faixa = faixaRef.current;
        if (!faixa) return;
        const alvo = Math.max(0, Math.min(itens.length - 1, novo));
        faixa.scrollTo({ left: alvo * faixa.clientWidth, behavior: 'smooth' });
    };

    const aoRolar = () => {
        const faixa = faixaRef.current;
        if (!faixa || faixa.clientWidth === 0) return;
        setIndice(Math.round(faixa.scrollLeft / faixa.clientWidth));
    };

    if (itens.length === 0) return null;

    return (
        <div id={id} className="carrossel-inicio">
            {itens.length > 1 && (
                <button className="Green_Button_Full carrossel-seta esquerda"
                    onClick={() => irPara(indice - 1)} disabled={indice === 0}
                    aria-label={`${rotulo} anterior`}>
                    <ChevronLeft size={22} />
                </button>
            )}

            <div className="carrossel-faixa" ref={faixaRef} onScroll={aoRolar}>
                {itens.map((item, i) => (
                    <div key={i} className="carrossel-slide">
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            {itens.length > 1 && (
                <button className="Green_Button_Full carrossel-seta direita"
                    onClick={() => irPara(indice + 1)} disabled={indice === itens.length - 1}
                    aria-label={`próximo ${rotulo}`}>
                    <ChevronRight size={22} />
                </button>
            )}

            {itens.length > 1 && (
                itens.length <= 10 ? (
                    <div className="carrossel-pontos">
                        {itens.map((_, i) => (
                            <button key={i} className={`carrossel-ponto ${i === indice ? 'ativo' : ''}`}
                                onClick={() => irPara(i)} aria-label={`${rotulo} ${i + 1}`} />
                        ))}
                    </div>
                ) : (
                    <p className="carrossel-contador">{indice + 1} / {itens.length}</p>
                )
            )}
        </div>
    );
}

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

    // Só síndico e morador/dono acessam a tela de enquetes
    const podeVerEnquetes = ['SINDICO', 'MORADOR', 'DONO'].includes(usuario.tipo);

    // Morador/dono reservam; porteiro só consulta
const podeVerSalao = ['MORADOR', 'DONO', 'PORTEIRO','SINDICO'].includes(usuario.tipo);
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

    // Clique (ou Enter/Espaço) no card de aviso ou de enquete abre a tela de enquetes
    const propsClique = podeVerEnquetes ? {
        role: 'button',
        tabIndex: 0,
        title: 'Ver enquetes',
        onClick: () => aoNavegar('enquetes'),
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                aoNavegar('enquetes');
            }
        }
    } : {};

    // ---------- Slides ----------
    const renderAviso = (aviso) => {
        const lido = lidos.includes(aviso.idAvisos);
        return (
            <div className="aviso-bloco">
                <div className={`aviso-card Green_Box_Full ${lido ? 'lido' : ''} ${podeVerEnquetes ? 'clicavel' : ''}`}
                    {...propsClique}>
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
    };

    const renderEnquete = (enq) => {
        const total = totalVotos(enq);
        const opcoes = [
            { texto: enq.textoOp1, votos: enq.op1, num: 1 },
            { texto: enq.textoOp2, votos: enq.op2, num: 2 },
            { texto: enq.textoOp3, votos: enq.op3, num: 3 },
            { texto: enq.textoOp4, votos: enq.op4, num: 4 },
        ].filter((op) => op.texto);

        return (
            <div className={`enquete-card Green_Box_Full ${podeVerEnquetes ? 'clicavel' : ''}`} {...propsClique}>
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
    };

    // ---------- Atalhos clicáveis (imagem em cima, texto embaixo) ----------
    // Para usar imagem de verdade: coloque o arquivo em public/ e troque
    // o <Icone /> por <img src={`${process.env.PUBLIC_URL}/arquivo.png`} alt="" />
    const atalhos = [
    { aba: ehPorteiro ? 'encomendasPorteiro' : 'encomendas', rotulo: 'encomendas', Icone: Package },,
    { aba: 'chat', rotulo: 'chat', Icone: MessageCircle, oculto: ehPorteiro },
    { aba: 'visitantes', rotulo: 'visitantes', Icone: Users },
    { aba: 'enquetes', rotulo: 'enquetes', Icone: BarChart2, oculto: !podeVerEnquetes },
    { aba: ehPorteiro ? 'salaoPorteiro' : 'salao', rotulo: 'salão', Icone: CalendarDays, oculto: !podeVerSalao },
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

                <Carrossel id="Inicio_Avisos_Lista" itens={avisos} renderItem={renderAviso} rotulo="aviso" />
            </div>

            <hr className="divisor-inicio" />

            <div id="Enquentes">
                <h1 id="h1_maldito">ENQUETES</h1>

                {carregandoEnquetes && <p className="mensagem-info">Carregando enquetes...</p>}
                {erroEnquetes && <p className="mensagem-erro">{erroEnquetes}</p>}
                {!carregandoEnquetes && !erroEnquetes && enquetes.length === 0 && (
                    <p className="mensagem-info">Nenhuma enquete no momento</p>
                )}

                <Carrossel id="Inicio_Enquetes_Lista" itens={enquetes} renderItem={renderEnquete} rotulo="enquete" />
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
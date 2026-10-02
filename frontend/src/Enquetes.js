import React, { useState, useEffect } from 'react';
import './Enquetes.css';
import { ArrowLeft, User, X, Plus, Check, Trash2 } from 'lucide-react';
import { supabase } from './supabaseClient';

const API_URL = "http://localhost:8080";
const BUCKET = 'avatars';

function Enquetes({ usuario, aoNavegar }) {
    const [enquetes, setEnquetes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ assunto: '', op1: '', op2: '', op3: '', op4: '' });
    const [foto, setFoto] = useState(null);

    // ---------- Mini-menu do botão "+" ----------
    const [mostrarMenu, setMostrarMenu] = useState(false);

    // ---------- Novo aviso ----------
    const [mostrarFormAviso, setMostrarFormAviso] = useState(false);
    const [formAviso, setFormAviso] = useState({ assunto: '', texto: '' });

    useEffect(() => {
        carregarFoto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const carregarFoto = async () => {
        try {
            const res = await fetch(`${API_URL}/foto/${usuario.id}?tipoUsuario=${usuario.tipo}`);
            if (res.ok && res.status !== 204) {
                const dados = await res.json();
                setFoto(dados.foto || null);
            }
        } catch {
            // sem foto ou backend indisponível: mantém o ícone padrão
        }
    };
    const ehSindico = usuario.tipo === 'SINDICO';

    useEffect(() => { carregarEnquetes(); }, []);

    const carregarEnquetes = async () => {
        try {
            setCarregando(true);
            setErro('');
            const res = await fetch(`${API_URL}/enquetes`);
            if (!res.ok) throw new Error();
            setEnquetes(await res.json());
        } catch {
            setErro('Erro ao carregar enquetes');
        } finally {
            setCarregando(false);
        }
    };

    // ---------- Mini-menu ----------
    const alternarMenu = () => {
        setMostrarMenu((atual) => !atual);
    };

    const escolherEnquete = () => {
        setMostrarMenu(false);
        abrirForm();
    };

    const escolherAviso = () => {
        setMostrarMenu(false);
        abrirFormAviso();
    };

    // ---------- Formulário de enquete (já existente) ----------
    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setFormData({ assunto: '', op1: '', op2: '', op3: '', op4: '' });
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
    };

    const handleCriar = async (e) => {
        e.preventDefault();
        if (!formData.assunto.trim() || !formData.op1.trim() || !formData.op2.trim()) {
            setErro('Assunto e pelo menos 2 opções são obrigatórios');
            return;
        }
        try {
            setErro('');
            const res = await fetch(`${API_URL}/enquetes?nomeSindico=${encodeURIComponent(usuario.nome)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idSindico: usuario.id,
                    assunto: formData.assunto,
                    textoOp1: formData.op1,
                    textoOp2: formData.op2,
                    textoOp3: formData.op3 || null,
                    textoOp4: formData.op4 || null,
                    op1: 0, op2: 0, op3: 0, op4: 0
                })
            });
            if (!res.ok) throw new Error();
            setSucesso('Enquete criada!');
            setFormData({ assunto: '', op1: '', op2: '', op3: '', op4: '' });
            setMostrarForm(false);
            carregarEnquetes();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao criar enquete');
        }
    };

    // ---------- Formulário de aviso (novo) ----------
    const abrirFormAviso = () => {
        setMostrarFormAviso(true);
        setErro('');
        setFormAviso({ assunto: '', texto: '' });
    };

    const fecharFormAviso = () => {
        setMostrarFormAviso(false);
        setErro('');
    };

    const handleCriarAviso = async (e) => {
        e.preventDefault();
        if (!formAviso.assunto.trim() || !formAviso.texto.trim()) {
            setErro('Assunto e texto são obrigatórios');
            return;
        }
        try {
            setErro('');
            const res = await fetch(`${API_URL}/avisos?nomeSindico=${encodeURIComponent(usuario.nome)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assunto: formAviso.assunto,
                    texto: formAviso.texto
                })
            });
            if (!res.ok) throw new Error();
            setSucesso('Aviso criado!');
            setFormAviso({ assunto: '', texto: '' });
            setMostrarFormAviso(false);
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao criar aviso');
        }
    };

    const handleVotar = async (idEnquete, opcao) => {
        try {
            setErro('');
            const res = await fetch(`${API_URL}/enquetes/${idEnquete}/votar?opcao=${opcao}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            setSucesso('Voto registrado!');
            carregarEnquetes();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao votar');
        }
    };

    const handleRemover = async (idEnquete) => {
        try {
            const res = await fetch(`${API_URL}/enquetes/${idEnquete}?nomeSindico=${encodeURIComponent(usuario.nome)}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error();
            carregarEnquetes();
        } catch {
            setErro('Erro ao remover enquete');
        }
    };

    const totalVotos = (e) => (e.op1 || 0) + (e.op2 || 0) + (e.op3 || 0) + (e.op4 || 0);

    const porcentagem = (votos, total) => {
        if (total === 0) return 0;
        return Math.round(((votos || 0) / total) * 100);
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    return (
        <div id="Enquetes_Pagina">

            <button id="Enquetes_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="Enquetes_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
            </button>

            <h1 id="Enquetes_Titulo">ENQUETES</h1>

            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
            {!mostrarForm && !mostrarFormAviso && erro && <p className="mensagem-erro">{erro}</p>}

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && enquetes.length === 0 && !erro && (
                <p className="mensagem-info">Nenhuma enquete disponível</p>
            )}

            <div id="Enquetes_Lista">
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
                               <div className="card-avatar">
                                    {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
                                </div>
                                <div className="card-corpo">
                                    <h2 className="card-titulo">{enq.assunto}</h2>
                                    <p className="enquete-info">
                                        {formatarData(enq.data)} · {total} voto{total !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {ehSindico && (
                                    <button className="enquete-remover" onClick={() => handleRemover(enq.idEnquete)}
                                        title="Remover enquete" aria-label="Remover enquete">
                                        <Trash2 size={18} />
                                    </button>
                                )}
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
                                    {!ehSindico && (
                                        <button className="opcao-votar Green_Button_Empty"
                                            onClick={() => handleVotar(enq.idEnquete, op.num)}>
                                            VOTAR
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {ehSindico && (
                <div id="Enquetes_Novo_Wrapper">
                    {mostrarMenu && (
                        <nav id="Enquetes_MiniMenu" className="Green_Box_Full">
                            <button type="button" className="mini-menu-item" onClick={escolherAviso}>
                                avisos
                            </button>
                            <button type="button" className="mini-menu-item" onClick={escolherEnquete}>
                                enquetes
                            </button>
                        </nav>
                    )}

                    <button id="Enquetes_Novo" className="Green_Button_Empty" onClick={alternarMenu}
                        title={mostrarMenu ? "Fechar menu" : "Novo"} aria-label={mostrarMenu ? "Fechar menu" : "Novo"}>
                        {mostrarMenu ? <X size={30} strokeWidth={3} /> : <Plus size={30} strokeWidth={3} />}
                    </button>
                </div>
            )}

            {mostrarForm && (
                <div id="Enquetes_Modal" role="dialog" aria-modal="true">
                    <form id="Enquetes_Form" className="Empty_Box" onSubmit={handleCriar}>
                        <h2 id="Enquetes_Form_Titulo">NOVA ENQUETE</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div className="enq-campo">
                            <label htmlFor="Enquetes_Assunto">Assunto *</label>
                            <input
                                id="Enquetes_Assunto"
                                className="Green_Input"
                                type="text"
                                placeholder="Ex: Reforma da piscina"
                                value={formData.assunto}
                                onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                                required
                            />
                        </div>

                        <div id="Enquetes_Form_Opcoes">
                            <div className="enq-campo">
                                <label htmlFor="Enquetes_Op1">Opção 1 *</label>
                                <input
                                    id="Enquetes_Op1"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: Sim"
                                    value={formData.op1}
                                    onChange={(e) => setFormData({ ...formData, op1: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="enq-campo">
                                <label htmlFor="Enquetes_Op2">Opção 2 *</label>
                                <input
                                    id="Enquetes_Op2"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: Não"
                                    value={formData.op2}
                                    onChange={(e) => setFormData({ ...formData, op2: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="enq-campo">
                                <label htmlFor="Enquetes_Op3">Opção 3 (opcional)</label>
                                <input
                                    id="Enquetes_Op3"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: Talvez"
                                    value={formData.op3}
                                    onChange={(e) => setFormData({ ...formData, op3: e.target.value })}
                                />
                            </div>
                            <div className="enq-campo">
                                <label htmlFor="Enquetes_Op4">Opção 4 (opcional)</label>
                                <input
                                    id="Enquetes_Op4"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: Não sei"
                                    value={formData.op4}
                                    onChange={(e) => setFormData({ ...formData, op4: e.target.value })}
                                />
                            </div>
                        </div>

                        <div id="Enquetes_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Full">
                                <Check size={16} /> CRIAR
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {mostrarFormAviso && (
                <div id="Enquetes_Modal" role="dialog" aria-modal="true">
                    <form id="Enquetes_Form" className="Empty_Box" onSubmit={handleCriarAviso}>
                        <h2 id="Enquetes_Form_Titulo">NOVO AVISO</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div className="enq-campo">
                            <label htmlFor="Aviso_Assunto">Assunto *</label>
                            <input
                                id="Aviso_Assunto"
                                className="Green_Input"
                                type="text"
                                placeholder="Ex: Assembleia geral"
                                value={formAviso.assunto}
                                onChange={(e) => setFormAviso({ ...formAviso, assunto: e.target.value })}
                                required
                            />
                        </div>

                        <div className="enq-campo">
                            <label htmlFor="Aviso_Texto">Texto *</label>
                            <input
                                id="Aviso_Texto"
                                className="Green_Input"
                                type="text"
                                placeholder="Ex: Assembleia marcada para o dia 15/10 às 19h"
                                value={formAviso.texto}
                                onChange={(e) => setFormAviso({ ...formAviso, texto: e.target.value })}
                                required
                            />
                        </div>

                        <div id="Enquetes_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharFormAviso}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Full">
                                <Check size={16} /> CRIAR
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Enquetes;
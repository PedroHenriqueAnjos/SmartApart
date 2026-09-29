import React, { useState, useEffect } from 'react';
import './Enquetes.css';
import { BarChart2, X, Plus, Check, ClipboardList, Trash2 } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Enquetes({ usuario }) {
    const [enquetes, setEnquetes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ assunto: '', op1: '', op2: '', op3: '', op4: '' });

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

    const totalVotos = (e) => e.op1 + e.op2 + e.op3 + e.op4;

    const porcentagem = (votos, total) => {
        if (total === 0) return 0;
        return Math.round((votos / total) * 100);
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    return (
        <div className="enquetes">
            <div className="enquetes-header">
                <h2 className="enquetes-titulo"><BarChart2 size={22} /> Enquetes</h2>
                {ehSindico && (
                    <button className="enq-botao-novo" onClick={() => { setMostrarForm(!mostrarForm); setErro(''); }}>
                        {mostrarForm ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Nova Enquete</>}
                    </button>
                )}
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {ehSindico && mostrarForm && (
                <form onSubmit={handleCriar} className="enq-form">
                    <div className="form-group">
                        <label>Assunto *</label>
                        <input type="text" placeholder="Ex: Reforma da piscina" value={formData.assunto}
                            onChange={(e) => setFormData({ ...formData, assunto: e.target.value })} required />
                    </div>
                    <div className="enq-form-opcoes">
                        <div className="form-group">
                            <label>Opção 1 *</label>
                            <input type="text" placeholder="Ex: Sim" value={formData.op1}
                                onChange={(e) => setFormData({ ...formData, op1: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Opção 2 *</label>
                            <input type="text" placeholder="Ex: Não" value={formData.op2}
                                onChange={(e) => setFormData({ ...formData, op2: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Opção 3 (opcional)</label>
                            <input type="text" placeholder="Ex: Talvez" value={formData.op3}
                                onChange={(e) => setFormData({ ...formData, op3: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Opção 4 (opcional)</label>
                            <input type="text" placeholder="Ex: Não sei" value={formData.op4}
                                onChange={(e) => setFormData({ ...formData, op4: e.target.value })} />
                        </div>
                    </div>
                    <button type="submit" className="enq-botao-submit"><Check size={14} /> Criar Enquete</button>
                </form>
            )}

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && enquetes.length === 0 && <p className="mensagem-info">Nenhuma enquete disponível</p>}

            <div className="enquetes-lista">
                {enquetes.map((enq) => {
                    const total = totalVotos(enq);
                    const opcoes = [
                        { texto: enq.textoOp1, votos: enq.op1, num: 1 },
                        { texto: enq.textoOp2, votos: enq.op2, num: 2 },
                        { texto: enq.textoOp3, votos: enq.op3, num: 3 },
                        { texto: enq.textoOp4, votos: enq.op4, num: 4 },
                    ].filter(op => op.texto);

                    return (
                        <div key={enq.idEnquete} className="enquete-card">
                            <div className="enquete-card-header">
                                <div>
                                    <h4 className="enquete-assunto"><ClipboardList size={16} /> {enq.assunto}</h4>
                                    <p className="enquete-data">{formatarData(enq.data)} · {total} voto{total !== 1 ? 's' : ''}</p>
                                </div>
                                {ehSindico && (
                                    <button className="enq-botao-remover" onClick={() => handleRemover(enq.idEnquete)}>
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="enquete-opcoes">
                                {opcoes.map((op) => (
                                    <div key={op.num} className="enquete-opcao">
                                        <div className="opcao-info">
                                            <span className="opcao-label">{op.texto}</span>
                                            <span className="opcao-porcentagem">{porcentagem(op.votos, total)}% ({op.votos})</span>
                                        </div>
                                        <div className="opcao-barra-fundo">
                                            <div className="opcao-barra-progresso"
                                                style={{ width: `${porcentagem(op.votos, total)}%` }} />
                                        </div>
                                        {!ehSindico && (
                                            <button className="opcao-votar" onClick={() => handleVotar(enq.idEnquete, op.num)}>
                                                Votar
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Enquetes;
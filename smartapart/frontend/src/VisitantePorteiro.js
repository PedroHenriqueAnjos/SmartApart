import React, { useState, useEffect } from 'react';
import './Visitantes.css';

const API_URL = "http://localhost:8080";

function VisitantesPorteiro({ usuario }) {
    const [visitantes, setVisitantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ nome: '', cpf: '', idInquilino: '', idDono: '', prestador: false });
    const [inquilinoInfo, setInquilinoInfo] = useState(null);
    const [donoInfo, setDonoInfo] = useState(null);

    useEffect(() => { carregarVisitantes(); }, []);

    const carregarVisitantes = async () => {
        try {
            setCarregando(true);
            setErro('');
            const res = await fetch(`${API_URL}/visitantes/pendentes`);
            const dados = await res.json();
            setVisitantes(dados);
        } catch {
            setErro('Erro ao carregar visitantes');
        } finally {
            setCarregando(false);
        }
    };

    const buscarInquilino = async (id) => {
        if (!id) { setInquilinoInfo(null); return; }
        try {
            const res = await fetch(`${API_URL}/inquilinos/${id}`);
            if (res.ok) {
                const dados = await res.json();
                setInquilinoInfo(dados);
            } else {
                setInquilinoInfo({ erro: 'Inquilino não encontrado' });
            }
        } catch {
            setInquilinoInfo({ erro: 'Erro ao buscar inquilino' });
        }
    };

    const buscarDono = async (id) => {
        if (!id) { setDonoInfo(null); return; }
        try {
            const res = await fetch(`${API_URL}/donos/${id}`);
            if (res.ok) {
                const dados = await res.json();
                setDonoInfo(dados);
            } else {
                setDonoInfo({ erro: 'Dono não encontrado' });
            }
        } catch {
            setDonoInfo({ erro: 'Erro ao buscar dono' });
        }
    };

    const handleSolicitar = async (e) => {
        e.preventDefault();
        if (!formData.nome.trim()) { setErro('Nome do visitante é obrigatório'); return; }

        try {
            setErro('');
            const res = await fetch(`${API_URL}/visitantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome,
                    cpf: formData.cpf || null,
                    idInquilino: formData.idInquilino ? parseInt(formData.idInquilino) : null,
                    idDono: formData.idDono ? parseInt(formData.idDono) : null,
                    prestador: formData.prestador
                })
            });
            if (!res.ok) throw new Error();
            setSucesso('Visitante registrado com sucesso!');
            setFormData({ nome: '', cpf: '', idInquilino: '', idDono: '', prestador: false });
            setInquilinoInfo(null);
            setDonoInfo(null);
            setMostrarForm(false);
            carregarVisitantes();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao registrar visitante');
        }
    };

    const handleConfirmar = async (idVisitante) => {
        try {
            await fetch(`${API_URL}/visitantes/${idVisitante}/confirmar?nomePorteiro=${encodeURIComponent(usuario.nome)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            carregarVisitantes();
        } catch {
            setErro('Erro ao confirmar visitante');
        }
    };

    const handleCancelar = async (idVisitante) => {
        try {
            await fetch(`${API_URL}/visitantes/${idVisitante}`, { method: 'DELETE' });
            carregarVisitantes();
        } catch {
            setErro('Erro ao cancelar visitante');
        }
    };

    const getStatusBG = (status) => {
        if (status === 'Pendente') return '#D4A760';
        if (status === 'Liberado') return '#5BA989';
        return '#999';
    };

    return (
        <div className="visitantes">
            <div className="visitantes-header">
                <h2 className="visitantes-titulo">👥 Visitantes Pendentes</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="visitantes-novo" onClick={carregarVisitantes}>🔄</button>
                    <button className="visitantes-novo" onClick={() => {
                        setMostrarForm(!mostrarForm);
                        setErro('');
                        setSucesso('');
                        setInquilinoInfo(null);
                        setDonoInfo(null);
                        setFormData({ nome: '', cpf: '', idInquilino: '', idDono: '', prestador: false });
                    }}>
                        {mostrarForm ? '✕ Cancelar' : '+ Novo Visitante'}
                    </button>
                </div>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {mostrarForm && (
                <form onSubmit={handleSolicitar} className="vis-form">
                    <div className="vis-form-campos">
                        <div className="form-group">
                            <label>Nome do Visitante *</label>
                            <input
                                type="text"
                                placeholder="Nome completo"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>CPF (opcional)</label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="vis-form-campos">
                        <div className="form-group">
                            <label>ID Inquilino (opcional)</label>
                            <input
                                type="number"
                                placeholder="Ex: 1"
                                value={formData.idInquilino}
                                onChange={(e) => { setFormData({ ...formData, idInquilino: e.target.value }); setInquilinoInfo(null); }}
                                onBlur={() => buscarInquilino(formData.idInquilino)}
                            />
                            {inquilinoInfo && !inquilinoInfo.erro && (
                                <span className="vis-confirmacao ok">✅ {inquilinoInfo.nome}</span>
                            )}
                            {inquilinoInfo && inquilinoInfo.erro && (
                                <span className="vis-confirmacao erro">❌ {inquilinoInfo.erro}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <label>ID Dono (opcional)</label>
                            <input
                                type="number"
                                placeholder="Ex: 1"
                                value={formData.idDono}
                                onChange={(e) => { setFormData({ ...formData, idDono: e.target.value }); setDonoInfo(null); }}
                                onBlur={() => buscarDono(formData.idDono)}
                            />
                            {donoInfo && !donoInfo.erro && (
                                <span className="vis-confirmacao ok">✅ {donoInfo.nome}</span>
                            )}
                            {donoInfo && donoInfo.erro && (
                                <span className="vis-confirmacao erro">❌ {donoInfo.erro}</span>
                            )}
                        </div>
                    </div>

                    <label className="vis-checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.prestador}
                            onChange={(e) => setFormData({ ...formData, prestador: e.target.checked })}
                        />
                        Prestador de serviço?
                    </label>

                    <button type="submit" className="vis-botao-submit">
                        ✓ Registrar Visitante
                    </button>
                </form>
            )}

            {carregando && <p className="mensagem-info">Carregando visitantes...</p>}
            {!carregando && visitantes.length === 0 && !erro && (
                <p className="mensagem-info">Nenhum visitante pendente</p>
            )}

            <div className="visitantes-lista">
                {visitantes.map((v) => (
                    <div key={v.idVisitante} className="visitante-card">
                        <div className="visitante-header">
                            <div className="visitante-info">
                                <h4 className="visitante-nome">{v.nome}</h4>
                                {v.cpf && <p className="visitante-detalhe">CPF: {v.cpf}</p>}
                                {v.idInquilino && <p className="visitante-detalhe">👤 Inquilino ID: {v.idInquilino}</p>}
                                {v.idDono && <p className="visitante-detalhe">🏠 Dono ID: {v.idDono}</p>}
                                {v.prestador && <p className="visitante-detalhe">🔧 Prestador de serviço</p>}
                            </div>
                            <span className="visitante-status" style={{ backgroundColor: getStatusBG(v.status) }}>
                                {v.status}
                            </span>
                        </div>
                        {v.status === 'Pendente' && (
                            <div className="vis-acoes">
                                <button className="vis-botao verde" onClick={() => handleConfirmar(v.idVisitante)}>
                                    ✓ Liberar Entrada
                                </button>
                                <button className="vis-botao vermelho" onClick={() => handleCancelar(v.idVisitante)}>
                                    ✕ Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VisitantesPorteiro;
import React, { useState, useEffect } from 'react';
import './Salao.css';
import { Building2, X, Plus, Check, Calendar, Home, Trash2 } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Salao({ usuario }) {
    const [saloes, setSaloes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [formData, setFormData] = useState({ idSalao: '', dataPrevista: '' });
    const [mostrarForm, setMostrarForm] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro('');
            const [resSaloes, resReservas] = await Promise.all([
                fetch(`${API_URL}/salaos`),
                fetch(`${API_URL}/reservas/inquilino/${usuario.id}`)
            ]);
            if (!resSaloes.ok || !resReservas.ok) throw new Error();
            setSaloes(await resSaloes.json());
            setReservas(await resReservas.json());
        } catch {
            setErro('Erro ao carregar dados');
        } finally {
            setCarregando(false);
        }
    };

    const getNomeSalao = (idSalao) => {
        const salao = saloes.find(s => s.idSalao === idSalao);
        return salao ? salao.nome : `Salão ID: ${idSalao}`;
    };

    const handleReservar = async (e) => {
        e.preventDefault();
        if (!formData.idSalao || !formData.dataPrevista) {
            setErro('Selecione o salão e a data');
            return;
        }
        try {
            setErro('');
            const res = await fetch(`${API_URL}/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idInquilino: usuario.id,
                    idSalao: parseInt(formData.idSalao),
                    dataPrevista: formData.dataPrevista
                })
            });
            if (res.status === 409) { setErro('Salão já reservado nessa data!'); return; }
            if (!res.ok) throw new Error();
            setSucesso('Reserva solicitada!');
            setFormData({ idSalao: '', dataPrevista: '' });
            setMostrarForm(false);
            carregarDados();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao solicitar reserva');
        }
    };

    const handleCancelar = async (idReserva) => {
        try {
            const res = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            carregarDados();
        } catch {
            setErro('Erro ao cancelar reserva');
        }
    };

    const getStatusSalaoCor = (status) => {
        if (status === 'Disponível' || status === 'Livre' || status === 'DISPONIVEL') return '#5BA989';
        return '#d32f2f';
    };

    const getStatusReservaCor = (status) => {
        if (status === 'PENDENTE') return '#D4A760';
        if (status === 'CANCELADA') return '#999';
        return '#5BA989';
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const hoje = new Date().toISOString().split('T')[0];

    return (
        <div className="salao">
            <div className="salao-header">
                <h2 className="salao-titulo"><Building2 size={22} /> Salão de Festas</h2>
                <button className="salao-botao-novo" onClick={() => { setMostrarForm(!mostrarForm); setErro(''); }}>
                    {mostrarForm ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Fazer Reserva</>}
                </button>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            <div className="salao-cards">
                {saloes.map((s) => (
                    <div key={s.idSalao} className="salao-card">
                        <h4 className="salao-nome"><Home size={16} /> {s.nome}</h4>
                        <span className="salao-status" style={{ backgroundColor: getStatusSalaoCor(s.status) }}>
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>

            {mostrarForm && (
                <form onSubmit={handleReservar} className="salao-form">
                    <div className="salao-form-campos">
                        <div className="form-group">
                            <label>Salão *</label>
                            <select value={formData.idSalao}
                                onChange={(e) => setFormData({ ...formData, idSalao: e.target.value })} required>
                                <option value="">Selecione...</option>
                                {saloes.map((s) => (
                                    <option key={s.idSalao} value={s.idSalao}>{s.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Data *</label>
                            <input type="date" min={hoje} value={formData.dataPrevista}
                                onChange={(e) => setFormData({ ...formData, dataPrevista: e.target.value })} required />
                        </div>
                    </div>
                    <button type="submit" className="salao-botao-submit"><Check size={14} /> Solicitar Reserva</button>
                </form>
            )}

            <h3 className="salao-subtitulo"><Calendar size={18} /> Minhas Reservas</h3>

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && reservas.length === 0 && <p className="mensagem-info">Você não tem reservas</p>}

            <div className="reservas-lista">
                {reservas.map((r) => (
                    <div key={r.idReserva} className="reserva-card">
                        <div className="reserva-header">
                            <div>
                                <h4 className="reserva-titulo">Reserva #{r.idReserva}</h4>
                                <p className="reserva-data"><Calendar size={12} /> {formatarData(r.dataPrevista)}</p>
                                <p className="reserva-salao"><Building2 size={12} /> {getNomeSalao(r.idSalao)}</p>
                            </div>
                            <span className="reserva-status" style={{ backgroundColor: getStatusReservaCor(r.status) }}>
                                {r.status}
                            </span>
                        </div>
                        {r.status === 'PENDENTE' && (
                            <button className="salao-botao-cancelar" onClick={() => handleCancelar(r.idReserva)}>
                                <Trash2 size={14} /> Cancelar Reserva
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Salao;
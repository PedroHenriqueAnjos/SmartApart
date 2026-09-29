import React, { useState, useEffect } from 'react';
import './Salao.css';
import { ArrowLeft, User, Plus, Check, Calendar, Building2 } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Salao({ usuario, aoNavegar }) {
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

    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setFormData({ idSalao: '', dataPrevista: '' });
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
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

    const classeStatusSalao = (status) => {
        if (status === 'Disponível' || status === 'Livre' || status === 'DISPONIVEL') return 'status-ok';
        return 'status-ocupado';
    };

    const classeStatusReserva = (status) => {
        if (status === 'PENDENTE') return 'status-pendente';
        if (status === 'CANCELADA') return 'status-cancelada';
        return 'status-ok';
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    const hoje = new Date().toISOString().split('T')[0];

    return (
        <div id="Salao_Pagina">

            <button id="Salao_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="Salao_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                <User size={28} />
            </button>

            <h1 id="Salao_Titulo">SALÃO</h1>

            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
            {!mostrarForm && erro && <p className="mensagem-erro">{erro}</p>}

            {/* ---------- Salões disponíveis ---------- */}
            <div id="Salao_Lista">
                {saloes.map((s) => (
                    <div key={s.idSalao} className="salao-card Green_Box_Full">
                        <div className="salao-avatar"><Building2 size={26} /></div>
                        <h2 className="salao-nome">{s.nome}</h2>
                        <span className={`salao-status Gold_Pill_Full ${classeStatusSalao(s.status)}`}>
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>

            <hr className="salao-divisor" />

            {/* ---------- Minhas reservas ---------- */}
            <h1 id="Salao_Subtitulo">MINHAS RESERVAS</h1>

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && reservas.length === 0 && !erro && (
                <p className="mensagem-info">Você não tem reservas</p>
            )}

            <div id="Salao_Reservas">
                {reservas.map((r) => (
                    <div key={r.idReserva} className="reserva-card Green_Box_Full">
                        <div className="reserva-cabecalho">
                            <div className="salao-avatar"><Calendar size={26} /></div>
                            <div className="reserva-corpo">
                                <h2 className="reserva-titulo">RESERVA #{r.idReserva}</h2>
                                <p className="reserva-info">
                                    {formatarData(r.dataPrevista)} · {getNomeSalao(r.idSalao)}
                                </p>
                            </div>
                            <span className={`reserva-status Gold_Pill_Full ${classeStatusReserva(r.status)}`}>
                                {r.status}
                            </span>
                        </div>

                        {r.status === 'PENDENTE' && (
                            <button className="reserva-cancelar Gold_Button_Empty"
                                onClick={() => handleCancelar(r.idReserva)}>
                                CANCELAR RESERVA
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button id="Salao_Novo" className="Green_Button_Full" onClick={abrirForm}
                title="Fazer reserva" aria-label="Fazer reserva">
                <Plus size={30} strokeWidth={3} />
            </button>

            {mostrarForm && (
                <div id="Salao_Modal" role="dialog" aria-modal="true">
                    <form id="Salao_Form" className="Empty_Box" onSubmit={handleReservar}>
                        <h2 id="Salao_Form_Titulo">NOVA RESERVA</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div className="salao-campo">
                            <label htmlFor="Salao_Select">Salão *</label>
                            <select
                                id="Salao_Select"
                                className="Green_Input"
                                value={formData.idSalao}
                                onChange={(e) => setFormData({ ...formData, idSalao: e.target.value })}
                                required
                            >
                                <option value="">Selecione...</option>
                                {saloes.map((s) => (
                                    <option key={s.idSalao} value={s.idSalao}>{s.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="salao-campo">
                            <label htmlFor="Salao_Data">Data *</label>
                            <input
                                id="Salao_Data"
                                className="Green_Input"
                                type="date"
                                min={hoje}
                                value={formData.dataPrevista}
                                onChange={(e) => setFormData({ ...formData, dataPrevista: e.target.value })}
                                required
                            />
                        </div>

                        <div id="Salao_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Full">
                                <Check size={16} /> SOLICITAR
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Salao;
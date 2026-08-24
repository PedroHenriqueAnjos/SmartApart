import React, { useState, useEffect } from 'react';
import './Visitantes.css';
import { Users, RefreshCw, X, Plus, Search, CheckCircle, User, Home, Wrench, Check } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Visitantes({ usuario }) {
    const [visitantes, setVisitantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ nome: '', cpf: '', prestador: false });
    const [idApartamento, setIdApartamento] = useState('');
    const [apartamentoInfo, setApartamentoInfo] = useState(null);
    const [buscandoApto, setBuscandoApto] = useState(false);

    const ehGerenciador = usuario.tipo === 'PORTEIRO' || usuario.tipo === 'SINDICO';
    const ehMorador = usuario.tipo === 'MORADOR' || usuario.tipo === 'DONO';

    useEffect(() => { carregarVisitantes(); }, []);

    const carregarVisitantes = async () => {
        try {
            setCarregando(true);
            setErro('');
            let url = '';
            if (ehGerenciador) {
                url = `${API_URL}/visitantes/pendentes`;
            } else if (usuario.tipo === 'DONO') {
                url = `${API_URL}/visitantes/dono/${usuario.id}`;
            } else {
                url = `${API_URL}/visitantes/inquilino/${usuario.id}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            setVisitantes(await res.json());
        } catch {
            setErro('Erro ao carregar visitantes');
        } finally {
            setCarregando(false);
        }
    };

    const buscarApartamento = async (id) => {
        if (!id) { setApartamentoInfo(null); return; }
        try {
            setBuscandoApto(true);
            setApartamentoInfo(null);
            setErro('');

            const resApto = await fetch(`${API_URL}/apartamentos/${id}`);
            if (!resApto.ok) { setErro('Apartamento não encontrado'); return; }
            const apto = await resApto.json();

            let inquilino = null;
            let dono = null;

            if (apto.idInquilino) {
                const resInq = await fetch(`${API_URL}/inquilinos/${apto.idInquilino}`);
                if (resInq.ok) inquilino = await resInq.json();
            }

            if (apto.idDono) {
                const resDono = await fetch(`${API_URL}/donos/${apto.idDono}`);
                if (resDono.ok) dono = await resDono.json();
            }

            setApartamentoInfo({ apto, inquilino, dono });
        } catch {
            setErro('Erro ao buscar apartamento');
        } finally {
            setBuscandoApto(false);
        }
    };

    const handleSolicitar = async (e) => {
        e.preventDefault();
        if (!formData.nome.trim()) { setErro('Nome do visitante é obrigatório'); return; }

        let idInquilino = null;
        let idDono = null;

        if (ehGerenciador) {
            if (!apartamentoInfo) { setErro('Busque o apartamento primeiro'); return; }
            idInquilino = apartamentoInfo.inquilino ? apartamentoInfo.inquilino.idInquilino : null;
            idDono = apartamentoInfo.dono ? apartamentoInfo.dono.idDono : null;
        } else if (usuario.tipo === 'MORADOR') {
            idInquilino = usuario.id;
        } else if (usuario.tipo === 'DONO') {
            idDono = usuario.id;
        }

        try {
            setErro('');
            const res = await fetch(`${API_URL}/visitantes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome,
                    cpf: formData.cpf || null,
                    idInquilino,
                    idDono,
                    prestador: formData.prestador
                })
            });
            if (!res.ok) throw new Error();
            setSucesso('Visitante solicitado com sucesso!');
            setFormData({ nome: '', cpf: '', prestador: false });
            setIdApartamento('');
            setApartamentoInfo(null);
            setMostrarForm(false);
            carregarVisitantes();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao solicitar visitante');
        }
    };

    const handleConfirmar = async (idVisitante) => {
        try {
            const res = await fetch(`${API_URL}/visitantes/${idVisitante}/confirmar?nomePorteiro=${encodeURIComponent(usuario.nome)}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            carregarVisitantes();
        } catch {
            setErro('Erro ao confirmar visitante');
        }
    };

    const handleCancelar = async (idVisitante) => {
        try {
            const res = await fetch(`${API_URL}/visitantes/${idVisitante}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            carregarVisitantes();
        } catch {
            setErro('Erro ao cancelar visitante');
        }
    };

    const getStatusCor = (status) => {
        if (status === 'Pendente') return '#D4A760';
        if (status === 'Liberado') return '#5BA989';
        return '#999';
    };

    return (
        <div className="visitantes">
            <div className="visitantes-header">
                <h2 className="visitantes-titulo">
                    <Users size={22} /> {ehGerenciador ? 'Visitantes Pendentes' : 'Meus Visitantes'}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="visitantes-novo" onClick={carregarVisitantes}>
                        <RefreshCw size={16} />
                    </button>
                    {(ehGerenciador || ehMorador) && (
                        <button className="visitantes-novo" onClick={() => {
                            setMostrarForm(!mostrarForm);
                            setErro('');
                            setSucesso('');
                            setApartamentoInfo(null);
                            setIdApartamento('');
                            setFormData({ nome: '', cpf: '', prestador: false });
                        }}>
                            {mostrarForm ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Novo Visitante</>}
                        </button>
                    )}
                </div>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {mostrarForm && (
                <form onSubmit={handleSolicitar} className="vis-form">

                    {ehGerenciador && (
                        <>
                            <div className="form-group">
                                <label>ID Apartamento *</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 1"
                                    value={idApartamento}
                                    onChange={(e) => { setIdApartamento(e.target.value); setApartamentoInfo(null); setErro(''); }}
                                    onBlur={() => { if (idApartamento) buscarApartamento(idApartamento); }}
                                />
                                <span className="vis-campo-dica">Saia do campo para buscar automaticamente</span>
                            </div>

                            {buscandoApto && <p className="vis-buscando"><Search size={14} /> Buscando apartamento...</p>}

                            {apartamentoInfo && (
                                <div className="vis-apartamento-info">
                                    <h4 className="vis-info-titulo"><CheckCircle size={14} /> Apartamento {apartamentoInfo.apto.idApartamento} encontrado</h4>
                                    <div className="vis-info-grid">
                                        {apartamentoInfo.inquilino ? (
                                            <div className="vis-info-item">
                                                <span className="vis-info-label"><User size={12} /> Inquilino</span>
                                                <span className="vis-info-valor">{apartamentoInfo.inquilino.nome}</span>
                                                <span className="vis-info-id">ID: {apartamentoInfo.inquilino.idInquilino}</span>
                                            </div>
                                        ) : (
                                            <div className="vis-info-item vazio">
                                                <span className="vis-info-label"><User size={12} /> Inquilino</span>
                                                <span className="vis-info-valor">Sem inquilino</span>
                                            </div>
                                        )}
                                        {apartamentoInfo.dono ? (
                                            <div className="vis-info-item">
                                                <span className="vis-info-label"><Home size={12} /> Dono</span>
                                                <span className="vis-info-valor">{apartamentoInfo.dono.nome}</span>
                                                <span className="vis-info-id">ID: {apartamentoInfo.dono.idDono}</span>
                                            </div>
                                        ) : (
                                            <div className="vis-info-item vazio">
                                                <span className="vis-info-label"><Home size={12} /> Dono</span>
                                                <span className="vis-info-valor">Sem dono</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

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

                    <label className="vis-checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.prestador}
                            onChange={(e) => setFormData({ ...formData, prestador: e.target.checked })}
                        />
                        Prestador de serviço?
                    </label>

                    <button
                        type="submit"
                        className="vis-botao-submit"
                        disabled={ehGerenciador && (!apartamentoInfo || buscandoApto)}
                    >
                        <Check size={14} /> Solicitar Visitante
                    </button>
                </form>
            )}

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && visitantes.length === 0 && !erro && (
                <p className="mensagem-info">Nenhum visitante encontrado</p>
            )}

            <div className="visitantes-lista">
                {visitantes.map((v) => (
                    <div key={v.idVisitante} className="visitante-card">
                        <div className="visitante-header">
                            <div className="visitante-info">
                                <h4 className="visitante-nome">{v.nome}</h4>
                                {v.cpf && <p className="visitante-detalhe">CPF: {v.cpf}</p>}
                                {v.idInquilino && <p className="visitante-detalhe"><User size={12} /> Inquilino ID: {v.idInquilino}</p>}
                                {v.idDono && <p className="visitante-detalhe"><Home size={12} /> Dono ID: {v.idDono}</p>}
                                {v.prestador && <p className="visitante-detalhe"><Wrench size={12} /> Prestador de serviço</p>}
                            </div>
                            <span className="visitante-status" style={{ backgroundColor: getStatusCor(v.status) }}>
                                {v.status}
                            </span>
                        </div>
                        <div className="vis-acoes">
                            {ehGerenciador && v.status === 'Pendente' && (
                                <button className="vis-botao verde" onClick={() => handleConfirmar(v.idVisitante)}>
                                    <Check size={14} /> Liberar Entrada
                                </button>
                            )}
                            {(ehGerenciador || (ehMorador && v.status === 'Pendente')) && (
                                <button className="vis-botao vermelho" onClick={() => handleCancelar(v.idVisitante)}>
                                    <X size={14} /> Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Visitantes;
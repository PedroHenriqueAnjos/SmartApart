import React, { useState, useEffect } from 'react';
import './SalaoPorteiro.css';
import { ArrowLeft, User, Building2, Calendar, Plus, Check } from 'lucide-react';

const API_URL = "https://smartapart-bra7.onrender.com";

// Ajuste aqui se as rotas do seu backend forem diferentes
const rotaLiberar = (id, nomePorteiro) =>
    `${API_URL}/reservas/${id}/confirmar?nomePorteiro=${encodeURIComponent(nomePorteiro)}`;
const rotaRecusar = (id) => `${API_URL}/reservas/${id}/cancelar`;
const rotaNovoSalao = `${API_URL}/salaos`;
const rotaStatusSalao = (id, status) =>
    `${API_URL}/salaos/${id}/status?status=${encodeURIComponent(status)}`;

const STATUS_NOVO_SALAO = 'Disponível';
const STATUS_DISPONIVEL = 'Disponível';
const STATUS_INDISPONIVEL = 'Indisponível';

function SalaoPorteiro({ usuario, aoNavegar }) {
    const [saloes, setSaloes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [nomesInquilinos, setNomesInquilinos] = useState({});
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ nome: '' });
    const [foto, setFoto] = useState(null);
    
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
            
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro('');
            const [resSaloes, resReservas] = await Promise.all([
                fetch(`${API_URL}/salaos`),
                fetch(`${API_URL}/reservas`)
            ]);
            if (!resSaloes.ok) throw new Error(`GET /salaos respondeu ${resSaloes.status}`);
            if (!resReservas.ok) throw new Error(`GET /reservas respondeu ${resReservas.status}`);
            const dadosSaloes = await resSaloes.json();
            const dadosReservas = await resReservas.json();
            const listaReservas = Array.isArray(dadosReservas) ? dadosReservas : [];
            setSaloes(Array.isArray(dadosSaloes) ? dadosSaloes : []);
            setReservas(listaReservas);
            await carregarNomesInquilinos(listaReservas);
        } catch (err) {
            console.error(err);
            setErro(`Erro ao carregar dados (${err.message})`);
        } finally {
            setCarregando(false);
        }
    };

    // Busca o nome de cada inquilino que aparece nas reservas (uma vez por id)
    const carregarNomesInquilinos = async (listaReservas) => {
        const ids = [...new Set(listaReservas.map((r) => r.idInquilino).filter(Boolean))];
        const pares = await Promise.all(
            ids.map(async (id) => {
                try {
                    const res = await fetch(`${API_URL}/inquilinos/${id}`);
                    if (!res.ok) return [id, null];
                    const dados = await res.json();
                    return [id, dados.nome || null];
                } catch {
                    return [id, null];
                }
            })
        );
        setNomesInquilinos(Object.fromEntries(pares));
    };

    const getNomeInquilino = (id) => nomesInquilinos[id] || `Inquilino ID: ${id}`;

    const mostrarSucesso = (msg) => {
        setSucesso(msg);
        setTimeout(() => setSucesso(''), 3000);
    };

    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setFormData({ nome: '' });
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
    };

    // ---------- Cadastrar salão ----------
    const handleCadastrarSalao = async (e) => {
        e.preventDefault();
        if (!formData.nome.trim()) {
            setErro('Nome do salão é obrigatório');
            return;
        }
        try {
            setErro('');
            const res = await fetch(rotaNovoSalao, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: formData.nome.trim(),
                    status: STATUS_NOVO_SALAO
                })
            });
            if (!res.ok) throw new Error();
            setMostrarForm(false);
            setFormData({ nome: '' });
            mostrarSucesso('Salão cadastrado!');
            carregarDados();
        } catch {
            setErro('Erro ao cadastrar salão');
        }
    };

    // ---------- Alterar status do salão ----------
    const handleAlterarStatusSalao = async (salao) => {
        const disponivel = classeStatusSalao(salao.status) === 'sp-status-ok';
        const novoStatus = disponivel ? STATUS_INDISPONIVEL : STATUS_DISPONIVEL;
        try {
            setErro('');
            const res = await fetch(`${API_URL}/salaos/${salao.idSalao}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...salao, status: novoStatus })
});
            if (!res.ok) throw new Error();
            mostrarSucesso(`Salão marcado como ${novoStatus.toLowerCase()}!`);
            carregarDados();
        } catch {
            setErro('Erro ao alterar status do salão');
        }
    };

    // ---------- Liberar / recusar reserva ----------
    const handleLiberar = async (idReserva) => {
        try {
            setErro('');
            const res = await fetch(rotaLiberar(idReserva, usuario.nome), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            mostrarSucesso('Reserva liberada!');
            carregarDados();
        } catch {
            setErro('Erro ao liberar reserva');
        }
    };

    const handleRecusar = async (idReserva) => {
        try {
            setErro('');
            const res = await fetch(rotaRecusar(idReserva), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            mostrarSucesso('Reserva recusada!');
            carregarDados();
        } catch {
            setErro('Erro ao recusar reserva');
        }
    };

    const getNomeSalao = (idSalao) => {
        const salao = saloes.find((s) => s.idSalao === idSalao);
        return salao ? salao.nome : `Salão ID: ${idSalao}`;
    };

    const classeStatusSalao = (status) => {
        if (status === 'Disponível' || status === 'Livre' || status === 'DISPONIVEL') return 'sp-status-ok';
        return 'sp-status-ocupado';
    };

    const classeStatusReserva = (status) => {
        if (status === 'PENDENTE') return 'sp-status-pendente';
        if (status === 'CANCELADA') return 'sp-status-cancelada';
        return 'sp-status-ok';
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    };

    // Pendentes primeiro; dentro de cada grupo, da data mais próxima para a mais distante
    const reservasOrdenadas = [...reservas].sort((a, b) => {
        const pa = a.status === 'PENDENTE' ? 0 : 1;
        const pb = b.status === 'PENDENTE' ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return String(a.dataPrevista).localeCompare(String(b.dataPrevista));
    });

    return (
        <div id="SalaoPorteiro_Pagina">

            <button id="SalaoPorteiro_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="SalaoPorteiro_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" />:<User size={28} />
            </button>

            <h1 id="SalaoPorteiro_Titulo">SALÃO</h1>

            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
            {!mostrarForm && erro && <p className="mensagem-erro">{erro}</p>}
            {carregando && <p className="mensagem-info">Carregando...</p>}

            {/* ---------- Salões ---------- */}
            <div id="SalaoPorteiro_Lista">
                {saloes.map((s) => (
                    <div key={s.idSalao} className="sp-card sp-card-reserva Green_Box_Full">
                        <div className="sp-avatar"><Building2 size={26} /></div>
                        <h2 className="sp-nome">{s.nome}</h2>
                        <span className={`sp-status Gold_Pill_Full ${classeStatusSalao(s.status)}`}>
                            {s.status}
                        </span>
                        <div className="sp-acoes">
                            <button className="sp-acao Gold_Button_Empty"
                                onClick={() => handleAlterarStatusSalao(s)}>
                                {classeStatusSalao(s.status) === 'sp-status-ok'
                                    ? 'MARCAR INDISPONÍVEL'
                                    : 'MARCAR DISPONÍVEL'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!carregando && saloes.length === 0 && !erro && (
                <p className="mensagem-info">Nenhum salão cadastrado</p>
            )}

            <hr className="sp-divisor" />

            {/* ---------- Reservas ---------- */}
            <h1 id="SalaoPorteiro_Subtitulo">RESERVAS</h1>

            {!carregando && reservas.length === 0 && !erro && (
                <p className="mensagem-info">Nenhuma reserva</p>
            )}

            <div id="SalaoPorteiro_Reservas">
                {reservasOrdenadas.map((r) => (
                    <div key={r.idReserva} className="sp-card sp-card-reserva Green_Box_Full">
                        <div className="sp-avatar"><Calendar size={26} /></div>
                        <div className="sp-corpo">
                            <h2 className="sp-nome">{formatarData(r.dataPrevista)}</h2>
                            <p className="sp-info">
                                {getNomeSalao(r.idSalao)} · {getNomeInquilino(r.idInquilino)}
                            </p>
                        </div>
                        <span className={`sp-status Gold_Pill_Full ${classeStatusReserva(r.status)}`}>
                            {r.status}
                        </span>

                        {r.status === 'PENDENTE' && (
                            <div className="sp-acoes">
                                <button className="sp-acao Gold_Button_Empty"
                                    onClick={() => handleRecusar(r.idReserva)}>
                                    RECUSAR
                                </button>
                                <button className="sp-acao Gold_Button_Full"
                                    onClick={() => handleLiberar(r.idReserva)}>
                                    <Check size={16} /> LIBERAR
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button id="SalaoPorteiro_Novo" className="Green_Button_Empty" onClick={abrirForm}
                title="Cadastrar salão" aria-label="Cadastrar salão">
                <Plus size={30} strokeWidth={3} />
            </button>

            {mostrarForm && (
                <div id="SalaoPorteiro_Modal" role="dialog" aria-modal="true">
                    <form id="SalaoPorteiro_Form" className="Empty_Box" onSubmit={handleCadastrarSalao}>
                        <h2 id="SalaoPorteiro_Form_Titulo">NOVO SALÃO</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div className="sp-campo">
                            <label htmlFor="SalaoPorteiro_Nome">Nome do salão *</label>
                            <input
                                id="SalaoPorteiro_Nome"
                                className="Green_Input"
                                type="text"
                                placeholder="Ex: Salão de Festas 2"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </div>

                        <div id="SalaoPorteiro_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Full">
                                <Check size={16} /> CADASTRAR
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default SalaoPorteiro;
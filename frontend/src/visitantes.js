import React, { useState, useEffect } from 'react';
import './Visitantes.css';
import { supabase } from './supabaseClient';
import { ArrowLeft, RefreshCw, X, Plus, Search, CheckCircle, User, Home, Check } from 'lucide-react';

const API_URL = "https://smartapart-bra7.onrender.com";
const BUCKET = 'avatars';

function Visitantes({ usuario, aoNavegar }) {
    const [visitantes, setVisitantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState({ nome: '', cpf: '', prestador: false });

    const [apartamentos, setApartamentos] = useState([]);
    const [blocos, setBlocos] = useState([]);
    const [idBloco, setIdBloco] = useState('');
    const [numero, setNumero] = useState('');
    const [apartamentoInfo, setApartamentoInfo] = useState(null);
    const [buscandoApto, setBuscandoApto] = useState(false);
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
        }
    };
    const ehGerenciador = usuario.tipo === 'PORTEIRO';
    const ehMorador = usuario.tipo === 'MORADOR' || usuario.tipo === 'DONO' || usuario.tipo === 'SINDICO';

    useEffect(() => { carregarVisitantes(); }, []);
    useEffect(() => { if (ehGerenciador) carregarDadosBusca(); }, [ehGerenciador]);


    useEffect(() => {
        setNumero('');
        setApartamentoInfo(null);
    }, [idBloco]);

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

    const carregarDadosBusca = async () => {
        try {
            const [resApt, resBloco] = await Promise.all([
                fetch(`${API_URL}/apartamentos`),
                fetch(`${API_URL}/blocos`)
            ]);
            if (!resApt.ok || !resBloco.ok) throw new Error();
            setApartamentos(await resApt.json());
            setBlocos(await resBloco.json());
        } catch {
            setErro('Erro ao carregar apartamentos');
        }
    };

    // ---------- Apartamentos do bloco selecionado ----------
    const apartamentosDoBloco = idBloco
        ? apartamentos.filter((apt) => apt.idBloco === parseInt(idBloco))
        : [];

    // ---------- Números restritos ao bloco selecionado ----------
    const numerosDoBloco = [...new Set(apartamentosDoBloco.map((apt) => apt.numero))]
        .sort((a, b) => a - b);

    // ---------- Busca de apartamento por bloco + número ----------
    const apartamentoPreenchido = idBloco && numero.trim();

    const buscarApartamento = async () => {
        if (!apartamentoPreenchido) { setApartamentoInfo(null); return; }
        try {
            setBuscandoApto(true);
            setApartamentoInfo(null);
            setErro('');

            const apto = apartamentosDoBloco.find((a) => a.numero === parseInt(numero));

            if (!apto) { setErro('Apartamento não encontrado'); return; }

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

    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setSucesso('');
        setApartamentoInfo(null);
        setIdBloco('');
        setNumero('');
        setFormData({ nome: '', cpf: '', prestador: false });
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
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
            setIdBloco('');
            setNumero('');
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

    const detalheDoVisitante = (v) => {
        if (v.prestador) return 'Prestador de serviço';
        if (v.cpf) return `CPF: ${v.cpf}`;
        return '-';
    };

    const apartamentoDoVisitante = (v) =>
        [v.idInquilino && `Inquilino ID: ${v.idInquilino}`, v.idDono && `Dono ID: ${v.idDono}`]
            .filter(Boolean)
            .join(' · ');

    return (
        <div id="Visitantes_Pagina">

            <button id="Visitantes_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="Visitantes_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
            </button>

            <h1 id="Visitantes_Titulo">{ehGerenciador ? 'VISITANTES PENDENTES' : 'SEUS VISITANTES'}</h1>

            {!mostrarForm && erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && visitantes.length === 0 && !erro && (
                <p className="mensagem-info">Nenhum visitante encontrado</p>
            )}

            <div id="Visitantes_Lista">
                {visitantes.map((v) => (
                    <div key={v.idVisitante} className="vis-linha">
                        <div className="vis-avatar">
                            {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
                        </div>

                        <div className="vis-nome-bloco">
                            <span className="vis-nome">{v.nome}</span>
                            {ehGerenciador && apartamentoDoVisitante(v) && (
                                <span className="vis-sub">{apartamentoDoVisitante(v)}</span>
                            )}
                        </div>

                        <span className="vis-detalhe">{detalheDoVisitante(v)}</span>

                        <span className="vis-status">
                            <i className="vis-status-ponto" style={{ backgroundColor: getStatusCor(v.status) }} />
                            {v.status}
                        </span>

                        <div className="vis-acoes">
                            {ehGerenciador && v.status === 'Pendente' && (
                                <button className="vis-acao Green_Button_Empty" onClick={() => handleConfirmar(v.idVisitante)}
                                    title="Liberar entrada" aria-label="Liberar entrada">
                                    <Check size={20} />
                                </button>
                            )}
                            {(ehGerenciador || (ehMorador && v.status === 'Pendente')) && (
                                <button className="vis-acao Green_Button_Empty" onClick={() => handleCancelar(v.idVisitante)}
                                    title="Cancelar visitante" aria-label="Cancelar visitante">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div id="Visitantes_Botoes">
                <button id="Visitantes_Atualizar" className="Green_Button_Empty" onClick={carregarVisitantes}
                    title="Atualizar lista" aria-label="Atualizar lista">
                    <RefreshCw size={22} />
                </button>
                {(ehGerenciador || ehMorador) && (
                    <button id="Visitantes_Novo" className="Green_Button_Empty" onClick={abrirForm}
                        title="Novo visitante" aria-label="Novo visitante">
                        <Plus size={30} strokeWidth={3} />
                    </button>
                )}
            </div>

            {mostrarForm && (
                <div id="Visitantes_Modal" role="dialog" aria-modal="true">
                    <form id="Visitantes_Form" className="Empty_Box" onSubmit={handleSolicitar}>
                        <h2 id="Visitantes_Form_Titulo">NOVO VISITANTE</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        {ehGerenciador && (
                            <>
                                <div className="vis-linha-apto">
                                    <div className="vis-campo">
                                        <label htmlFor="Visitantes_Bloco">Bloco *</label>
                                        <select
                                            id="Visitantes_Bloco"
                                            className="Green_Input"
                                            value={idBloco}
                                            onChange={(e) => { setIdBloco(e.target.value); setErro(''); }}
                                        >
                                            <option value="">Selecione o bloco</option>
                                            {blocos.map((b) => (
                                                <option key={b.idBloco} value={b.idBloco}>{b.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="vis-campo">
                                        <label htmlFor="Visitantes_Numero">Número *</label>
                                        <input
                                            id="Visitantes_Numero"
                                            className="Green_Input"
                                            type="text"
                                            inputMode="numeric"
                                            list="lista-numeros-visitante"
                                            placeholder={idBloco ? "Ex: 101" : "Selecione o bloco primeiro"}
                                            value={numero}
                                            onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '')); setApartamentoInfo(null); setErro(''); }}
                                            onBlur={buscarApartamento}
                                            disabled={!idBloco}
                                            autoComplete="off"
                                        />
                                        <datalist id="lista-numeros-visitante">
                                            {numerosDoBloco.map((n) => (
                                                <option key={n} value={n} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                <span className="vis-dica">Saia do campo de número para buscar automaticamente</span>

                                {buscandoApto && <p className="vis-buscando"><Search size={14} /> Buscando apartamento...</p>}

                                {apartamentoInfo && (
                                    <div className="vis-apto-info Green_Box_Full">
                                        <h4 className="vis-apto-titulo">
                                            <CheckCircle size={16} /> Apto {apartamentoInfo.apto.numero} encontrado
                                        </h4>
                                        <div className="vis-apto-grid">
                                            <div>
                                                <span className="vis-apto-label"><User size={12} /> Inquilino</span>
                                                <span className="vis-apto-valor">
                                                    {apartamentoInfo.inquilino
                                                        ? `${apartamentoInfo.inquilino.nome} (ID ${apartamentoInfo.inquilino.idInquilino})`
                                                        : 'Sem inquilino'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="vis-apto-label"><Home size={12} /> Dono</span>
                                                <span className="vis-apto-valor">
                                                    {apartamentoInfo.dono
                                                        ? `${apartamentoInfo.dono.nome} (ID ${apartamentoInfo.dono.idDono})`
                                                        : 'Sem dono'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="vis-campo">
                            <label htmlFor="Visitantes_Nome">Nome do visitante *</label>
                            <input
                                id="Visitantes_Nome"
                                className="Green_Input"
                                type="text"
                                placeholder="Nome completo"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </div>

                        <div className="vis-campo">
                            <label htmlFor="Visitantes_Cpf">CPF (opcional)</label>
                            <input
                                id="Visitantes_Cpf"
                                className="Green_Input"
                                type="text"
                                placeholder="000.000.000-00"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                            />
                        </div>

                        <label className="vis-checkbox" htmlFor="Visitantes_Prestador">
                            <input
                                id="Visitantes_Prestador"
                                type="checkbox"
                                checked={formData.prestador}
                                onChange={(e) => setFormData({ ...formData, prestador: e.target.checked })}
                            />
                            Prestador de serviço?
                        </label>

                        <div id="Visitantes_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button
                                type="submit"
                                className="Green_Button_Empty"
                                disabled={ehGerenciador && (!apartamentoInfo || buscandoApto)}
                            >
                                SOLICITAR
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Visitantes;
import React, { useState, useEffect } from 'react';
import './Encomendas.css';
import EncomendasPorteiro from './EncomendasPorteiro';
import { ArrowLeft, X, Plus, Search, CheckCircle, User, Home, Check } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Encomendas({ usuario, aoNavegar }) {
    const [encomendas, setEncomendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [idApartamento, setIdApartamento] = useState('');
    const [apartamentoInfo, setApartamentoInfo] = useState(null);
    const [buscandoApto, setBuscandoApto] = useState(false);

    const ehGerenciador = usuario.tipo === 'PORTEIRO' || usuario.tipo === 'SINDICO';

    useEffect(() => { carregarEncomendas(); }, []);

    const carregarEncomendas = async () => {
        try {
            setCarregando(true);
            setErro('');
            let url = '';
            if (ehGerenciador) {
                url = `${API_URL}/encomendas`;
            } else if (usuario.tipo === 'DONO') {
                url = `${API_URL}/encomendas/dono/${usuario.id}`;
            } else {
                url = `${API_URL}/encomendas/inquilino/${usuario.id}`;
            }
            const res = await fetch(url);
            if (!res.ok) throw new Error();
            setEncomendas(await res.json());
        } catch {
            setErro('Erro ao carregar encomendas');
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

    const handleApartamentoBlur = () => {
        if (idApartamento) buscarApartamento(idApartamento);
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!idApartamento) { setErro('ID do apartamento é obrigatório'); return; }
        if (!apartamentoInfo) { setErro('Busque o apartamento primeiro'); return; }

        const body = {
            idApartamento: parseInt(idApartamento),
            idInquilino: apartamentoInfo.inquilino ? apartamentoInfo.inquilino.idInquilino : null,
            idDono: apartamentoInfo.dono ? apartamentoInfo.dono.idDono : null,
            status: 'Recebida'
        };

        try {
            setErro('');
            const res = await fetch(`${API_URL}/encomendas?nomePorteiro=${encodeURIComponent(usuario.nome)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error();
            setSucesso('Encomenda registrada com sucesso!');
            setIdApartamento('');
            setApartamentoInfo(null);
            setMostrarForm(false);
            carregarEncomendas();
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao registrar encomenda');
        }
    };

    const handleRetirar = async (idEncomenda) => {
        try {
            const res = await fetch(`${API_URL}/encomendas/${idEncomenda}/retirar`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error();
            carregarEncomendas();
        } catch {
            setErro('Erro ao atualizar encomenda');
        }
    };

    const getStatusCor = (status) => {
        if (status === 'Recebida') return '#5BA989';
        if (status === 'Retirada') return '#899A3D';
        return '#D4A760';
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR');
    };

    // Agrupa as encomendas (mais recentes primeiro) em faixas de tempo
    const agruparPorSemana = (lista) => {
        const agora = Date.now();
        const tempo = (e) => (e.dataRecebimento ? new Date(e.dataRecebimento).getTime() : 0);
        const grupos = { 'essa semana': [], 'há uma semana': [], 'mais antigas': [] };

        [...lista].sort((a, b) => tempo(b) - tempo(a)).forEach((enc) => {
            const dias = enc.dataRecebimento ? Math.floor((agora - tempo(enc)) / 86400000) : 999;
            if (dias < 7) grupos['essa semana'].push(enc);
            else if (dias < 14) grupos['há uma semana'].push(enc);
            else grupos['mais antigas'].push(enc);
        });

        return Object.entries(grupos).filter(([, itens]) => itens.length > 0);
    };

    const grupos = agruparPorSemana(encomendas);

    return (
        <div id="Encomendas_Pagina">

            <button id="Encomendas_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="Encomendas_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                <User size={28} />
            </button>

            <h1 id="Encomendas_Titulo">ENCOMENDAS</h1>

            {ehGerenciador && (
                <div id="Encomendas_Acoes">
                    <button className="enc-botao-novo"
                        onClick={() => { setMostrarForm(!mostrarForm); setErro(''); setSucesso(''); setApartamentoInfo(null); setIdApartamento(''); }}>
                        {mostrarForm ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Registrar Encomenda</>}
                    </button>
                </div>
            )}

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {ehGerenciador && mostrarForm && (
                <form onSubmit={handleRegistrar} className="enc-form">
                    <div className="enc-form-campos">
                        <div className="form-group">
                            <label>ID Apartamento *</label>
                            <input
                                type="number"
                                placeholder="Ex: 1"
                                value={idApartamento}
                                onChange={(e) => { setIdApartamento(e.target.value); setApartamentoInfo(null); setErro(''); }}
                                onBlur={handleApartamentoBlur}
                                required
                            />
                            <span className="enc-campo-dica">Saia do campo para buscar automaticamente</span>
                        </div>
                    </div>

                    {buscandoApto && <p className="enc-buscando"><Search size={14} /> Buscando apartamento...</p>}

                    {apartamentoInfo && (
                        <div className="enc-apartamento-info">
                            <h4 className="enc-info-titulo"><CheckCircle size={14} /> Apartamento {apartamentoInfo.apto.idApartamento} encontrado</h4>
                            <div className="enc-info-grid">
                                {apartamentoInfo.inquilino ? (
                                    <div className="enc-info-item">
                                        <span className="enc-info-label"><User size={12} /> Inquilino</span>
                                        <span className="enc-info-valor">{apartamentoInfo.inquilino.nome}</span>
                                        <span className="enc-info-id">ID: {apartamentoInfo.inquilino.idInquilino}</span>
                                    </div>
                                ) : (
                                    <div className="enc-info-item vazio">
                                        <span className="enc-info-label"><User size={12} /> Inquilino</span>
                                        <span className="enc-info-valor">Sem inquilino</span>
                                    </div>
                                )}
                                {apartamentoInfo.dono ? (
                                    <div className="enc-info-item">
                                        <span className="enc-info-label"><Home size={12} /> Dono</span>
                                        <span className="enc-info-valor">{apartamentoInfo.dono.nome}</span>
                                        <span className="enc-info-id">ID: {apartamentoInfo.dono.idDono}</span>
                                    </div>
                                ) : (
                                    <div className="enc-info-item vazio">
                                        <span className="enc-info-label"><Home size={12} /> Dono</span>
                                        <span className="enc-info-valor">Sem dono</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button type="submit" className="enc-botao-submit" disabled={!apartamentoInfo || buscandoApto}>
                        <Check size={14} /> Confirmar Registro
                    </button>
                </form>
            )}

            {carregando && <p className="mensagem-info">Carregando...</p>}
            {!carregando && encomendas.length === 0 && !erro && (
                <p className="mensagem-info">Nenhuma encomenda encontrada</p>
            )}

            {grupos.map(([titulo, itens]) => (
                <section key={titulo} className="enc-grupo">
                    <h2 className="enc-grupo-titulo">{titulo}</h2>

                    {itens.map((enc) => (
                        <div key={enc.idEncomenda} className="enc-card Green_Box_Full">
                            <div className="enc-card-topo">
                                <div className="enc-avatar"><User size={28} /></div>
                                <h3 className="enc-card-titulo">ENCOMENDA #{enc.idEncomenda}</h3>
                            </div>

                            <div className="enc-card-colunas">
                                <span>{formatarData(enc.dataRecebimento)}</span>
                                <span>Apto {enc.idApartamento}</span>
                                <span className="enc-status">
                                    <i className="enc-status-ponto" style={{ backgroundColor: getStatusCor(enc.status) }} />
                                    {enc.status}
                                </span>
                            </div>

                            {enc.status !== 'Retirada' && (
                                <button className="enc-botao-acao verde" onClick={() => handleRetirar(enc.idEncomenda)}>
                                    <Check size={14} /> Marcar como Retirada
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}

export default Encomendas;
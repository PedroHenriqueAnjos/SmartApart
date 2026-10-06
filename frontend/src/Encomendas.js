import React, { useState, useEffect } from 'react';
import './Encomendas.css';
import { ArrowLeft, Plus, Check, User } from 'lucide-react';

const API_URL = "https://smartapart-bra7.onrender.com";

const normalizar = (v) => String(v ?? '').trim().toLowerCase();

function Encomendas({ usuario, aoNavegar }) {
    const [encomendas, setEncomendas] = useState([]);
    const [apartamentos, setApartamentos] = useState([]);
    const [blocos, setBlocos] = useState([]);
    const [inquilinos, setInquilinos] = useState([]);
    const [donos, setDonos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);

    const [idBloco, setIdBloco] = useState('');
    const [numeroApto, setNumeroApto] = useState('');
    const [nomeMorador, setNomeMorador] = useState('');

    const ehGerenciador = usuario.tipo === 'PORTEIRO';

    useEffect(() => { carregarEncomendas(); }, []);
    useEffect(() => { if (ehGerenciador) carregarDadosBusca(); }, [ehGerenciador]);


    useEffect(() => {
        setNumeroApto('');
        setNomeMorador('');
    }, [idBloco]);

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

    const carregarDadosBusca = async () => {
        try {
            const [resApt, resBloco, resInq, resDono] = await Promise.all([
                fetch(`${API_URL}/apartamentos`),
                fetch(`${API_URL}/blocos`),
                fetch(`${API_URL}/inquilinos`),
                fetch(`${API_URL}/donos`)
            ]);
            if (!resApt.ok || !resBloco.ok || !resInq.ok || !resDono.ok) throw new Error();

            setApartamentos(await resApt.json());
            setBlocos(await resBloco.json());
            setInquilinos(await resInq.json());
            setDonos(await resDono.json());
        } catch {
            setErro('Erro ao carregar dados para busca');
        }
    };

    // ---------- Apartamentos do bloco selecionado ----------
    const apartamentosDoBloco = idBloco
        ? apartamentos.filter((apt) => apt.idBloco === parseInt(idBloco))
        : [];

    // ---------- Números de apartamento restritos ao bloco selecionado ----------
    const numerosDoBloco = [...new Set(apartamentosDoBloco.map((apt) => apt.numero))]
        .sort((a, b) => a - b);

    // ---------- Moradores (inquilinos/donos) restritos ao bloco selecionado ----------
    const moradoresDoBloco = apartamentosDoBloco.flatMap((apt) => {
        const nomes = [];
        if (apt.idInquilino) {
            const inquilino = inquilinos.find((i) => i.idInquilino === apt.idInquilino);
            if (inquilino) nomes.push(inquilino.nome);
        }
        if (apt.idDono) {
            const dono = donos.find((d) => d.idDono === apt.idDono);
            if (dono) nomes.push(dono.nome);
        }
        return nomes;
    });

    // ---------- Busca de apartamento por bloco + número e/ou nome do morador ----------
    const buscaPreenchida = idBloco && (numeroApto.trim() || nomeMorador.trim());

    const apartamentoEncontrado = buscaPreenchida
        ? apartamentosDoBloco.find((apt) => {
            if (numeroApto.trim() && apt.numero !== parseInt(numeroApto)) return false;

            if (nomeMorador.trim()) {
                const inquilino = apt.idInquilino
                    ? inquilinos.find((i) => i.idInquilino === apt.idInquilino)
                    : null;
                const dono = apt.idDono
                    ? donos.find((d) => d.idDono === apt.idDono)
                    : null;

                const bateNome = (inquilino && normalizar(inquilino.nome) === normalizar(nomeMorador))
                    || (dono && normalizar(dono.nome) === normalizar(nomeMorador));

                if (!bateNome) return false;
            }

            return true;
        })
        : null;

    const infoApartamentoEncontrado = () => {
        if (!apartamentoEncontrado) return null;
        const bloco = blocos.find((b) => b.idBloco === apartamentoEncontrado.idBloco);
        const inquilino = apartamentoEncontrado.idInquilino
            ? inquilinos.find((i) => i.idInquilino === apartamentoEncontrado.idInquilino)
            : null;
        const dono = apartamentoEncontrado.idDono
            ? donos.find((d) => d.idDono === apartamentoEncontrado.idDono)
            : null;
        return { bloco, inquilino, dono };
    };

    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setSucesso('');
        setIdBloco('');
        setNumeroApto('');
        setNomeMorador('');
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!idBloco) { setErro('Selecione o bloco'); return; }
        if (!numeroApto.trim() && !nomeMorador.trim()) {
            setErro('Informe o número do apartamento ou o nome do morador');
            return;
        }
        if (!apartamentoEncontrado) { setErro('Nenhum apartamento encontrado com esses dados'); return; }

        const body = {
            idApartamento: apartamentoEncontrado.idApartamento,
            idInquilino: apartamentoEncontrado.idInquilino || null,
            idDono: apartamentoEncontrado.idDono || null,
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
            setIdBloco('');
            setNumeroApto('');
            setNomeMorador('');
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

    const getApartamentoLabel = (idApartamento) => {
        const apt = apartamentos.find((a) => a.idApartamento === idApartamento);
        if (!apt) return `Apto ${idApartamento}`;
        const bloco = blocos.find((b) => b.idBloco === apt.idBloco);
        return `Bloco ${bloco ? bloco.nome : apt.idBloco} · Apto ${apt.numero}`;
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
                    <button className="enc-botao-novo Green_Button_Empty" onClick={abrirForm}>
                        <Plus size={16} /> Registrar Encomenda
                    </button>
                </div>
            )}

            {!mostrarForm && erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

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
                                <span>{getApartamentoLabel(enc.idApartamento)}</span>
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

            {ehGerenciador && mostrarForm && (
                <div id="EncomendasPorteiro_Modal" role="dialog" aria-modal="true">
                    <form id="EncomendasPorteiro_Form" className="Empty_Box" onSubmit={handleRegistrar}>
                        <h2 id="EncomendasPorteiro_Form_Titulo">NOVA ENCOMENDA</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div className="encp-campo">
                            <label htmlFor="Encomendas_Bloco">Bloco *</label>
                            <select
                                id="Encomendas_Bloco"
                                className="Green_Input"
                                value={idBloco}
                                onChange={(e) => setIdBloco(e.target.value)}
                                required
                            >
                                <option value="">Selecione o bloco</option>
                                {blocos.map((b) => (
                                    <option key={b.idBloco} value={b.idBloco}>{b.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="encp-campo">
                            <label htmlFor="Encomendas_Numero">Número do apartamento</label>
                            <input
                                id="Encomendas_Numero"
                                className="Green_Input"
                                type="text"
                                inputMode="numeric"
                                list="lista-numeros"
                                placeholder={idBloco ? "Ex: 101" : "Selecione o bloco primeiro"}
                                value={numeroApto}
                                onChange={(e) => setNumeroApto(e.target.value.replace(/\D/g, ''))}
                                disabled={!idBloco}
                                autoComplete="off"
                            />
                            <datalist id="lista-numeros">
                                {numerosDoBloco.map((numero) => (
                                    <option key={numero} value={numero} />
                                ))}
                            </datalist>
                        </div>

                        <div className="encp-campo">
                            <label htmlFor="Encomendas_Morador">Nome do morador (inquilino ou dono)</label>
                            <input
                                id="Encomendas_Morador"
                                className="Green_Input"
                                type="text"
                                list="lista-moradores"
                                placeholder={idBloco ? "Ex: João Silva" : "Selecione o bloco primeiro"}
                                value={nomeMorador}
                                onChange={(e) => setNomeMorador(e.target.value)}
                                disabled={!idBloco}
                                autoComplete="off"
                            />
                            <datalist id="lista-moradores">
                                {moradoresDoBloco.map((nome, i) => (
                                    <option key={i} value={nome} />
                                ))}
                            </datalist>
                        </div>

                        <p className="encp-dica">Preencha o número do apartamento, o nome do morador, ou os dois para uma busca mais precisa.</p>

                        {buscaPreenchida && (
                            <p className={`encp-confirmacao ${apartamentoEncontrado ? 'ok' : 'erro'}`}>
                                {apartamentoEncontrado
                                    ? (() => {
                                        const { bloco, inquilino, dono } = infoApartamentoEncontrado();
                                        return `✓ Bloco ${bloco ? bloco.nome : idBloco} · Apto ${apartamentoEncontrado.numero}`
                                            + (inquilino ? ` · Inquilino: ${inquilino.nome}` : '')
                                            + (dono ? ` · Dono: ${dono.nome}` : '');
                                    })()
                                    : '✕ Apartamento não encontrado com esses dados'}
                            </p>
                        )}

                        <div id="EncomendasPorteiro_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Full" disabled={!apartamentoEncontrado}>
                                <Check size={14} /> Confirmar Registro
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Encomendas;
import React, { useState, useEffect } from 'react';
import './Encomendas.css';
import './EncomendasPorteiro.css';
import { ArrowLeft, User, Check } from 'lucide-react';

const API_URL = "http://localhost:8080";

// Nomes dos campos da entidade Apartamento (ajuste se forem diferentes)
const CAMPO_BLOCO = 'bloco';
const CAMPO_NUMERO = 'numero';

const FORM_VAZIO = { bloco: '', numero: '', nomeInquilino: '', nomeDono: '' };

const normalizar = (v) => String(v ?? '').trim().toLowerCase();

function EncomendasPorteiro({ usuario, aoNavegar }) {
    const [encomendas, setEncomendas] = useState([]);
    const [apartamentos, setApartamentos] = useState([]);
    const [inquilinos, setInquilinos] = useState([]);
    const [donos, setDonos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [mostrarForm, setMostrarForm] = useState(false);
    const [formData, setFormData] = useState(FORM_VAZIO);
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
            const [resEnc, resApt, resInq, resDono] = await Promise.all([
                fetch(`${API_URL}/encomendas`),
                fetch(`${API_URL}/apartamentos`),
                fetch(`${API_URL}/inquilinos`),
                fetch(`${API_URL}/donos`)
            ]);
            if (!resEnc.ok) throw new Error(`GET /encomendas respondeu ${resEnc.status}`);
            if (!resApt.ok) throw new Error(`GET /apartamentos respondeu ${resApt.status}`);
            if (!resInq.ok) throw new Error(`GET /inquilinos respondeu ${resInq.status}`);
            if (!resDono.ok) throw new Error(`GET /donos respondeu ${resDono.status}`);

            const dadosEnc = await resEnc.json();
            const dadosApt = await resApt.json();
            const dadosInq = await resInq.json();
            const dadosDono = await resDono.json();

            setEncomendas(Array.isArray(dadosEnc) ? dadosEnc : []);
            setApartamentos(Array.isArray(dadosApt) ? dadosApt : []);
            setInquilinos(Array.isArray(dadosInq) ? dadosInq : []);
            setDonos(Array.isArray(dadosDono) ? dadosDono : []);
        } catch (err) {
            console.error(err);
            setErro('Erro ao carregar encomendas');
        } finally {
            setCarregando(false);
        }
    };

    const mostrarSucesso = (msg) => {
        setSucesso(msg);
        setTimeout(() => setSucesso(''), 3000);
    };

    const abrirForm = () => {
        setMostrarForm(true);
        setErro('');
        setFormData(FORM_VAZIO);
    };

    const fecharForm = () => {
        setMostrarForm(false);
        setErro('');
    };

    // ---------- Busca de apartamento por bloco + número ----------
    const apartamentoEncontrado = (formData.bloco.trim() && formData.numero.trim())
        ? apartamentos.find((a) =>
            normalizar(a[CAMPO_BLOCO]) === normalizar(formData.bloco) &&
            normalizar(a[CAMPO_NUMERO]) === normalizar(formData.numero))
        : null;

    const apartamentoPreenchido = formData.bloco.trim() && formData.numero.trim();

    // ---------- Busca de inquilino e dono por nome ----------
    const inquilinoEncontrado = formData.nomeInquilino.trim()
        ? inquilinos.find((i) => normalizar(i.nome) === normalizar(formData.nomeInquilino))
        : null;

    const donoEncontrado = formData.nomeDono.trim()
        ? donos.find((d) => normalizar(d.nome) === normalizar(formData.nomeDono))
        : null;

    const getApartamento = (idApartamento) => {
        const apt = apartamentos.find((a) => a.idApartamento === idApartamento);
        if (!apt) return `Apto ${idApartamento}`;
        return `Bloco ${apt[CAMPO_BLOCO]} · Apto ${apt[CAMPO_NUMERO]}`;
    };

    // ---------- Registrar ----------
    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!apartamentoEncontrado) {
            setErro('Apartamento não encontrado para esse bloco e número');
            return;
        }
        if (formData.nomeInquilino.trim() && !inquilinoEncontrado) {
            setErro('Inquilino não encontrado com esse nome');
            return;
        }
        if (formData.nomeDono.trim() && !donoEncontrado) {
            setErro('Dono não encontrado com esse nome');
            return;
        }
        try {
            setErro('');
            const res = await fetch(`${API_URL}/encomendas?nomePorteiro=${encodeURIComponent(usuario.nome)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idApartamento: apartamentoEncontrado.idApartamento,
                    idInquilino: inquilinoEncontrado ? inquilinoEncontrado.idInquilino : null,
                    idDono: donoEncontrado ? donoEncontrado.idDono : null
                })
            });
            if (!res.ok) throw new Error();
            setMostrarForm(false);
            setFormData(FORM_VAZIO);
            mostrarSucesso('Encomenda registrada!');
            carregarDados();
        } catch {
            setErro('Erro ao registrar encomenda');
        }
    };

    // ---------- Atualizar status ----------
    const handleAtualizarStatus = async (idEncomenda, status) => {
        try {
            setErro('');
            const res = await fetch(
                `${API_URL}/encomendas/${idEncomenda}/status?status=${status}&nomePorteiro=${encodeURIComponent(usuario.nome)}`,
                { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
            );
            if (!res.ok) throw new Error();
            mostrarSucesso('Encomenda marcada como retirada!');
            carregarDados();
        } catch {
            setErro('Erro ao atualizar status');
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

    // ---------- Agrupamento por semana ----------
    const rotuloSemana = (data) => {
        const inicioDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dias = Math.floor((inicioDia(new Date()) - inicioDia(new Date(data))) / 86400000);
        const semanas = Math.max(0, Math.floor(dias / 7));
        if (semanas === 0) return 'essa semana';
        if (semanas === 1) return 'há uma semana';
        return `há ${semanas} semanas`;
    };

    const ordenadas = [...encomendas].sort(
        (a, b) => new Date(b.dataRecebimento) - new Date(a.dataRecebimento)
    );

    const grupos = [];
    ordenadas.forEach((enc) => {
        const rotulo = rotuloSemana(enc.dataRecebimento);
        const ultimo = grupos[grupos.length - 1];
        if (ultimo && ultimo.rotulo === rotulo) ultimo.itens.push(enc);
        else grupos.push({ rotulo, itens: [enc] });
    });

    return (
        <div id="Encomendas_Pagina">

            <button id="Encomendas_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="Encomendas_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
            </button>

            <h1 id="Encomendas_Titulo">ENCOMENDAS</h1>

            <div id="Encomendas_Acoes">
                <button id="EncomendasPorteiro_Registrar" className="Green_Button_Empty" onClick={abrirForm}>
                    REGISTRAR ENCOMENDA
                </button>
            </div>

            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
            {!mostrarForm && erro && <p className="mensagem-erro">{erro}</p>}
            {carregando && <p className="mensagem-info">Carregando encomendas...</p>}
            {!carregando && encomendas.length === 0 && !erro && (
                <p className="mensagem-info">Nenhuma encomenda registrada</p>
            )}

            {grupos.map((grupo) => (
                <section key={grupo.rotulo} className="enc-grupo">
                    <h2 className="enc-grupo-titulo">{grupo.rotulo}</h2>

                    {grupo.itens.map((enc) => (
                        <div key={enc.idEncomenda} className="enc-card Green_Box_Full">
                            <div className="enc-card-topo">
                                <div className="enc-avatar">? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" />:<User size={28} /></div>
                                <h3 className="enc-card-titulo">ENCOMENDA #{enc.idEncomenda}</h3>
                            </div>

                            <div className="enc-card-colunas">
                                <span>{formatarData(enc.dataRecebimento)}</span>
                                <span>{getApartamento(enc.idApartamento)}</span>
                                <span className="enc-status">
                                    <span className="enc-status-ponto"
                                        style={{ backgroundColor: getStatusCor(enc.status) }} />
                                    {enc.status}
                                </span>
                            </div>

                            {enc.status !== 'Retirada' && (
                                <button className="enc-botao-acao Gold_Button_Empty"
                                    onClick={() => handleAtualizarStatus(enc.idEncomenda, 'Retirada')}>
                                    <Check size={16} /> MARCAR COMO RETIRADA
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            ))}

            {mostrarForm && (
                <div id="EncomendasPorteiro_Modal" role="dialog" aria-modal="true">
                    <form id="EncomendasPorteiro_Form" className="Empty_Box" onSubmit={handleRegistrar}>
                        <h2 id="EncomendasPorteiro_Form_Titulo">NOVA ENCOMENDA</h2>

                        {erro && <p className="mensagem-erro">{erro}</p>}

                        <div id="EncomendasPorteiro_Linha_Apto">
                            <div className="encp-campo">
                                <label htmlFor="EncomendasPorteiro_Bloco">Bloco *</label>
                                <input
                                    id="EncomendasPorteiro_Bloco"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: A"
                                    value={formData.bloco}
                                    onChange={(e) => setFormData({ ...formData, bloco: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="encp-campo">
                                <label htmlFor="EncomendasPorteiro_Numero">Número *</label>
                                <input
                                    id="EncomendasPorteiro_Numero"
                                    className="Green_Input"
                                    type="text"
                                    placeholder="Ex: 101"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {apartamentoPreenchido && (
                            <p className={`encp-confirmacao ${apartamentoEncontrado ? 'ok' : 'erro'}`}>
                                {apartamentoEncontrado
                                    ? `✓ Bloco ${apartamentoEncontrado[CAMPO_BLOCO]} · Apto ${apartamentoEncontrado[CAMPO_NUMERO]} encontrado`
                                    : '✕ Apartamento não encontrado'}
                            </p>
                        )}

                        <div className="encp-campo">
                            <label htmlFor="EncomendasPorteiro_Inquilino">Nome do Inquilino (opcional)</label>
                            <input
                                id="EncomendasPorteiro_Inquilino"
                                className="Green_Input"
                                type="text"
                                list="lista-inquilinos"
                                placeholder="Ex: João Silva"
                                value={formData.nomeInquilino}
                                onChange={(e) => setFormData({ ...formData, nomeInquilino: e.target.value })}
                                autoComplete="off"
                            />
                            <datalist id="lista-inquilinos">
                                {inquilinos.map((i) => (
                                    <option key={i.idInquilino} value={i.nome} />
                                ))}
                            </datalist>
                            {formData.nomeInquilino.trim() && (
                                <span className={`encp-confirmacao ${inquilinoEncontrado ? 'ok' : 'erro'}`}>
                                    {inquilinoEncontrado ? `✓ Encontrado (ID ${inquilinoEncontrado.idInquilino})` : '✕ Não encontrado'}
                                </span>
                            )}
                        </div>

                        <div className="encp-campo">
                            <label htmlFor="EncomendasPorteiro_Dono">Nome do Dono (opcional)</label>
                            <input
                                id="EncomendasPorteiro_Dono"
                                className="Green_Input"
                                type="text"
                                list="lista-donos"
                                placeholder="Ex: Maria Souza"
                                value={formData.nomeDono}
                                onChange={(e) => setFormData({ ...formData, nomeDono: e.target.value })}
                                autoComplete="off"
                            />
                            <datalist id="lista-donos">
                                {donos.map((d) => (
                                    <option key={d.idDono} value={d.nome} />
                                ))}
                            </datalist>
                            {formData.nomeDono.trim() && (
                                <span className={`encp-confirmacao ${donoEncontrado ? 'ok' : 'erro'}`}>
                                    {donoEncontrado ? `✓ Encontrado (ID ${donoEncontrado.idDono})` : '✕ Não encontrado'}
                                </span>
                            )}
                        </div>

                        <div id="EncomendasPorteiro_Form_Botoes">
                            <button type="button" className="Gold_Button_Empty" onClick={fecharForm}>
                                CANCELAR
                            </button>
                            <button type="submit" className="Gold_Button_Empty">
                                <Check size={16} /> REGISTRAR
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EncomendasPorteiro;
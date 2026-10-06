import React, { useState, useEffect } from 'react';
import './CadastroSindico.css';
import {
    cadastrarInquilino, cadastrarDono, cadastrarPorteiro,
    cadastrarBloco, listarBlocos,
    cadastrarApartamento, listarDonos, listarInquilinos,
    cadastrarSalao
} from './api';
import { ArrowLeft, User, UserPlus, Building2, Home, CalendarDays, Check } from 'lucide-react';
const API_URL = "https://smartapart-bra7.onrender.com";
const ABAS = [
    { id: 'usuario', rotulo: 'usuário', Icone: UserPlus },
    { id: 'bloco', rotulo: 'bloco', Icone: Building2 },
    { id: 'apartamento', rotulo: 'apartamento', Icone: Home },
    { id: 'salao', rotulo: 'salão', Icone: CalendarDays },
];

function CadastroSindico({ usuario, aoNavegar }) {
    const [abaAtiva, setAbaAtiva] = useState('usuario');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const [blocos, setBlocos] = useState([]);
    const [donos, setDonos] = useState([]);
    const [inquilinos, setInquilinos] = useState([]);
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
        carregarBlocos();
        carregarDonos();
        carregarInquilinos();
    }, []);

    const carregarBlocos = async () => {
        try {
            const dados = await listarBlocos();
            setBlocos(Array.isArray(dados) ? dados : []);
        } catch { /* afeta só o select de apartamento */ }
    };

    const carregarDonos = async () => {
        try {
            const dados = await listarDonos();
            setDonos(Array.isArray(dados) ? dados : []);
        } catch { /* afeta só o select de apartamento */ }
    };

    const carregarInquilinos = async () => {
        try {
            const dados = await listarInquilinos();
            setInquilinos(Array.isArray(dados) ? dados : []);
        } catch { /* afeta só o select de apartamento */ }
    };

    const mostrarSucesso = (msg) => {
        setSucesso(msg);
        setErro('');
        setTimeout(() => setSucesso(''), 3000);
    };

    // ---------- Cadastro de usuário ----------
    const [tipoUsuario, setTipoUsuario] = useState('INQUILINO');
    const [formUsuario, setFormUsuario] = useState({ nome: '', cpf: '', senha: '' });

    const formatarCPF = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const handleCadastrarUsuario = async (e) => {
        e.preventDefault();
        setErro('');

        if (!formUsuario.nome.trim()) { setErro('Informe o nome'); return; }
        if (formUsuario.cpf.replace(/\D/g, '').length !== 11) { setErro('CPF inválido'); return; }
        if (formUsuario.senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres'); return; }

        setCarregando(true);
        try {
            const dados = {
                nome: formUsuario.nome.trim(),
                cpf: formUsuario.cpf.replace(/\D/g, ''),
                senha: formUsuario.senha
            };

            if (tipoUsuario === 'INQUILINO') await cadastrarInquilino(dados);
            else if (tipoUsuario === 'DONO') await cadastrarDono(dados);
            else if (tipoUsuario === 'PORTEIRO') await cadastrarPorteiro(dados);

            setFormUsuario({ nome: '', cpf: '', senha: '' });
            mostrarSucesso('Usuário cadastrado com sucesso!');

            if (tipoUsuario === 'DONO') carregarDonos();
            if (tipoUsuario === 'INQUILINO') carregarInquilinos();
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // ---------- Cadastro de bloco ----------
    const [nomeBloco, setNomeBloco] = useState('');

    const handleCadastrarBloco = async (e) => {
        e.preventDefault();
        setErro('');

        if (!nomeBloco.trim()) { setErro('Informe o nome/letra do bloco'); return; }

        setCarregando(true);
        try {
            await cadastrarBloco({ nome: nomeBloco.trim() });
            setNomeBloco('');
            mostrarSucesso('Bloco cadastrado com sucesso!');
            carregarBlocos();
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // ---------- Cadastro de apartamento ----------
    const [formApto, setFormApto] = useState({ idBloco: '', numero: '', idDono: '', idInquilino: '' });

    const handleCadastrarApartamento = async (e) => {
        e.preventDefault();
        setErro('');

        if (!formApto.idBloco) { setErro('Selecione o bloco'); return; }
        if (!formApto.numero.trim()) { setErro('Informe o número do apartamento'); return; }
        if (!formApto.idDono) { setErro('Selecione o dono do apartamento'); return; }

        setCarregando(true);
        try {
            await cadastrarApartamento({
                idBloco: parseInt(formApto.idBloco),
                numero: parseInt(formApto.numero),
                idDono: parseInt(formApto.idDono),
                idInquilino: formApto.idInquilino ? parseInt(formApto.idInquilino) : null
            });
            setFormApto({ idBloco: '', numero: '', idDono: '', idInquilino: '' });
            mostrarSucesso('Apartamento cadastrado com sucesso!');
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    // ---------- Cadastro de salão ----------
    const [formSalao, setFormSalao] = useState({ nome: '', status: 'Disponível' });

    const handleCadastrarSalao = async (e) => {
        e.preventDefault();
        setErro('');

        if (!formSalao.nome.trim()) { setErro('Informe o nome do salão'); return; }

        setCarregando(true);
        try {
            await cadastrarSalao({
                nome: formSalao.nome.trim(),
                status: formSalao.status
            });
            setFormSalao({ nome: '', status: 'Disponível' });
            mostrarSucesso('Salão cadastrado com sucesso!');
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div id="CadastroSindico_Pagina">

            <button id="CadastroSindico_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <button id="CadastroSindico_Perfil" onClick={() => aoNavegar('perfil')} title="Perfil">
                {foto ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" /> : <User size={28} />}
            </button>

            <h1 id="CadastroSindico_Titulo">CADASTROS</h1>

            <nav id="CadastroSindico_Abas" className="Green_Box_Full">
                {ABAS.map(({ id, rotulo, Icone }) => (
                    <button key={id}
                        className={`cs-aba ${abaAtiva === id ? 'ativa' : ''}`}
                        onClick={() => { setAbaAtiva(id); setErro(''); }}>
                        <Icone size={22} />
                        <span>{rotulo}</span>
                    </button>
                ))}
            </nav>

            {erro && <p className="mensagem-erro">{erro}</p>}
            {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

            {abaAtiva === 'usuario' && (
                <form id="CadastroSindico_Form" className="Empty_Box" onSubmit={handleCadastrarUsuario}>
                    <h2 className="cs-form-titulo">NOVO USUÁRIO</h2>

                    <div className="cs-campo">
                        <label htmlFor="cs-tipo">Tipo de usuário</label>
                        <select id="cs-tipo" className="Gold_Input"
                            value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                            <option value="INQUILINO">Inquilino</option>
                            <option value="DONO">Dono</option>
                            <option value="PORTEIRO">Porteiro</option>
                        </select>
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-nome">Nome completo</label>
                        <input id="cs-nome" className="Gold_Input" type="text"
                            placeholder="Nome completo"
                            value={formUsuario.nome}
                            onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-cpf">CPF</label>
                        <input id="cs-cpf" className="Gold_Input" type="text"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            value={formUsuario.cpf}
                            onChange={(e) => setFormUsuario({ ...formUsuario, cpf: formatarCPF(e.target.value) })}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-senha">Senha</label>
                        <input id="cs-senha" className="Gold_Input" type="password"
                            placeholder="Senha inicial"
                            value={formUsuario.senha}
                            onChange={(e) => setFormUsuario({ ...formUsuario, senha: e.target.value })}
                            disabled={carregando}
                        />
                    </div>

                    <button type="submit" className="Green_Button_Empty" disabled={carregando}>
                        <Check size={16} /> {carregando ? 'CADASTRANDO...' : 'CADASTRAR USUÁRIO'}
                    </button>
                </form>
            )}

            {abaAtiva === 'bloco' && (
                <form id="CadastroSindico_Form" className="Empty_Box" onSubmit={handleCadastrarBloco}>
                    <h2 className="cs-form-titulo">NOVO BLOCO</h2>

                    <div className="cs-campo">
                        <label htmlFor="cs-bloco-nome">Nome / letra do bloco</label>
                        <input id="cs-bloco-nome" className="Gold_Input" type="text"
                            placeholder="Ex: A"
                            value={nomeBloco}
                            onChange={(e) => setNomeBloco(e.target.value)}
                            disabled={carregando}
                        />
                    </div>

                    <button type="submit" className="Green_Button_Empty" disabled={carregando}>
                        <Check size={16} /> {carregando ? 'CADASTRANDO...' : 'CADASTRAR BLOCO'}
                    </button>
                </form>
            )}

            {abaAtiva === 'apartamento' && (
                <form id="CadastroSindico_Form" className="Empty_Box" onSubmit={handleCadastrarApartamento}>
                    <h2 className="cs-form-titulo">NOVO APARTAMENTO</h2>

                    <div className="cs-campo">
                        <label htmlFor="cs-apto-bloco">Bloco</label>
                        <select id="cs-apto-bloco" className="Gold_Input"
                            value={formApto.idBloco}
                            onChange={(e) => setFormApto({ ...formApto, idBloco: e.target.value })}
                            disabled={carregando}>
                            <option value="">Selecione o bloco</option>
                            {blocos.map((b) => (
                                <option key={b.idBloco} value={b.idBloco}>{b.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-apto-numero">Número</label>
                        <input id="cs-apto-numero" className="Gold_Input" type="number"
                            placeholder="Ex: 101"
                            value={formApto.numero}
                            onChange={(e) => setFormApto({ ...formApto, numero: e.target.value })}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-apto-dono">Dono *</label>
                        <select id="cs-apto-dono" className="Gold_Input"
                            value={formApto.idDono}
                            onChange={(e) => setFormApto({ ...formApto, idDono: e.target.value })}
                            disabled={carregando}>
                            <option value="">Selecione o dono</option>
                            {donos.map((d) => (
                                <option key={d.idDono} value={d.idDono}>{d.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-apto-inquilino">Inquilino (opcional)</label>
                        <select id="cs-apto-inquilino" className="Gold_Input"
                            value={formApto.idInquilino}
                            onChange={(e) => setFormApto({ ...formApto, idInquilino: e.target.value })}
                            disabled={carregando}>
                            <option value="">Sem inquilino</option>
                            {inquilinos.map((i) => (
                                <option key={i.idInquilino} value={i.idInquilino}>{i.nome}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="Green_Button_Empty" disabled={carregando}>
                        <Check size={16} /> {carregando ? 'CADASTRANDO...' : 'CADASTRAR APARTAMENTO'}
                    </button>
                </form>
            )}

            {abaAtiva === 'salao' && (
                <form id="CadastroSindico_Form" className="Empty_Box" onSubmit={handleCadastrarSalao}>
                    <h2 className="cs-form-titulo">NOVO SALÃO</h2>

                    <div className="cs-campo">
                        <label htmlFor="cs-salao-nome">Nome do salão</label>
                        <input id="cs-salao-nome" className="Gold_Input" type="text"
                            placeholder="Ex: Salão de Festas"
                            value={formSalao.nome}
                            onChange={(e) => setFormSalao({ ...formSalao, nome: e.target.value })}
                            disabled={carregando}
                        />
                    </div>

                    <div className="cs-campo">
                        <label htmlFor="cs-salao-status">Status</label>
                        <select id="cs-salao-status" className="Gold_Input"
                            value={formSalao.status}
                            onChange={(e) => setFormSalao({ ...formSalao, status: e.target.value })}
                            disabled={carregando}>
                            <option value="Disponível">Disponível</option>
                            <option value="Indisponível">Indisponível</option>
                        </select>
                    </div>

                    <button type="submit" className="Green_Button_Empty" disabled={carregando}>
                        <Check size={16} /> {carregando ? 'CADASTRANDO...' : 'CADASTRAR SALÃO'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default CadastroSindico;
import React, { useState, useEffect, useRef } from 'react';
import { atualizarPerfilInquilino } from './api';
import './perfil.css';
import { ArrowLeft, User, Pencil, Check, X, Camera, Trash2, LogOut } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Perfil({ usuario, aoNavegar, aoSair }) {
    const [nomeEditado, setNomeEditado] = useState(usuario.nome);
    const [editando, setEditando] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemTipo, setMensagemTipo] = useState('');
    const [foto, setFoto] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);
    const inputFotoRef = useRef(null);

    useEffect(() => {
        carregarFoto();
    }, []);

    const carregarFoto = async () => {
        try {
            const res = await fetch(`${API_URL}/foto/${usuario.id}?tipoUsuario=${usuario.tipo}`);
            if (res.ok) {
                const dados = await res.json();
                setFoto(dados.foto || null);
            }
        } catch {

        }
    };

    const handleSalvarNome = async () => {
        if (!nomeEditado.trim()) {
            setMensagem('Digite um nome válido');
            setMensagemTipo('erro');
            return;
        }
        setCarregando(true);
        try {
            await atualizarPerfilInquilino(usuario.id, nomeEditado);
            setMensagem('Nome atualizado com sucesso!');
            setMensagemTipo('sucesso');
            setEditando(false);
        } catch {
            setMensagem('Erro ao atualizar nome');
            setMensagemTipo('erro');
        } finally {
            setCarregando(false);
        }
    };

    const handleSelecionarFoto = (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (!tiposPermitidos.includes(arquivo.type)) {
            setMensagem('Tipo inválido. Use JPEG, PNG ou WebP');
            setMensagemTipo('erro');
            return;
        }

        if (arquivo.size > 2 * 1024 * 1024) {
            setMensagem('Foto muito grande. Máximo 2MB');
            setMensagemTipo('erro');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const base64 = ev.target.result;
            await enviarFoto(base64);
        };
        reader.readAsDataURL(arquivo);
    };

    const enviarFoto = async (base64) => {
        setCarregandoFoto(true);
        setMensagem('');
        try {
            const res = await fetch(`${API_URL}/foto/${usuario.id}?tipoUsuario=${usuario.tipo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fotoBase64: base64 })
            });
            if (!res.ok) {
                const erro = await res.json();
                throw new Error(erro.erro || 'Erro ao enviar foto');
            }
            setFoto(base64);
            setMensagem('Foto atualizada com sucesso!');
            setMensagemTipo('sucesso');
        } catch (err) {
            setMensagem(err.message || 'Erro ao enviar foto');
            setMensagemTipo('erro');
        } finally {
            setCarregandoFoto(false);
        }
    };

    const handleRemoverFoto = async () => {
        setCarregandoFoto(true);
        try {
            const res = await fetch(`${API_URL}/foto/${usuario.id}?tipoUsuario=${usuario.tipo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fotoBase64: null })
            });
            if (!res.ok) throw new Error();
            setFoto(null);
            setMensagem('Foto removida!');
            setMensagemTipo('sucesso');
        } catch {
            setMensagem('Erro ao remover foto');
            setMensagemTipo('erro');
        } finally {
            setCarregandoFoto(false);
        }
    };

    return (
        <div id="Perfil_Pagina">

            <button id="Perfil_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <h1 id="Perfil_Titulo">MEU PERFIL</h1>

            {mensagem && (
                <p className={mensagemTipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro'}>{mensagem}</p>
            )}

            <div id="Perfil_Card" className="Green_Box_Full">

                <div id="Perfil_Avatar_Bloco">
                    <div id="Perfil_Avatar">
                        {foto
                            ? <img id="Perfil_Foto" src={foto} alt="Foto de perfil" />
                            : <User size={64} />
                        }
                    </div>

                    <div id="Perfil_Foto_Botoes">
                        <button
                            id="Perfil_Camera"
                            className="Green_Button_Full perfil-botao-icone"
                            onClick={() => inputFotoRef.current.click()}
                            disabled={carregandoFoto}
                            title="Alterar foto"
                            aria-label="Alterar foto"
                        >
                            <Camera size={18} />
                        </button>
                        {foto && (
                            <button
                                id="Perfil_Remover"
                                className="Green_Button_Empty perfil-botao-icone"
                                onClick={handleRemoverFoto}
                                disabled={carregandoFoto}
                                title="Remover foto"
                                aria-label="Remover foto"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <input
                        id="Perfil_Foto_Input"
                        ref={inputFotoRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleSelecionarFoto}
                    />
                    {carregandoFoto && <p id="Perfil_Enviando">Enviando...</p>}
                </div>

                <div id="Perfil_Dados">
                    <div className="perfil-campo">
                        <label htmlFor="Perfil_Nome_Input">NOME</label>
                        {editando ? (
                            <div className="perfil-nome-linha">
                                <input
                                    id="Perfil_Nome_Input"
                                    className="Gold_Input"
                                    type="text"
                                    value={nomeEditado}
                                    onChange={(e) => setNomeEditado(e.target.value)}
                                />
                                <button className="Green_Button_Full perfil-botao-icone" onClick={handleSalvarNome}
                                    disabled={carregando} title="Salvar" aria-label="Salvar nome">
                                    <Check size={18} />
                                </button>
                                <button className="Green_Button_Empty perfil-botao-icone"
                                    onClick={() => { setEditando(false); setNomeEditado(usuario.nome); }}
                                    title="Cancelar" aria-label="Cancelar edição">
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-nome-linha">
                                <p id="Perfil_Nome_Valor">{usuario.nome}</p>
                                <button className="Green_Button_Empty perfil-botao-icone"
                                    onClick={() => { setEditando(true); setMensagem(''); }}
                                    title="Editar nome" aria-label="Editar nome">
                                    <Pencil size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="perfil-campo">
                        <span className="perfil-rotulo">TIPO DE USUÁRIO</span>
                        <span id="Perfil_Tipo" className="Gold_Pill_Full">{usuario.tipo}</span>
                    </div>
                </div>
            </div>

            <button id="Perfil_Sair" className="Green_Button_Full" onClick={aoSair}>
                <LogOut size={20} /> SAIR
            </button>
        </div>
    );
}

export default Perfil;
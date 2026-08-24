import React, { useState, useEffect, useRef } from 'react';
import { atualizarPerfilInquilino } from './api';
import './perfil.css';
import { User, Pencil, Check, X, Camera, Trash2 } from 'lucide-react';

const API_URL = "http://localhost:8080";

function Perfil({ usuario }) {
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

    const getTipoCor = (tipo) => {
        if (tipo === 'SINDICO') return '#D4A760';
        if (tipo === 'DONO') return '#5BA989';
        if (tipo === 'PORTEIRO') return '#466B65';
        return '#5BA989';
    };

    return (
        <div className="perfil">
            <h2 className="perfil-titulo"><User size={22} /> Meu Perfil</h2>

            <div className="perfil-card">
                <div className="perfil-avatar-wrapper">
                    <div className="perfil-avatar">
                        {foto
                            ? <img src={foto} alt="Foto de perfil" className="perfil-foto" />
                            : <User size={50} color="white" />
                        }
                    </div>
                    <div className="perfil-avatar-acoes">
                        <button
                            className="perfil-foto-botao"
                            onClick={() => inputFotoRef.current.click()}
                            disabled={carregandoFoto}
                            title="Alterar foto"
                        >
                            <Camera size={16} />
                        </button>
                        {foto && (
                            <button
                                className="perfil-foto-botao remover"
                                onClick={handleRemoverFoto}
                                disabled={carregandoFoto}
                                title="Remover foto"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                    <input
                        ref={inputFotoRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        style={{ display: 'none' }}
                        onChange={handleSelecionarFoto}
                    />
                    {carregandoFoto && <p className="perfil-carregando">Enviando...</p>}
                </div>

                <div className="perfil-info">
                    <div className="perfil-campo">
                        <label>ID</label>
                        <p className="perfil-valor">{usuario.id}</p>
                    </div>

                    <div className="perfil-campo">
                        <label>Nome</label>
                        {editando ? (
                            <div className="perfil-nome-edit">
                                <input
                                    type="text"
                                    value={nomeEditado}
                                    onChange={(e) => setNomeEditado(e.target.value)}
                                    className="perfil-input"
                                />
                                <button className="perfil-icone-botao verde" onClick={handleSalvarNome} disabled={carregando}>
                                    <Check size={16} />
                                </button>
                                <button className="perfil-icone-botao vermelho" onClick={() => { setEditando(false); setNomeEditado(usuario.nome); }}>
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="perfil-nome-edit">
                                <p className="perfil-valor">{usuario.nome}</p>
                                <button className="perfil-icone-botao" onClick={() => { setEditando(true); setMensagem(''); }}>
                                    <Pencil size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="perfil-campo">
                        <label>Tipo de Usuário</label>
                        <div className="perfil-tipo" style={{ backgroundColor: getTipoCor(usuario.tipo) }}>
                            {usuario.tipo}
                        </div>
                    </div>
                </div>
            </div>

            {mensagem && (
                <p className={`perfil-mensagem ${mensagemTipo}`}>{mensagem}</p>
            )}
        </div>
    );
}

export default Perfil;
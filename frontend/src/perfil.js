import React, { useState, useEffect, useRef } from 'react';
import { atualizarPerfilInquilino } from './api';
import { supabase } from './supabaseClient';
import './perfil.css';
import { ArrowLeft, User, Pencil, Check, X, Camera, Trash2, LogOut } from 'lucide-react';

const API_URL = "http://localhost:8080";
const BUCKET = 'avatars';

// Extrai o caminho do arquivo a partir da URL pública (ignora fotos antigas em base64)
const caminhoDaUrl = (url) => {
    if (!url || url.startsWith('data:')) return null;
    const marcador = `/object/public/${BUCKET}/`;
    const i = url.indexOf(marcador);
    return i === -1 ? null : decodeURIComponent(url.slice(i + marcador.length).split('?')[0]);
};

function Perfil({ usuario, aoNavegar, aoSair, aoAtualizarUsuario }) {
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

    // Salva (ou limpa) a URL da foto no backend
    const salvarFotoNoBackend = async (fotoUrl) => {
        const res = await fetch(`${API_URL}/foto/${usuario.id}?tipoUsuario=${usuario.tipo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fotoUrl })
        });
        if (!res.ok) {
            const erro = await res.json().catch(() => ({}));
            throw new Error(erro.erro || 'Erro ao salvar foto');
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
            aoAtualizarUsuario({ nome: nomeEditado.trim() });
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

    const handleSelecionarFoto = async (e) => {
        const arquivo = e.target.files[0];
        e.target.value = ''; // permite escolher o mesmo arquivo de novo
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

        await enviarFoto(arquivo);
    };

    const enviarFoto = async (arquivo) => {
        setCarregandoFoto(true);
        setMensagem('');
        let novoCaminho = null;
        try {
            const ext = arquivo.type.split('/')[1];
            novoCaminho = `${usuario.tipo}/${usuario.id}/${crypto.randomUUID()}.${ext}`;

            // 1. Sobe a nova imagem
            const { error } = await supabase.storage
                .from(BUCKET)
                .upload(novoCaminho, arquivo, { contentType: arquivo.type, cacheControl: '3600' });
            if (error) {
                console.error('Erro do Supabase:', error);
                throw new Error('Erro ao enviar foto');
            }

            const { data } = supabase.storage.from(BUCKET).getPublicUrl(novoCaminho);

            // 2. Salva a URL no backend
            await salvarFotoNoBackend(data.publicUrl);

            // 3. Só agora apaga a foto anterior (se houver)
            const antigo = caminhoDaUrl(foto);
            if (antigo) await supabase.storage.from(BUCKET).remove([antigo]);

            setFoto(data.publicUrl);
            setMensagem('Foto atualizada com sucesso!');
            setMensagemTipo('sucesso');
        } catch (err) {
            // Se algo falhou, não deixa arquivo órfão no bucket
            if (novoCaminho) await supabase.storage.from(BUCKET).remove([novoCaminho]);
            setMensagem(err.message || 'Erro ao enviar foto');
            setMensagemTipo('erro');
        } finally {
            setCarregandoFoto(false);
        }
    };

    const handleRemoverFoto = async () => {
        setCarregandoFoto(true);
        try {
            await salvarFotoNoBackend(null);

            const antigo = caminhoDaUrl(foto);
            if (antigo) await supabase.storage.from(BUCKET).remove([antigo]);

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
                            className="Green_Button_Empty perfil-botao-icone"
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
                                <button className="Green_Button_Empty perfil-botao-icone" onClick={handleSalvarNome}
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

            <button id="Perfil_Sair" className="Green_Button_Empty" onClick={aoSair}>
                <LogOut size={20} /> SAIR
            </button>
        </div>
    );
}

export default Perfil;

import React, { useState, useEffect, useRef } from 'react';
import { getMessagens, enviarMensagem } from './api';
import './Chat.css';
import { ArrowLeft, Send } from 'lucide-react';

function Chat({ usuario, aoNavegar }) {
    const [mensagens, setMensagens] = useState([]);
    const [novaMsg, setNovaMsg] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        carregarMensagens();
        const intervalo = setInterval(carregarMensagens, 500);
        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens]);

    const carregarMensagens = async () => {
        try {
            const dados = await getMessagens();
            setMensagens(dados);
        } catch (err) {
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    const handleEnviar = async (e) => {
        e.preventDefault();
        if (!novaMsg.trim()) return;

        try {
            await enviarMensagem(usuario.nome, usuario.tipo, novaMsg);
            setNovaMsg('');
            carregarMensagens();
        } catch (err) {
            setErro('Erro ao enviar mensagem');
            console.error(err);
        }
    };

    const formatarHora = (data) => {
        const d = new Date(data);
        return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div id="Chat_Pagina">

            <button id="Chat_Voltar" onClick={() => aoNavegar('inicio')}
                title="Voltar para o início" aria-label="Voltar para o início">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <h1 id="Chat_Titulo">CHAT</h1>

            <div id="Chat_Container" className="Empty_Box">
                <div id="Chat_Mensagens">
                    {carregando && <p className="mensagem-info">Carregando mensagens...</p>}
                    {erro && <p className="mensagem-erro">{erro}</p>}

                    {mensagens.length === 0 && !carregando && (
                        <p className="mensagem-info">Nenhuma mensagem ainda</p>
                    )}

                    {mensagens.map((msg) => {
                        const ehDoUsuario = msg.nomeRemetente === usuario.nome;
                        return (
                            <div
                                key={msg.idMensagem}
                                className={`chat-mensagem ${ehDoUsuario ? 'propria' : 'outro'}`}
                            >
                                <div className={`msg-bubble ${ehDoUsuario ? 'Green_Box_Full' : 'Empty_Box'}`}>
                                    <p className="msg-nome">{msg.nomeRemetente}</p>
                                    <p className="msg-tipo">{msg.tipoRemetente}</p>
                                    <p className="msg-texto">{msg.texto}</p>
                                    <span className="msg-hora">{formatarHora(msg.dataEnvio)}</span>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleEnviar} id="Chat_Formulario">
                    <input
                        id="Chat_Input"
                        className="Green_Input"
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={novaMsg}
                        onChange={(e) => setNovaMsg(e.target.value)}
                    />
                    <button type="submit" id="Chat_Botao" className="Green_Button_Full" title="Enviar">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
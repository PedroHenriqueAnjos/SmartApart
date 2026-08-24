import React, { useState, useEffect, useRef } from 'react';
import { getMessagens, enviarMensagem } from './api';
import './Chat.css';
import { MessageCircle, Send } from 'lucide-react';

function Chat({ usuario }) {
    const [mensagens, setMensagens] = useState([]);
    const [novaMsg, setNovaMsg] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        carregarMensagens();
        const intervalo = setInterval(carregarMensagens, 3000);
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
        <div className="chat">
            <h2 className="chat-titulo"><MessageCircle size={22} /> Chat do Condomínio</h2>

            <div className="chat-container">
                <div className="chat-mensagens">
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
                                <div className="msg-bubble">
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

                <form onSubmit={handleEnviar} className="chat-formulario">
                    <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={novaMsg}
                        onChange={(e) => setNovaMsg(e.target.value)}
                        className="chat-input"
                    />
                    <button type="submit" className="chat-botao">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;
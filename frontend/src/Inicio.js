import React, { useState, useEffect } from 'react';
import { getAvisosRecentes } from './api';
import './Inicio.css';
import { Megaphone, User } from 'lucide-react';

function Inicio({ usuario }) {
    const [avisos, setAvisos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        carregarAvisos();
    }, []);

    const carregarAvisos = async () => {
        try {
            setCarregando(true);
            const dados = await getAvisosRecentes();
            setAvisos(dados);
        } catch (err) {
            setErro('Erro ao carregar avisos');
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    const formatarData = (data) => {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    };

    return (
        <div className="inicio">
            <h2 className="inicio-titulo">Bem-vindo, {usuario.nome}!</h2>
            <p className="inicio-tipo">Tipo de usuário: <strong>{usuario.tipo}</strong></p>

            <section className="avisos-secao">
                <h3 className="avisos-titulo"><Megaphone size={18} /> Avisos Recentes</h3>

                {carregando && <p className="mensagem-info">Carregando avisos...</p>}
                {erro && <p className="mensagem-erro">{erro}</p>}

                {!carregando && avisos.length === 0 && (
                    <p className="mensagem-info">Nenhum aviso no momento</p>
                )}

                <div className="avisos-lista">
                    {avisos.map((aviso) => (
                        <div key={aviso.idAvisos} className="aviso-card">
                            <div className="aviso-header">
                                <h4 className="aviso-assunto"><User size={14} /> {aviso.assunto}</h4>
                                <span className="aviso-data">{formatarData(aviso.data)}</span>
                            </div>
                            <p className="aviso-texto">{aviso.texto}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Inicio;
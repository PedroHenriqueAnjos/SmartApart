import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './login';
import PrimeiroCadastro from './PrimeiroCadastro';
import Dashboard from './DashBoard';
import { verificarSindicoExiste } from './api';
import Acessibilidade from './Acessibilidade';

function AppConteudo() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [sindicoExiste, setSindicoExiste] = useState(null); // null = ainda carregando
    const [erroVerificacao, setErroVerificacao] = useState('');

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            setUsuarioLogado(JSON.parse(usuarioSalvo));
        } else {
            checarSindico();
        }
    }, []);

    const checarSindico = async () => {
        try {
            const existe = await verificarSindicoExiste();
            setSindicoExiste(existe);
        } catch {
            setErroVerificacao('Erro ao conectar com o servidor. Tente novamente.');
        }
    };

    const handleLogin = (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setUsuarioLogado(usuario);
    };

    const handleCadastroSindico = (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setUsuarioLogado(usuario);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        setUsuarioLogado(null);
        checarSindico();
    };

    const handleAtualizarUsuario = (dadosAtualizados) => {
        setUsuarioLogado((atual) => {
            const novo = { ...atual, ...dadosAtualizados };
            localStorage.setItem('usuario', JSON.stringify(novo));
            return novo;
        });
    };

    if (usuarioLogado) {
        return (
            <Dashboard
                usuario={usuarioLogado}
                setUsuarioLogado={handleLogout}
                aoAtualizarUsuario={handleAtualizarUsuario}
            />
        );
    }

    if (erroVerificacao) {
        return <p id="erro" role="alert">{erroVerificacao}</p>;
    }

    if (sindicoExiste === null) {
        return null; 
    }

    return sindicoExiste
        ? <Login setUsuarioLogado={handleLogin} />
        : <PrimeiroCadastro aoCadastrar={handleCadastroSindico} />;
}

// O painel de acessibilidade fica fora do conteúdo para aparecer em todas as telas
function App() {
    return (
        <>
            <AppConteudo />
            <Acessibilidade />
        </>
    );
}

export default App;
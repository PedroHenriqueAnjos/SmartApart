import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './login';
import Dashboard from './DashBoard';

function App() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            setUsuarioLogado(JSON.parse(usuarioSalvo));
        }
    }, []);

    const handleLogin = (usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setUsuarioLogado(usuario);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        setUsuarioLogado(null);
    };

    if (!usuarioLogado) {
        return <Login setUsuarioLogado={handleLogin} />;
    }

    return (
        <Dashboard
            usuario={usuarioLogado}
            setUsuarioLogado={handleLogout}
        />
    );
}

export default App;
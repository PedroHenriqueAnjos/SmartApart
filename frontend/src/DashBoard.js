import React, { useState } from 'react';
import './DashBoard.css';
import Inicio from './Inicio';
import Encomendas from './Encomendas';
import Visitantes from './visitantes';
import Chat from './Chat';
import Perfil from './perfil';
import Enquetes from './Enquetes';
import Salao from './Salao';
import { User, LogOut, Menu, X } from 'lucide-react';

function Dashboard({ usuario, setUsuarioLogado }) {
    const [abaAtiva, setAbaAtiva] = useState('inicio');
    const [menuAberto, setMenuAberto] = useState(false);

    const ehPorteiro = usuario.tipo === 'PORTEIRO';
    const ehSindico = usuario.tipo === 'SINDICO';
    const ehMorador = usuario.tipo === 'MORADOR' || usuario.tipo === 'DONO';

    const renderizarAba = () => {
        switch (abaAtiva) {
            case 'inicio': return <Inicio usuario={usuario} />;
            case 'encomendas': return <Encomendas usuario={usuario} />;
            case 'visitantes': return <Visitantes usuario={usuario} />;
            case 'chat': return <Chat usuario={usuario} />;
            case 'enquetes': return <Enquetes usuario={usuario} />;
            case 'salao': return <Salao usuario={usuario} />;
            case 'perfil': return <Perfil usuario={usuario} />;
            default: return <Inicio usuario={usuario} />;
        }
    };

    const navegarPara = (aba) => {
        setAbaAtiva(aba);
        setMenuAberto(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <nav className="dashboard-nav">

                    <button className="hamburger-botao" onClick={() => setMenuAberto(!menuAberto)}>
                        {menuAberto ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <div className="nav-botoes-desktop">
                        <button className={`nav-botao ${abaAtiva === 'inicio' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('inicio')}>início</button>

                        <button className={`nav-botao ${abaAtiva === 'encomendas' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('encomendas')}>encomendas</button>

                        <button className={`nav-botao ${abaAtiva === 'visitantes' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('visitantes')}>visitantes</button>

                        {!ehPorteiro && (
                            <button className={`nav-botao ${abaAtiva === 'chat' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('chat')}>chat</button>
                        )}

                        {(ehSindico || ehMorador) && (
                            <button className={`nav-botao ${abaAtiva === 'enquetes' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('enquetes')}>enquetes</button>
                        )}

                        {ehMorador && (
                            <button className={`nav-botao ${abaAtiva === 'salao' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('salao')}>salão</button>
                        )}
                    </div>

                    <div className="nav-acoes">
                        <button className={`nav-botao perfil-botao ${abaAtiva === 'perfil' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('perfil')} title="Perfil">
                            <User size={18} />
                        </button>
                        <button className="logout-botao" onClick={() => setUsuarioLogado(null)} title="Sair">
                            <LogOut size={18} />
                        </button>
                    </div>
                </nav>

                {menuAberto && (
                    <div className="menu-mobile">
                        <button className={`menu-mobile-item ${abaAtiva === 'inicio' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('inicio')}>início</button>

                        <button className={`menu-mobile-item ${abaAtiva === 'encomendas' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('encomendas')}>encomendas</button>

                        <button className={`menu-mobile-item ${abaAtiva === 'visitantes' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('visitantes')}>visitantes</button>

                        {!ehPorteiro && (
                            <button className={`menu-mobile-item ${abaAtiva === 'chat' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('chat')}>chat</button>
                        )}

                        {(ehSindico || ehMorador) && (
                            <button className={`menu-mobile-item ${abaAtiva === 'enquetes' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('enquetes')}>enquetes</button>
                        )}

                        {ehMorador && (
                            <button className={`menu-mobile-item ${abaAtiva === 'salao' ? 'ativo' : ''}`}
                                onClick={() => navegarPara('salao')}>salão</button>
                        )}

                        <button className={`menu-mobile-item ${abaAtiva === 'perfil' ? 'ativo' : ''}`}
                            onClick={() => navegarPara('perfil')}>perfil</button>

                        <button className="menu-mobile-item logout"
                            onClick={() => setUsuarioLogado(null)}>sair</button>
                    </div>
                )}
            </header>

            <main className="dashboard-conteudo">
                {renderizarAba()}
            </main>
        </div>
    );
}

export default Dashboard;
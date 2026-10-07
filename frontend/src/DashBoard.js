import React, { useState } from 'react';
import './DashBoard.css';
import Inicio from './Inicio';
import Encomendas from './Encomendas';
import Visitantes from './visitantes';
import Chat from './Chat';
import Perfil from './perfil';
import Enquetes from './Enquetes';
import Salao from './Salao';
import SalaoPorteiro from './SalaoPorteiro';
import EncomendasPorteiro from './EncomendasPorteiro';
import CadastroSindico from './CadastroSindico';

function Dashboard({ usuario, setUsuarioLogado, aoAtualizarUsuario }) {
    const [abaAtiva, setAbaAtiva] = useState('inicio');

    const ehPorteiro = usuario.tipo === 'PORTEIRO';
    const ehSindico = usuario.tipo === 'SINDICO';
    const ehMorador = usuario.tipo === 'MORADOR' || usuario.tipo === 'DONO';

    const navegarPara = (aba) => {
        setAbaAtiva(aba);
    };

    const renderizarAba = () => {
        switch (abaAtiva) {
            case 'inicio': return <Inicio usuario={usuario} aoNavegar={navegarPara} ehPorteiro={ehPorteiro} />;
            case 'encomendas': return <Encomendas usuario={usuario} aoNavegar={navegarPara} />;
            case 'encomendasPorteiro': return <EncomendasPorteiro usuario={usuario} aoNavegar={navegarPara} />;
            case 'visitantes': return <Visitantes usuario={usuario} aoNavegar={navegarPara} />;
            case 'chat': return <Chat usuario={usuario} aoNavegar={navegarPara} />;
            case 'enquetes': return <Enquetes usuario={usuario} aoNavegar={navegarPara} />;
            case 'salao': return <Salao usuario={usuario} aoNavegar={navegarPara} />;
            case 'perfil': return (<Perfil usuario={usuario} aoNavegar={navegarPara} aoSair={() => setUsuarioLogado(null)} aoAtualizarUsuario={aoAtualizarUsuario}/>);
            case 'salaoPorteiro': return <SalaoPorteiro usuario={usuario} aoNavegar={navegarPara} />;
            case 'cadastroSindico': return <CadastroSindico usuario={usuario} aoNavegar={navegarPara} />;
            default: return <Inicio usuario={usuario} aoNavegar={navegarPara} ehPorteiro={ehPorteiro} />;
        }
    };

    return (
        <div className="dashboard">
            <main className="dashboard-conteudo dashboard-conteudo-inicio">
                {renderizarAba()}
            </main>
        </div>
    );
}

export default Dashboard;
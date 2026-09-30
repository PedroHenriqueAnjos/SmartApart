import React, { useState } from 'react';
import './PrimeiroCadastro.css';
import { cadastrarSindico } from './api';

function PrimeiroCadastro({ aoCadastrar }) {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const formatarCPF = (valor) => {
        const numeros = valor.replace(/\D/g, '').slice(0, 11);
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const handleCPF = (e) => {
        setCpf(formatarCPF(e.target.value));
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setErro('');

        if (!nome.trim()) {
            setErro('Informe o nome completo');
            return;
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            setErro('CPF inválido');
            return;
        }
        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
            return;
        }

        setCarregando(true);
        try {
            const cpfLimpo = cpf.replace(/\D/g, '');
            const sindico = await cadastrarSindico(nome.trim(), cpfLimpo, senha);

            aoCadastrar({
                id: sindico.idSindico,
                nome: sindico.nome,
                tipo: 'SINDICO'
            });
        } catch (err) {
            setErro(err.message || 'Erro ao cadastrar síndico');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <main className='Green_Box_Full' id="Login_Box">

                <div id="Login_Logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Logo SmartApart" />
                </div>

                <div id="Cadastro_Divisor"></div>

                <section id="Cadastro_Conteudo">
                    <h1 id="Cadastro_Titulo">CADASTRO</h1>
                    <p>Nenhum síndico cadastrado ainda. Cadastre o primeiro síndico para começar.</p>

                    <form onSubmit={handleCadastro} id="Cadastro_Form">
                        <label htmlFor="nome">NOME COMPLETO</label>
                        <input className='Gold_Input'
                            id="nome"
                            name="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={carregando}
                            placeholder='Seu nome completo'
                        />

                        <label htmlFor="CPF">CPF</label>
                        <input className='Gold_Input'
                            id="CPF"
                            name="CPF"
                            type="text"
                            value={cpf}
                            onChange={handleCPF}
                            disabled={carregando}
                            placeholder='000.000.000-00'
                            maxLength={14}
                        />

                        <label htmlFor="senha">SENHA</label>
                        <input className='Gold_Input'
                            id="senha"
                            name='senha'
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={carregando}
                            placeholder='sua senha aqui...'
                        />

                        <label htmlFor="confirmarSenha">CONFIRMAR SENHA</label>
                        <input className='Gold_Input'
                            id="confirmarSenha"
                            name='confirmarSenha'
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            disabled={carregando}
                            placeholder='confirme sua senha'
                        />

                        <div id="button_container">
                            <button type="submit" disabled={carregando} className='Green_Button_Full' id="Botao_Login">
                                {carregando ? 'CADASTRANDO...' : 'CADASTRAR'}
                            </button>
                        </div>
                    </form>

                    {erro && <p id='erro'>{erro}</p>}
                </section>

            </main>
        </>
    );
}

export default PrimeiroCadastro;
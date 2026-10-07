import React, { useState } from 'react';
import "./login.css"
import { loginAPI } from './api';


function Login({ setUsuarioLogado }) {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setCarregando(true);
        setErro('');

        try {
            const cpfLimpo = cpf.replace(/\D/g, '');
            const resposta = await loginAPI(cpfLimpo, senha);

            if (resposta && resposta.id) {
                setUsuarioLogado({
                    id: resposta.id,
                    nome: resposta.nome,
                    tipo: resposta.tipo
                });
            } else {
                setErro('CPF ou senha incorretos');
            }
        } catch (err) {
            setErro('Erro ao conectar.');
        }

        setCarregando(false);
    };

    return (
        <>
        <main className='Green_Box_Full' id="Login_Box">

            <div id="Login_Logo">
                <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="Logo SmartApart" />
            </div>

            <div id="Login_Divisor"></div>

            <section id="Login_Conteudo">
                <h1 id="Login_Titulo">LOGIN</h1>
                <p>não possui cadastro? <strong>fale com o admin</strong></p>

                <form onSubmit={handleLogin} id="Login_Form">
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

                    <div id="button_container">
                        <a href="#esqueceu-senha" onClick={(e) => e.preventDefault()}>esqueceu a senha?</a>
                        <button type="submit" disabled={carregando} className='Green_Button_Empty' id="Botao_Login">
                            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
                        </button>
                    </div>
                </form>

                {erro && <p id='erro' role="alert">{erro}</p>}
            </section>

        </main>
        </>
    );
}

export default Login;
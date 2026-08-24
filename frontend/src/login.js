import React, { useState } from 'react';
import { loginAPI } from './api';
import './login.css';
import LockIcon from './LockIcon';
import { Eye, EyeOff } from 'lucide-react';

function Login({ setUsuarioLogado }) {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

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
        <div className="login-container">
            <div className="login-card">
                <div className="login-icone">
                    <LockIcon />
                </div>

                <div className="login-form-container">
                    <h1 className="login-titulo">LOGIN</h1>
                    <p className="login-subtitulo">não possui cadastro? fale com o administrador</p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>CPF</label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={handleCPF}
                                disabled={carregando}
                                maxLength={14}
                            />
                        </div>

                        <div className="form-group">
                            <label>SENHA</label>
                            <div className="senha-wrapper">
                                <input
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="sua senha aqui..."
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    disabled={carregando}
                                />
                                <button
                                    type="button"
                                    className="senha-olho"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    tabIndex={-1}
                                >
                                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {erro && <p className="login-erro">{erro}</p>}

                        <div className="login-footer">
                            <a href="#" className="login-esqueceu">esqueceu sua senha? fale com o administrador</a>
                            <button type="submit" className="login-botao" disabled={carregando}>
                                {carregando ? 'ENTRANDO...' : 'FINALIZAR'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
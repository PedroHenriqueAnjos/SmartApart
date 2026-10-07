import React, { useState } from 'react';
import './AlterarSenha.css';
import { redefinirSenha } from './api';
import { ArrowLeft, Check } from 'lucide-react';

const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// usuario presente -> usuário logado (o CPF precisa ser o da própria conta)
// usuario ausente  -> "esqueci a senha" na tela de login
function AlterarSenha({ usuario, aoVoltar }) {
    const logado = !!usuario;

    const [cpf, setCpf] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [concluido, setConcluido] = useState(false);

    const handleSalvar = async (e) => {
        e.preventDefault();
        setErro('');

        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length !== 11) { setErro('CPF inválido'); return; }
        if (novaSenha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres'); return; }
        if (novaSenha !== confirmar) { setErro('As senhas não coincidem'); return; }

        setCarregando(true);
        try {
            await redefinirSenha(logado
                ? { id: usuario.id, tipo: usuario.tipo, cpf: cpfLimpo, novaSenha }
                : { cpf: cpfLimpo, novaSenha });
            setConcluido(true);
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div id="AlterarSenha_Pagina">

            <button id="AlterarSenha_Voltar" onClick={aoVoltar}
                title="Voltar" aria-label="Voltar">
                <ArrowLeft size={44} strokeWidth={1.5} />
            </button>

            <h1 id="AlterarSenha_Titulo">{logado ? 'ALTERAR SENHA' : 'RECUPERAR SENHA'}</h1>

            <div id="AlterarSenha_Card" className="Green_Box_Full">
                {concluido ? (
                    <div className="as-form">
                        <p className="mensagem-sucesso" role="status">Senha alterada com sucesso!</p>
                        <p className="as-texto">
                            {logado
                                ? 'Use a nova senha no próximo acesso.'
                                : 'Agora você já pode entrar com a nova senha.'}
                        </p>
                        <div className="as-botoes">
                            <button type="button" className="Green_Button_Empty" onClick={aoVoltar}>
                                {logado ? 'VOLTAR AO PERFIL' : 'IR PARA O LOGIN'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="as-form" onSubmit={handleSalvar}>
                        <p className="as-texto">
                            {logado
                                ? 'Confirme seu CPF e escolha a nova senha.'
                                : 'Informe seu CPF e escolha a nova senha.'}
                        </p>

                        {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

                        <div className="as-campo">
                            <label htmlFor="AlterarSenha_CPF">CPF</label>
                            <input id="AlterarSenha_CPF" className="Gold_Input" type="text"
                                inputMode="numeric" placeholder="000.000.000-00" maxLength={14}
                                value={cpf} onChange={(e) => setCpf(formatarCPF(e.target.value))}
                                disabled={carregando} />
                        </div>

                        <div className="as-campo">
                            <label htmlFor="AlterarSenha_Nova">Nova senha</label>
                            <input id="AlterarSenha_Nova" className="Gold_Input" type="password"
                                autoComplete="new-password" placeholder="mínimo de 6 caracteres"
                                value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)}
                                disabled={carregando} />
                        </div>

                        <div className="as-campo">
                            <label htmlFor="AlterarSenha_Confirmar">Confirmar nova senha</label>
                            <input id="AlterarSenha_Confirmar" className="Gold_Input" type="password"
                                autoComplete="new-password"
                                value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
                                disabled={carregando} />
                        </div>

                        <div className="as-botoes">
                            <button type="submit" className="Green_Button_Empty" disabled={carregando}>
                                <Check size={18} /> {carregando ? 'SALVANDO...' : 'SALVAR SENHA'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AlterarSenha;

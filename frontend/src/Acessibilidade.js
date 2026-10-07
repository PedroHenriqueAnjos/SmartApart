import React, { useState, useEffect, useRef } from 'react';
import './Acessibilidade.css';
import { Accessibility, Contrast, Volume2, Square, ZoomIn, ZoomOut, Hand, Pause, RotateCcw, X } from 'lucide-react';

const CHAVE = 'acessibilidade';
const ESCALAS = [1, 1.15, 1.3, 1.5];
const URL_VLIBRAS = 'https://vlibras.gov.br/app';

// ---------- Preferências (salvas no localStorage) ----------
const consulta = (q) => !!(window.matchMedia && window.matchMedia(q).matches);

const padrao = () => ({
    contraste: consulta('(prefers-contrast: more)'),
    escala: 0,
    semAnimacao: consulta('(prefers-reduced-motion: reduce)')
});

const lerPreferencias = () => {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE));
        if (salvo) return { ...padrao(), ...salvo };
    } catch {
        // localStorage indisponível ou JSON inválido: usa o padrão
    }
    return padrao();
};

// ---------- VLibras (script oficial do governo federal) ----------
let vlibrasIniciado = false;

const carregarVLibras = () => {
    if (vlibrasIniciado) return;
    vlibrasIniciado = true;
    const script = document.createElement('script');
    script.src = `${URL_VLIBRAS}/vlibras-plugin.js`;
    script.async = true;
    script.onload = () => {
        if (window.VLibras) new window.VLibras.Widget(URL_VLIBRAS);
    };
    script.onerror = () => { vlibrasIniciado = false; };
    document.body.appendChild(script);
};

// ---------- Leitura em voz alta ----------
// O Chrome corta falas muito longas, então o texto é quebrado em pedaços curtos
const quebrarTexto = (texto) => {
    const frases = texto.replace(/\s*\n+\s*/g, '. ').replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [];
    const pedacos = [];
    frases.forEach((frase) => {
        const limpa = frase.trim();
        if (!limpa || /^[.!?]+$/.test(limpa)) return;
        if (limpa.length <= 200) {
            pedacos.push(limpa);
        } else {
            pedacos.push(...(limpa.match(/.{1,200}(\s|$)/g) || [limpa]).map((p) => p.trim()));
        }
    });
    return pedacos;
};

// ---------- Janelas (formulários com role="dialog" aria-modal="true") ----------
// Ao abrir: dá nome à janela e leva o foco para dentro. Tab fica preso nela,
// Esc aciona o botão CANCELAR e, ao fechar, o foco volta para onde estava.
const SELETOR_JANELA = '[role="dialog"][aria-modal="true"]';
const SELETOR_FOCAVEL = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useJanelasModais() {
    useEffect(() => {
        let atual = null;
        let anterior = null;

        const verificar = () => {
            const janela = document.querySelector(SELETOR_JANELA);
            if (janela === atual) return;

            if (!janela && anterior && document.contains(anterior)) anterior.focus();
            if (janela && !atual) anterior = document.activeElement;
            atual = janela;
            if (!janela) return;

            const titulo = janela.querySelector('h2');
            if (titulo && titulo.id && !janela.getAttribute('aria-labelledby')) {
                janela.setAttribute('aria-labelledby', titulo.id);
            }
            const primeiro = janela.querySelector(SELETOR_FOCAVEL);
            if (primeiro) primeiro.focus();
        };

        const aoTeclar = (e) => {
            if (!atual) return;

            if (e.key === 'Escape') {
                const cancelar = Array.from(atual.querySelectorAll('button[type="button"]'))
                    .find((b) => /cancelar/i.test(b.textContent));
                if (cancelar) {
                    e.preventDefault();
                    cancelar.click();
                }
                return;
            }

            // Só prende o Tab quando o foco está dentro da janela
            // (o painel de acessibilidade continua alcançável)
            if (e.key !== 'Tab' || !atual.contains(document.activeElement)) return;
            const itens = Array.from(atual.querySelectorAll(SELETOR_FOCAVEL))
                .filter((el) => el.offsetParent !== null);
            if (itens.length === 0) return;
            const primeiro = itens[0];
            const ultimo = itens[itens.length - 1];
            if (e.shiftKey && document.activeElement === primeiro) {
                e.preventDefault();
                ultimo.focus();
            } else if (!e.shiftKey && document.activeElement === ultimo) {
                e.preventDefault();
                primeiro.focus();
            }
        };

        const observador = new MutationObserver(verificar);
        observador.observe(document.body, { childList: true, subtree: true });
        document.addEventListener('keydown', aoTeclar);
        verificar();

        return () => {
            observador.disconnect();
            document.removeEventListener('keydown', aoTeclar);
        };
    }, []);
}

function Acessibilidade() {
    useJanelasModais();
    const [prefs, setPrefs] = useState(lerPreferencias);
    const [aberto, setAberto] = useState(false);
    const [lendo, setLendo] = useState(false);
    const botaoRef = useRef(null);
    const leituraId = useRef(0);
    const temVoz = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Aplica as preferências na página inteira e salva
    useEffect(() => {
        const raiz = document.documentElement;
        raiz.lang = 'pt-BR';
        raiz.dataset.contraste = prefs.contraste ? 'alto' : 'normal';
        raiz.dataset.semAnimacao = prefs.semAnimacao ? 'sim' : 'nao';
        raiz.style.setProperty('--escala-fonte', ESCALAS[prefs.escala]);
        try {
            localStorage.setItem(CHAVE, JSON.stringify(prefs));
        } catch {
            // sem localStorage: a preferência vale só nesta sessão
        }
    }, [prefs]);

    useEffect(() => {
        carregarVLibras();
        return () => { if (temVoz) window.speechSynthesis.cancel(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Esc fecha o painel e devolve o foco ao botão
    useEffect(() => {
        if (!aberto) return undefined;
        const aoTeclar = (e) => {
            if (e.key === 'Escape') {
                setAberto(false);
                if (botaoRef.current) botaoRef.current.focus();
            }
        };
        document.addEventListener('keydown', aoTeclar);
        return () => document.removeEventListener('keydown', aoTeclar);
    }, [aberto]);

    // Navegar para outra tela (clique fora do painel) interrompe a leitura
    useEffect(() => {
        if (!lendo) return undefined;
        const aoClicar = (e) => {
            if (!e.target.closest('#Acessibilidade_Raiz')) parar();
        };
        document.addEventListener('click', aoClicar);
        return () => document.removeEventListener('click', aoClicar);
    }, [lendo]);

    const alterar = (campo, valor) => setPrefs((atual) => ({ ...atual, [campo]: valor }));

    const mudarEscala = (passo) =>
        setPrefs((atual) => ({
            ...atual,
            escala: Math.max(0, Math.min(ESCALAS.length - 1, atual.escala + passo))
        }));

    const restaurar = () => {
        parar();
        setPrefs({ contraste: false, escala: 0, semAnimacao: false });
    };

    const parar = () => {
        leituraId.current += 1;
        if (temVoz) window.speechSynthesis.cancel();
        setLendo(false);
    };

    const lerTela = () => {
        if (!temVoz) return;
        const sintese = window.speechSynthesis;
        sintese.cancel();

        // Se houver uma janela aberta (formulário), lê só ela; senão lê a tela toda
        const alvo = document.querySelector('[role="dialog"][aria-modal="true"]')
            || document.querySelector('main')
            || document.body;
        const pedacos = quebrarTexto(alvo.innerText || '');
        if (pedacos.length === 0) return;

        const id = ++leituraId.current;
        const vozes = sintese.getVoices();
        const voz = vozes.find((v) => (v.lang || '').toLowerCase() === 'pt-br')
            || vozes.find((v) => (v.lang || '').toLowerCase().startsWith('pt'));

        pedacos.forEach((pedaco, i) => {
            const fala = new SpeechSynthesisUtterance(pedaco);
            fala.lang = 'pt-BR';
            if (voz) fala.voice = voz;
            fala.onend = () => {
                if (id === leituraId.current && i === pedacos.length - 1) setLendo(false);
            };
            fala.onerror = () => {
                if (id === leituraId.current) setLendo(false);
            };
            sintese.speak(fala);
        });
        setLendo(true);
    };

    const abrirLibras = () => {
        const botaoVLibras = document.querySelector('[vw-access-button]');
        if (botaoVLibras) botaoVLibras.click();
    };

    return (
        <>
            <div id="Acessibilidade_Raiz">
                <button
                    id="Acessibilidade_Botao"
                    ref={botaoRef}
                    className="Green_Button_Full"
                    onClick={() => setAberto(!aberto)}
                    aria-expanded={aberto}
                    aria-controls="Acessibilidade_Painel"
                    aria-label="Opções de acessibilidade"
                    title="Acessibilidade"
                >
                    <Accessibility size={30} />
                </button>

                {aberto && (
                    <section id="Acessibilidade_Painel" className="Empty_Box"
                        role="dialog" aria-label="Opções de acessibilidade">
                        <div id="Acessibilidade_Cabecalho">
                            <h2 id="Acessibilidade_Titulo">ACESSIBILIDADE</h2>
                            <button id="Acessibilidade_Fechar" className="Green_Button_Empty"
                                onClick={() => { setAberto(false); botaoRef.current.focus(); }}
                                aria-label="Fechar opções de acessibilidade" title="Fechar">
                                <X size={18} />
                            </button>
                        </div>

                        <button className="acess-opcao Green_Button_Empty"
                            aria-pressed={prefs.contraste}
                            onClick={() => alterar('contraste', !prefs.contraste)}>
                            <Contrast size={20} /> Alto contraste
                        </button>

                        <div id="Acessibilidade_Tamanho" role="group" aria-label="Tamanho do texto">
                            <button className="acess-mini Green_Button_Empty"
                                onClick={() => mudarEscala(-1)} disabled={prefs.escala === 0}
                                aria-label="Diminuir texto" title="Diminuir texto">
                                <ZoomOut size={20} />
                            </button>
                            <span id="Acessibilidade_Escala" aria-live="polite">
                                Texto {Math.round(ESCALAS[prefs.escala] * 100)}%
                            </span>
                            <button className="acess-mini Green_Button_Empty"
                                onClick={() => mudarEscala(1)} disabled={prefs.escala === ESCALAS.length - 1}
                                aria-label="Aumentar texto" title="Aumentar texto">
                                <ZoomIn size={20} />
                            </button>
                        </div>

                        <button className="acess-opcao Green_Button_Empty"
                            aria-pressed={prefs.semAnimacao}
                            onClick={() => alterar('semAnimacao', !prefs.semAnimacao)}>
                            <Pause size={20} /> Pausar animações
                        </button>

                        {temVoz && (
                            <button className="acess-opcao Green_Button_Empty"
                                aria-pressed={lendo}
                                onClick={lendo ? parar : lerTela}>
                                {lendo
                                    ? <><Square size={20} /> Parar leitura</>
                                    : <><Volume2 size={20} /> Ler esta tela</>}
                            </button>
                        )}

                        <button className="acess-opcao Green_Button_Empty" onClick={abrirLibras}>
                            <Hand size={20} /> Tradutor de Libras
                        </button>

                        <button className="acess-opcao Gold_Button_Empty" onClick={restaurar}>
                            <RotateCcw size={20} /> Restaurar padrão
                        </button>
                    </section>
                )}
            </div>

            {/* Estrutura exigida pelo plugin oficial VLibras */}
            <div vw="true" className="enabled">
                <div vw-access-button="true" className="active"></div>
                <div vw-plugin-wrapper="true">
                    <div className="vw-plugin-top-wrapper"></div>
                </div>
            </div>
        </>
    );
}

export default Acessibilidade;

const API_URL = "https://smartapart-bra7.onrender.com";

export const loginAPI = async (cpf, senha) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha })
    });
    return response.json();
};




export const getAvisosRecentes = async () => {
    const response = await fetch(`${API_URL}/avisos/recentes`);
    return response.json();
};

export const getTodosAvisos = async () => {
    const response = await fetch(`${API_URL}/avisos`);
    return response.json();
};

export const getEncomentdasInquilino = async (idInquilino) => {
    const response = await fetch(`${API_URL}/encomendas/inquilino/${idInquilino}`);
    return response.json();
};

export const marcarEncomendaRetirada = async (idEncomenda) => {
    const response = await fetch(`${API_URL}/encomendas/${idEncomenda}/retirar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });
    return response.json();
};

export const getMessagens = async () => {
    const response = await fetch(`${API_URL}/chat`);
    return response.json();
};

export const enviarMensagem = async (nomeRemetente, tipoRemetente, texto) => {
    const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeRemetente,
            tipoRemetente,
            texto
        })
    });
    return response.json();
};

export const getVisitantesInquilino = async (idInquilino) => {
    const response = await fetch(`${API_URL}/visitantes/inquilino/${idInquilino}`);
    return response.json();
};

export const solicitarVisitante = async (nome, cpf, idInquilino) => {
    const response = await fetch(`${API_URL}/visitantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome,
            cpf,
            idInquilino,
            status: "Pendente"
        })
    });
    return response.json();
};

export const cancelarVisitante = async (idVisitante) => {
    const response = await fetch(`${API_URL}/visitantes/${idVisitante}`, {
        method: "DELETE"
    });
    return response.json();
};

export const getReservasInquilino = async (idInquilino) => {
    const response = await fetch(`${API_URL}/reservas/inquilino/${idInquilino}`);
    return response.json();
};

export const solicitarReserva = async (idInquilino, idSalao, dataPrevista) => {
    const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idInquilino,
            idSalao,
            dataPrevista
        })
    });
    return response.json();
};

export const cancelarReserva = async (idReserva) => {
    const response = await fetch(`${API_URL}/reservas/${idReserva}/cancelar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });
    return response.json();
};

export const atualizarPerfilInquilino = async (idInquilino, novoNome) => {
    const response = await fetch(`${API_URL}/perfil/inquilino/${idInquilino}?nome=${novoNome}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    });
    return response.json();
};

// ---------- Cadastro de usuários ----------
export const cadastrarInquilino = async (dados) => {
    const res = await fetch(`${API_URL}/inquilinos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar inquilino');
    return res.json();
};

export const cadastrarDono = async (dados) => {
    const res = await fetch(`${API_URL}/donos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar dono');
    return res.json();
};

// SUPOSIÇÃO NÃO CONFIRMADA: endpoint /porteiros, campos nome/cpf/senha
export const cadastrarPorteiro = async (dados) => {
    const res = await fetch(`${API_URL}/funcionarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar porteiro');
    return res.json();
};

export const listarDonos = async () => {
    const res = await fetch(`${API_URL}/donos`);
    if (!res.ok) throw new Error('Erro ao carregar donos');
    return res.json();
};

export const listarInquilinos = async () => {
    const res = await fetch(`${API_URL}/inquilinos`);
    if (!res.ok) throw new Error('Erro ao carregar inquilinos');
    return res.json();
};

// ---------- Cadastro de bloco ----------
export const cadastrarBloco = async (dados) => {
    const res = await fetch(`${API_URL}/blocos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar bloco');
    return res.json();
};

export const listarBlocos = async () => {
    const res = await fetch(`${API_URL}/blocos`);
    if (!res.ok) throw new Error('Erro ao carregar blocos');
    return res.json();
};

// ---------- Cadastro de apartamento ----------
export const cadastrarApartamento = async (dados) => {
    const res = await fetch(`${API_URL}/apartamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar apartamento');
    return res.json();
};

// ---------- Cadastro de salão ----------
export const cadastrarSalao = async (dados) => {
    const res = await fetch(`${API_URL}/salaos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!res.ok) throw new Error('Erro ao cadastrar salão');
    return res.json();
};

export const verificarSindicoExiste = async () => {
    const res = await fetch(`${API_URL}/sindicos`);
    if (!res.ok) throw new Error('Erro ao verificar síndico');
    const lista = await res.json();
    return Array.isArray(lista) && lista.length > 0;
};

export const cadastrarSindico = async (nome, cpf, senha) => {
    const res = await fetch(`${API_URL}/sindicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, senha })
    });
    if (!res.ok) {
        const erro = await res.json().catch(() => ({}));
        throw new Error(erro.erro || 'Erro ao cadastrar síndico');
    }
    return res.json();
};

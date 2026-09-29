const API_URL = "http://localhost:8080";

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
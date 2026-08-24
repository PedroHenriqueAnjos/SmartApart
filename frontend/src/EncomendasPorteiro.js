import React, { useState, useEffect } from 'react';
import './Encomendas.css';
import { Package, X, Plus, User, Home, MapPin, Check } from 'lucide-react';

const API_URL = "http://localhost:8080";

function EncomendasPorteiro({ usuario }) {
    const [encomendas, setEncomendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formData, setFormData] = useState({ idApartamento: '', idInquilino: '', idDono: '' });

    useEffect(() => {
        carregarEncomendas();
    }, []);

    const carregarEncomendas = async () => {
        try {
            setCarregando(true);
            const response = await fetch(`${API_URL}/encomendas`);
            const dados = await response.json();
            setEncomendas(dados);
        } catch (err) {
            setErro('Erro ao carregar encomendas');
        } finally {
            setCarregando(false);
        }
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/encomendas?nomePorteiro=${usuario.nome}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idApartamento: parseInt(formData.idApartamento),
                    idInquilino: formData.idInquilino ? parseInt(formData.idInquilino) : null,
                    idDono: formData.idDono ? parseInt(formData.idDono) : null
                })
            });
            setFormData({ idApartamento: '', idInquilino: '', idDono: '' });
            setMostrarFormulario(false);
            carregarEncomendas();
            setErro('');
        } catch (err) {
            setErro('Erro ao registrar encomenda');
        }
    };

    const handleAtualizarStatus = async (idEncomenda, status) => {
        try {
            await fetch(`${API_URL}/encomendas/${idEncomenda}/status?status=${status}&nomePorteiro=${usuario.nome}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            carregarEncomendas();
        } catch (err) {
            setErro('Erro ao atualizar status');
        }
    };

    const getStatusCor = (status) => {
        if (status === 'Recebida') return '#5BA989';
        if (status === 'Retirada') return '#899A3D';
        return '#D4A760';
    };

    const formatarData = (data) => {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    };

    return (
        <div className="encomendas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 className="encomendas-titulo" style={{ margin: 0, border: 'none', padding: 0 }}>
                    <Package size={22} /> Encomendas
                </h2>
                <button className="encomenda-botao" style={{ width: 'auto', padding: '10px 25px' }}
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                    {mostrarFormulario ? <><X size={14} /> Cancelar</> : <><Plus size={14} /> Registrar Encomenda</>}
                </button>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            {mostrarFormulario && (
                <form onSubmit={handleRegistrar} style={{ background: 'white', border: '2px solid var(--cor-verde-claro)', borderRadius: '15px', padding: '25px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'flex-end' }}>
                    <div className="form-group">
                        <label>ID Apartamento</label>
                        <input type="number" placeholder="Ex: 101" value={formData.idApartamento}
                            onChange={(e) => setFormData({ ...formData, idApartamento: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>ID Inquilino (opcional)</label>
                        <input type="number" placeholder="Ex: 1" value={formData.idInquilino}
                            onChange={(e) => setFormData({ ...formData, idInquilino: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>ID Dono (opcional)</label>
                        <input type="number" placeholder="Ex: 1" value={formData.idDono}
                            onChange={(e) => setFormData({ ...formData, idDono: e.target.value })} />
                    </div>
                    <button type="submit" className="encomenda-botao" style={{ width: 'auto', padding: '12px 25px' }}>
                        <Check size={14} /> Registrar
                    </button>
                </form>
            )}

            {carregando && <p className="mensagem-info">Carregando encomendas...</p>}
            {!carregando && encomendas.length === 0 && <p className="mensagem-info">Nenhuma encomenda registrada</p>}

            <div className="encomendas-lista">
                {encomendas.map((encomenda) => (
                    <div key={encomenda.idEncomenda} className="encomenda-card">
                        <div className="encomenda-header">
                            <div className="encomenda-info">
                                <h4 className="encomenda-numero">Encomenda #{encomenda.idEncomenda}</h4>
                                <p className="encomenda-data">{formatarData(encomenda.dataRecebimento)}</p>
                            </div>
                            <span className="encomenda-status" style={{ backgroundColor: getStatusCor(encomenda.status) }}>
                                {encomenda.status}
                            </span>
                        </div>
                        <div className="encomenda-detalhes">
                            <p><MapPin size={12} /> Apartamento: <strong>{encomenda.idApartamento}</strong></p>
                            {encomenda.idInquilino && <p><User size={12} /> Inquilino ID: <strong>{encomenda.idInquilino}</strong></p>}
                            {encomenda.idDono && <p><Home size={12} /> Dono ID: <strong>{encomenda.idDono}</strong></p>}
                        </div>
                        {encomenda.status !== 'Retirada' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="encomenda-botao"
                                    onClick={() => handleAtualizarStatus(encomenda.idEncomenda, 'Retirada')}>
                                    <Check size={14} /> Marcar como Retirada
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EncomendasPorteiro;
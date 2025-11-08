'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function PerfilPacientePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        nome: 'Maria Santos',
        cpf: '111.222.333-44',
        dataNascimento: '1990-08-20',
        telefone: '(11) 97777-7777',
        email: 'paciente@hospital.com',
        endereco: 'Rua Paciente, 789 - São Paulo, SP'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!session || session.user?.role !== 'paciente') {
            router.push('/login');
        }
    }, [session, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            setError('Erro ao atualizar dados. Tente novamente.');
        }
    };

    if (!session || session.user?.role !== 'paciente') {
        return null;
    }

    return (
        <div className="container-fluid py-4" data-cy="perfil-paciente-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Meus Dados / Perfil</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Gerencie suas informações pessoais</p>
                </div>
                <Link href="/dashboard/paciente" className="btn btn-outline-secondary" data-cy="btn-voltar-dashboard">
                    Voltar para Dashboard
                </Link>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow" data-cy="form-perfil-paciente">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="form-title">Dados Pessoais</h5>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" data-cy="erro-perfil">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success" data-cy="mensagem-sucesso">
                                    Dados atualizados com sucesso!
                                </div>
                            )}

                            <form onSubmit={handleSubmit} data-cy="editar-perfil-form">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-nome">Nome Completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nome"
                                            value={formData.nome}
                                            data-cy="input-nome"
                                            readOnly
                                            disabled
                                        />
                                        <small className="text-muted" data-cy="info-nome-bloqueado">
                                            Para alterar o nome, é necessário enviar comprovativo (ex: certidão de casamento)
                                        </small>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-cpf">CPF</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="cpf"
                                            value={formData.cpf}
                                            data-cy="input-cpf"
                                            readOnly
                                            disabled
                                        />
                                        <small className="text-muted" data-cy="info-cpf-bloqueado">
                                            CPF não pode ser alterado
                                        </small>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-data-nascimento">Data de Nascimento</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dataNascimento"
                                            value={formData.dataNascimento}
                                            data-cy="input-data-nascimento"
                                            readOnly
                                            disabled
                                        />
                                        <small className="text-muted" data-cy="info-data-bloqueado">
                                            Data de nascimento não pode ser alterada
                                        </small>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-telefone">Telefone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            data-cy="input-telefone"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-email">E-mail *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            data-cy="input-email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-endereco">Endereço *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleChange}
                                        data-cy="input-endereco"
                                        required
                                    />
                                </div>

                                <div className="d-flex gap-2 justify-content-end">
                                    <Link href="/dashboard/paciente" className="btn btn-secondary" data-cy="btn-cancelar-perfil">
                                        Cancelar
                                    </Link>
                                    <button type="submit" className="btn btn-primary" data-cy="btn-salvar-alteracoes-perfil">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

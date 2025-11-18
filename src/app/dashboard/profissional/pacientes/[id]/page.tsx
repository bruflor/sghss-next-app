'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface PageProps {
    params: {
        id: string;
    };
}

export default function EditarPacientePage({ params }: PageProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    //Mock da requisição que retornaria o paciente de acordo com o id pesquisado
    const pacienteData = {
        id: params.id,
        nome: 'Carlos Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1985-03-15',
        genero: 'M',
        telefone: '(11) 99999-8888',
        email: 'carlos.silva@email.com',
        endereco: 'Rua das Flores, 123 - Jardim América, São Paulo - SP',
        tipoSanguineo: 'O+',
        alergias: 'Penicilina, Dipirona',
        contatoEmergencia: 'Maria Silva (esposa) - (11) 98888-7777',
        convenio: 'Unimed',
        numeroCarteira: '123456789',
        observacoes: 'Paciente com histórico de hipertensão controlada.',
        status: 'Ativo'
    };

    useEffect(() => {
        if (!session || session.user?.role !== 'profissional') {
            router.push('/login');
        }
    }, [session, router]);

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

    if (!session || session.user?.role !== 'profissional') {
        return null;
    }

    return (
        <div className="container-fluid py-4" data-cy="editar-paciente-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Editar Paciente</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Editando: {pacienteData.nome}
                    </p>
                </div>
                <div>
                    <Link href="/dashboard/profissional/pacientes" className="btn btn-outline-secondary me-2" data-cy="btn-voltar-lista">
                        Voltar para Lista
                    </Link>
                    <button className="btn btn-outline-danger" data-cy="btn-inativar-paciente">
                        Inativar Paciente
                    </button>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow" data-cy="form-editar-paciente">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="form-title">Dados do Paciente - ID: {pacienteData.id ??1}</h5>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" data-cy="erro-edicao">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success" data-cy="mensagem-sucesso">
                                    Dados do paciente {pacienteData.nome} atualizados com sucesso.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} data-cy="editar-paciente-form">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-nome">Nome Completo *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={pacienteData.nome}
                                            data-cy="input-nome"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-cpf">CPF *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={pacienteData.cpf}
                                            data-cy="input-cpf"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label" data-cy="label-data-nascimento">Data de Nascimento *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            defaultValue={pacienteData.dataNascimento}
                                            data-cy="input-data-nascimento"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" data-cy="label-genero">Gênero *</label>
                                        <select className="form-select" data-cy="select-genero" required>
                                            <option value="M" selected={pacienteData.genero === 'M'} data-cy="option-masculino">Masculino</option>
                                            <option value="F" selected={pacienteData.genero === 'F'} data-cy="option-feminino">Feminino</option>
                                            <option value="O" selected={pacienteData.genero === 'O'} data-cy="option-outro">Outro</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label" data-cy="label-status">Status</label>
                                        <select className="form-select" data-cy="select-status">
                                            <option value="ativo" selected={pacienteData.status === 'Ativo'} data-cy="option-ativo">Ativo</option>
                                            <option value="inativo" selected={pacienteData.status === 'Inativo'} data-cy="option-inativo">Inativo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-telefone">Telefone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            defaultValue={pacienteData.telefone}
                                            data-cy="input-telefone"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            defaultValue={pacienteData.email}
                                            data-cy="input-email"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-endereco">Endereço Completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={pacienteData.endereco}
                                        data-cy="input-endereco"
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label" data-cy="label-tipo-sanguineo">Tipo Sanguíneo</label>
                                        <select className="form-select" data-cy="select-tipo-sanguineo">
                                            <option value="">Selecione</option>
                                            <option value="A+" selected={pacienteData.tipoSanguineo === 'A+'} data-cy="option-a-positivo">A+</option>
                                            <option value="A-" selected={pacienteData.tipoSanguineo === 'A-'} data-cy="option-a-negativo">A-</option>
                                            <option value="B+" selected={pacienteData.tipoSanguineo === 'B+'} data-cy="option-b-positivo">B+</option>
                                            <option value="B-" selected={pacienteData.tipoSanguineo === 'B-'} data-cy="option-b-negativo">B-</option>
                                            <option value="AB+" selected={pacienteData.tipoSanguineo === 'AB+'} data-cy="option-ab-positivo">AB+</option>
                                            <option value="AB-" selected={pacienteData.tipoSanguineo === 'AB-'} data-cy="option-ab-negativo">AB-</option>
                                            <option value="O+" selected={pacienteData.tipoSanguineo === 'O+'} data-cy="option-o-positivo">O+</option>
                                            <option value="O-" selected={pacienteData.tipoSanguineo === 'O-'} data-cy="option-o-negativo">O-</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label" data-cy="label-alergias">Alergias Conhecidas</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={pacienteData.alergias}
                                            data-cy="input-alergias"
                                            placeholder="Ex: Penicilina, Dipirona"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-contato-emergencia">Contato de Emergência</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={pacienteData.contatoEmergencia}
                                        data-cy="input-contato-emergencia"
                                        placeholder="Nome e telefone do contato"
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-convenio">Convênio Médico</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={pacienteData.convenio}
                                            data-cy="input-convenio"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-numero-carteira">Nº Carteira</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={pacienteData.numeroCarteira}
                                            data-cy="input-numero-carteira"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" data-cy="label-observacoes">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        defaultValue={pacienteData.observacoes}
                                        data-cy="textarea-observacoes"
                                    ></textarea>
                                </div>

                                <div className="d-flex gap-2 justify-content-end">
                                    <Link href="/dashboard/profissional/pacientes" className="btn btn-secondary" data-cy="btn-cancelar-edicao">
                                        Cancelar
                                    </Link>
                                    <button type="submit" className="btn btn-primary" data-cy="btn-salvar-alteracoes">
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
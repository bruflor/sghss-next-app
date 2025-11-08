import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CadastroPacientePage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    return (
        <div className="container-fluid py-4" data-cy="cadastro-paciente-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Cadastrar Novo Paciente</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Cadastre um novo paciente no sistema</p>
                </div>
                <Link href="/dashboard/profissional/pacientes" className="btn btn-outline-secondary" data-cy="btn-voltar">
                    Voltar para Lista
                </Link>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow" data-cy="form-cadastro-paciente">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0" data-cy="form-title">Dados do Paciente</h5>
                        </div>
                        <div className="card-body">
                            <form data-cy="cadastro-paciente-form">
                                {/* Dados Pessoais */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-nome">Nome Completo *</label>
                                        <input type="text" className="form-control" data-cy="input-nome" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-cpf">CPF *</label>
                                        <input type="text" className="form-control" data-cy="input-cpf" required />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-data-nascimento">Data de Nascimento *</label>
                                        <input type="date" className="form-control" data-cy="input-data-nascimento" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-genero">Gênero *</label>
                                        <select className="form-select" data-cy="select-genero" required>
                                            <option value="">Selecione</option>
                                            <option value="M" data-cy="option-masculino">Masculino</option>
                                            <option value="F" data-cy="option-feminino">Feminino</option>
                                            <option value="O" data-cy="option-outro">Outro</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Contato */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-telefone">Telefone *</label>
                                        <input type="tel" className="form-control" data-cy="input-telefone" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-email">Email</label>
                                        <input type="email" className="form-control" data-cy="input-email" />
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-endereco">Endereço Completo</label>
                                    <input type="text" className="form-control" data-cy="input-endereco" />
                                </div>

                                {/* Dados de Saúde */}
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label" data-cy="label-tipo-sanguineo">Tipo Sanguíneo</label>
                                        <select className="form-select" data-cy="select-tipo-sanguineo">
                                            <option value="">Selecione</option>
                                            <option value="A+" data-cy="option-a-positivo">A+</option>
                                            <option value="A-" data-cy="option-a-negativo">A-</option>
                                            <option value="B+" data-cy="option-b-positivo">B+</option>
                                            <option value="B-" data-cy="option-b-negativo">B-</option>
                                            <option value="AB+" data-cy="option-ab-positivo">AB+</option>
                                            <option value="AB-" data-cy="option-ab-negativo">AB-</option>
                                            <option value="O+" data-cy="option-o-positivo">O+</option>
                                            <option value="O-" data-cy="option-o-negativo">O-</option>
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label" data-cy="label-alergias">Alergias Conhecidas</label>
                                        <input type="text" className="form-control" data-cy="input-alergias" placeholder="Ex: Penicilina, Dipirona" />
                                    </div>
                                </div>

                                {/* Contato de Emergência */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-contato-emergencia">Contato de Emergência</label>
                                    <input type="text" className="form-control" data-cy="input-contato-emergencia" placeholder="Nome e telefone do contato" />
                                </div>

                                {/* Convênio */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-convenio">Convênio Médico</label>
                                        <input type="text" className="form-control" data-cy="input-convenio" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-numero-carteira">Nº Carteira</label>
                                        <input type="text" className="form-control" data-cy="input-numero-carteira" />
                                    </div>
                                </div>

                                {/* Observações */}
                                <div className="mb-4">
                                    <label className="form-label" data-cy="label-observacoes">Observações</label>
                                    <textarea className="form-control" rows={3} data-cy="textarea-observacoes"></textarea>
                                </div>

                                {/* Botões */}
                                <div className="d-flex gap-2 justify-content-end">
                                    <Link href="/dashboard/profissional/pacientes" className="btn btn-secondary" data-cy="btn-cancelar">
                                        Cancelar
                                    </Link>
                                    <button type="submit" className="btn btn-success" data-cy="btn-cadastrar-paciente">
                                        Cadastrar Paciente
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
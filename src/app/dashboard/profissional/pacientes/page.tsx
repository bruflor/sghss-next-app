import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PacientesPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const pacientesData = [
        {
            id: 1,
            nome: 'Carlos Silva',
            cpf: '123.456.789-00',
            dataNascimento: '1985-03-15',
            telefone: '(11) 99999-8888',
            email: 'carlos.silva@email.com',
            tipoSanguineo: 'O+',
            alergias: 'Penicilina',
            status: 'Ativo',
            ultimaConsulta: '2024-01-10',
            internado: false
        },
        {
            id: 2,
            nome: 'Maria Oliveira',
            cpf: '987.654.321-00',
            dataNascimento: '1978-07-22',
            telefone: '(11) 98888-7777',
            email: 'maria.oliveira@email.com',
            tipoSanguineo: 'A+',
            alergias: 'Dipirona, Iodo',
            status: 'Internado',
            ultimaConsulta: '2024-01-08',
            internado: true,
            leito: '201-UTI'
        },
        {
            id: 3,
            nome: 'João Santos',
            cpf: '456.789.123-00',
            dataNascimento: '1992-11-30',
            telefone: '(11) 97777-6666',
            email: 'joao.santos@email.com',
            tipoSanguineo: 'B-',
            alergias: 'Nenhuma',
            status: 'Ativo',
            ultimaConsulta: '2024-01-12',
            internado: false
        },
        {
            id: 4,
            nome: 'Ana Costa',
            cpf: '789.123.456-00',
            dataNascimento: '1988-05-18',
            telefone: '(11) 96666-5555',
            email: 'ana.costa@email.com',
            tipoSanguineo: 'AB+',
            alergias: 'Amoxicilina',
            status: 'Ativo',
            ultimaConsulta: '2024-01-09',
            internado: false
        }
    ];

    const leitosDisponiveis = [
        { id: 101, numero: '101-A', tipo: 'Enfermaria', status: 'Disponível' },
        { id: 102, numero: '102-B', tipo: 'Enfermaria', status: 'Disponível' },
        { id: 103, numero: '103-C', tipo: 'Enfermaria', status: 'Disponível' },
        { id: 201, numero: '201-UTI', tipo: 'UTI', status: 'Ocupado' },
        { id: 202, numero: '202-UTI', tipo: 'UTI', status: 'Disponível' },
        { id: 301, numero: '301-A', tipo: 'Apartamento', status: 'Disponível' }
    ];

    return (
        <div className="container-fluid py-4" data-cy="pacientes-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Gestão de Pacientes</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Gerencie o cadastro e internações dos pacientes</p>
                </div>
                <Link href="/dashboard/profissional/pacientes/novo" className="btn btn-success" data-cy="btn-novo-paciente">
                    Novo Paciente
                </Link>
            </div>

            {/* Barra de Pesquisa e Filtros */}
            <div className="card shadow mb-4" data-cy="filtros-card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label" data-cy="label-pesquisa-nome">Pesquisar por Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome do paciente..."
                                data-cy="input-pesquisa-nome"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" data-cy="label-pesquisa-cpf">Pesquisar por CPF</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o CPF..."
                                data-cy="input-pesquisa-cpf"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" data-cy="label-filtro-status">Filtrar por Status</label>
                            <select className="form-select" data-cy="select-filtro-status">
                                <option value="">Todos os pacientes</option>
                                <option value="ativo" data-cy="option-ativo">Pacientes Ativos</option>
                                <option value="internado" data-cy="option-internado">Pacientes Internados</option>
                                <option value="inativo" data-cy="option-inativo">Pacientes Inativos</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12">
                            <button className="btn btn-primary me-2" data-cy="btn-pesquisar">
                                Pesquisar
                            </button>
                            <button className="btn btn-outline-secondary" data-cy="btn-limpar-filtros">
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Pacientes */}
            <div className="card shadow" data-cy="lista-pacientes-card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" data-cy="lista-title">Lista de Pacientes</h5>
                    <span className="badge bg-light text-dark" data-cy="total-pacientes">
                        {pacientesData.length} pacientes
                    </span>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover" data-cy="tabela-pacientes">
                            <thead>
                            <tr>
                                <th data-cy="col-nome">Nome</th>
                                <th data-cy="col-cpf">CPF</th>
                                <th data-cy="col-contato">Contato</th>
                                <th data-cy="col-tipo-sanguineo">Tipo Sanguíneo</th>
                                <th data-cy="col-status">Status</th>
                                <th data-cy="col-ultima-consulta">Última Consulta</th>
                                <th data-cy="col-acoes">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pacientesData.map(paciente => (
                                <tr key={paciente.id} data-cy={`paciente-${paciente.id}`}>
                                    <td data-cy="paciente-nome">
                                        <strong>{paciente.nome}</strong>
                                        {paciente.internado && (
                                            <span className="badge bg-danger ms-2" data-cy="badge-internado">INTERNADO</span>
                                        )}
                                    </td>
                                    <td data-cy="paciente-cpf">{paciente.cpf}</td>
                                    <td data-cy="paciente-contato">
                                        <div>{paciente.telefone}</div>
                                        <small className="text-muted">{paciente.email}</small>
                                    </td>
                                    <td data-cy="paciente-tipo-sanguineo">
                                        <span className="badge bg-info">{paciente.tipoSanguineo}</span>
                                    </td>
                                    <td data-cy="paciente-status">
                                            <span className={`badge ${
                                                paciente.internado ? 'bg-danger' : 'bg-success'
                                            }`}>
                                                {paciente.internado ? 'Internado' : 'Ativo'}
                                            </span>
                                        {paciente.internado && (
                                            <div className="small text-muted" data-cy="leito-atual">
                                                Leito: {paciente.leito}
                                            </div>
                                        )}
                                    </td>
                                    <td data-cy="paciente-ultima-consulta">{paciente.ultimaConsulta}</td>
                                    <td>
                                        <div className="btn-group" role="group">
                                            <Link
                                                href={`/dashboard/profissional/pacientes/${paciente.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                                data-cy="btn-editar-paciente"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-info"
                                                data-cy="btn-ver-prontuario"
                                            >
                                                Prontuário
                                            </button>
                                            {!paciente.internado ? (
                                                <Link
                                                    href={`/dashboard/profissional/internacoes?pacienteId=${paciente.id}`}
                                                    className="btn btn-sm btn-outline-warning"
                                                    data-cy="btn-internar-paciente"
                                                >
                                                    Internar
                                                </Link>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    data-cy="btn-alta-paciente"
                                                >
                                                    Dar Alta
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Internação */}
            <div className="modal fade" id="modalInternacao" tabIndex={-1} data-cy="modal-internacao">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" data-cy="modal-internacao-title">Internar Paciente</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" data-cy="btn-fechar-modal"></button>
                        </div>
                        <div className="modal-body">
                            <form data-cy="form-internacao">
                                {/* Dados do Paciente */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-paciente-internacao">Paciente</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value="Carlos Silva"
                                        readOnly
                                        data-cy="input-paciente-internacao"
                                    />
                                </div>

                                {/* Seleção de Leito */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-leito">Selecionar Leito</label>
                                    <select className="form-select" data-cy="select-leito" required>
                                        <option value="">Selecione um leito disponível</option>
                                        {leitosDisponiveis
                                            .filter(leito => leito.status === 'Disponível')
                                            .map(leito => (
                                                <option key={leito.id} value={leito.id} data-cy={`option-leito-${leito.id}`}>
                                                    {leito.numero} - {leito.tipo}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <div className="form-text" data-cy="leitos-disponiveis-info">
                                        {leitosDisponiveis.filter(l => l.status === 'Disponível').length} leitos disponíveis
                                    </div>
                                </div>

                                {/* Diagnóstico */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-diagnostico">Diagnóstico de Internação *</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Descreva o diagnóstico que justifica a internação..."
                                        data-cy="textarea-diagnostico"
                                        required
                                    ></textarea>
                                </div>

                                {/* Data de Internação */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-data-internacao">Data da Internação</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        data-cy="input-data-internacao"
                                        required
                                    />
                                </div>

                                {/* Médico Responsável */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-medico-responsavel">Médico Responsável</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={session.user?.name || ''}
                                        readOnly
                                        data-cy="input-medico-responsavel"
                                    />
                                </div>

                                {/* Observações */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-observacoes-internacao">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        placeholder="Observações adicionais..."
                                        data-cy="textarea-observacoes-internacao"
                                    ></textarea>
                                </div>
                            </form>

                            {/* Leitos Disponíveis */}
                            <div className="mt-4">
                                <h6 data-cy="leitos-disponiveis-title">Leitos Disponíveis</h6>
                                <div className="row">
                                    {leitosDisponiveis
                                        .filter(leito => leito.status === 'Disponível')
                                        .map(leito => (
                                            <div key={leito.id} className="col-md-6 mb-2">
                                                <div className="border rounded p-2 bg-light" data-cy={`leito-disponivel-${leito.id}`}>
                                                    <strong data-cy="leito-numero">{leito.numero}</strong>
                                                    <br />
                                                    <small data-cy="leito-tipo">{leito.tipo}</small>
                                                    <br />
                                                    <span className="badge bg-success" data-cy="leito-status">Disponível</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-cy="btn-cancelar-internacao">
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" data-cy="btn-confirmar-internacao">
                                Confirmar Internação
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
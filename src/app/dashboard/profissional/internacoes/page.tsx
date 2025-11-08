import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
    searchParams: {
        pacienteId?: string;
    };
}

export default async function InternacoesPage({ searchParams }: PageProps) {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const pacienteId = searchParams.pacienteId;

    const leitosData = {
        estatisticas: {
            total: 50,
            ocupados: 38,
            disponiveis: 10,
            manutencao: 2
        },
        leitos: [
            {
                id: 101,
                numero: '101-A',
                tipo: 'Enfermaria',
                status: 'Ocupado',
                paciente: 'Carlos Silva',
                pacienteId: 1,
                diagnostico: 'Pneumonia',
                dataInternacao: '2024-01-10',
                medico: 'Dr. João Silva',
                prioridade: 'Média'
            },
            {
                id: 102,
                numero: '102-B',
                tipo: 'Enfermaria',
                status: 'Disponível',
                paciente: '',
                pacienteId: null,
                diagnostico: '',
                dataInternacao: '',
                medico: '',
                prioridade: ''
            },
            {
                id: 103,
                numero: '103-C',
                tipo: 'Enfermaria',
                status: 'Disponível',
                paciente: '',
                pacienteId: null,
                diagnostico: '',
                dataInternacao: '',
                medico: '',
                prioridade: ''
            },
            {
                id: 201,
                numero: '201-UTI',
                tipo: 'UTI',
                status: 'Ocupado',
                paciente: 'Maria Oliveira',
                pacienteId: 2,
                diagnostico: 'COVID-19 Grave',
                dataInternacao: '2024-01-08',
                medico: 'Dra. Ana Costa',
                prioridade: 'Alta'
            },
            {
                id: 202,
                numero: '202-UTI',
                tipo: 'UTI',
                status: 'Ocupado',
                paciente: 'João Santos',
                pacienteId: 3,
                diagnostico: 'Pós-operatório Cardíaco',
                dataInternacao: '2024-01-09',
                medico: 'Dr. Carlos Andrade',
                prioridade: 'Alta'
            },
            {
                id: 301,
                numero: '301-A',
                tipo: 'Apartamento',
                status: 'Disponível',
                paciente: '',
                pacienteId: null,
                diagnostico: '',
                dataInternacao: '',
                medico: '',
                prioridade: ''
            },
            {
                id: 302,
                numero: '302-B',
                tipo: 'Apartamento',
                status: 'Manutenção',
                paciente: '',
                pacienteId: null,
                diagnostico: '',
                dataInternacao: '',
                medico: '',
                prioridade: ''
            }
        ]
    };

    const pacientesParaInternar = [
        { id: 4, nome: 'Ana Costa', cpf: '789.123.456-00' },
        { id: 5, nome: 'Pedro Almeida', cpf: '321.654.987-00' },
        { id: 6, nome: 'Fernanda Lima', cpf: '654.987.321-00' }
    ];

    // Encontrar paciente selecionado se houver
    const pacienteSelecionado = pacienteId
        ? pacientesParaInternar.find(p => p.id === parseInt(pacienteId))
        : null;

    return (
        <div className="container-fluid py-4" data-cy="internacoes-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Gestão de Leitos e Internações</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        {pacienteSelecionado
                            ? `Internar: ${pacienteSelecionado.nome}`
                            : 'Controle de ocupação e internações hospitalares'
                        }
                    </p>
                </div>
                <div>
                    <Link href="/dashboard/profissional/pacientes" className="btn btn-outline-secondary me-2" data-cy="btn-voltar-pacientes">
                        Voltar para Pacientes
                    </Link>
                    <Link href="/dashboard/profissional/leitos" className="btn btn-outline-primary" data-cy="btn-visualizar-leitos">
                        Visualizar Leitos
                    </Link>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-primary shadow h-100" data-cy="total-leitos-card">
                        <div className="card-body">
                            <div className="text-primary text-uppercase small fw-bold">Total de Leitos</div>
                            <div className="h2 mb-0 fw-bold" data-cy="total-leitos">{leitosData.estatisticas.total}</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-success shadow h-100" data-cy="disponiveis-card">
                        <div className="card-body">
                            <div className="text-success text-uppercase small fw-bold">Disponíveis</div>
                            <div className="h2 mb-0 fw-bold" data-cy="leitos-disponiveis">{leitosData.estatisticas.disponiveis}</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-danger shadow h-100" data-cy="ocupados-card">
                        <div className="card-body">
                            <div className="text-danger text-uppercase small fw-bold">Ocupados</div>
                            <div className="h2 mb-0 fw-bold" data-cy="leitos-ocupados">{leitosData.estatisticas.ocupados}</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-warning shadow h-100" data-cy="manutencao-card">
                        <div className="card-body">
                            <div className="text-warning text-uppercase small fw-bold">Em Manutenção</div>
                            <div className="h2 mb-0 fw-bold" data-cy="leitos-manutencao">{leitosData.estatisticas.manutencao}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Formulário de Internação */}
                <div className="col-lg-6">
                    <div className="card shadow mb-4" data-cy="form-internacao-card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="form-title">
                                {pacienteSelecionado ? 'Internar Paciente' : 'Nova Internação'}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form data-cy="form-internacao">
                                {/* Seleção do Paciente */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-paciente">Paciente *</label>
                                    <select
                                        className="form-select"
                                        data-cy="select-paciente"
                                        defaultValue={pacienteId || ''}
                                        required
                                    >
                                        <option value="">Selecione um paciente</option>
                                        {pacientesParaInternar.map(paciente => (
                                            <option key={paciente.id} value={paciente.id} data-cy={`option-paciente-${paciente.id}`}>
                                                {paciente.nome} - {paciente.cpf}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Seleção de Leito */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-leito">Leito *</label>
                                    <select className="form-select" data-cy="select-leito" required>
                                        <option value="">Selecione um leito disponível</option>
                                        {leitosData.leitos
                                            .filter(leito => leito.status === 'Disponível')
                                            .map(leito => (
                                                <option key={leito.id} value={leito.id} data-cy={`option-leito-${leito.id}`}>
                                                    {leito.numero} - {leito.tipo}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <div className="form-text" data-cy="leitos-disponiveis-info">
                                        {leitosData.estatisticas.disponiveis} leitos disponíveis
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

                                {/* Data e Hora */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-data-internacao">Data da Internação *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            data-cy="input-data-internacao"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" data-cy="label-hora-internacao">Hora da Internação *</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            defaultValue={new Date().toTimeString().slice(0, 5)}
                                            data-cy="input-hora-internacao"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Prioridade */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-prioridade">Prioridade</label>
                                    <select className="form-select" data-cy="select-prioridade">
                                        <option value="baixa" data-cy="option-prioridade-baixa">Baixa</option>
                                        <option value="media" data-cy="option-prioridade-media" selected>Média</option>
                                        <option value="alta" data-cy="option-prioridade-alta">Alta</option>
                                        <option value="urgente" data-cy="option-prioridade-urgente">Urgente</option>
                                    </select>
                                </div>

                                {/* Observações */}
                                <div className="mb-4">
                                    <label className="form-label" data-cy="label-observacoes">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        placeholder="Observações adicionais sobre a internação..."
                                        data-cy="textarea-observacoes"
                                    ></textarea>
                                </div>

                                {/* Botões */}
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" data-cy="btn-cancelar-internacao">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" data-cy="btn-confirmar-internacao">
                                        Confirmar Internação
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Leitos Disponíveis */}
                <div className="col-lg-6">
                    <div className="card shadow mb-4" data-cy="leitos-disponiveis-card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0" data-cy="leitos-title">Leitos Disponíveis</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {leitosData.leitos
                                    .filter(leito => leito.status === 'Disponível')
                                    .map(leito => (
                                        <div key={leito.id} className="col-md-6 mb-3">
                                            <div className="card border-success h-100" data-cy={`leito-disponivel-${leito.id}`}>
                                                <div className="card-header bg-success text-white py-2">
                                                    <h6 className="mb-0" data-cy="leito-numero">{leito.numero}</h6>
                                                </div>
                                                <div className="card-body text-center">
                                                    <span className="badge bg-success mb-2" data-cy="leito-status">Disponível</span>
                                                    <p className="mb-1" data-cy="leito-tipo"><strong>Tipo:</strong> {leito.tipo}</p>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary mt-2"
                                                        data-cy="btn-selecionar-leito"
                                                    >
                                                        Selecionar este Leito
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    {/* Leitos Ocupados */}
                    <div className="card shadow" data-cy="leitos-ocupados-card">
                        <div className="card-header bg-danger text-white">
                            <h5 className="mb-0" data-cy="ocupados-title">Leitos Ocupados</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm" data-cy="tabela-leitos-ocupados">
                                    <thead>
                                    <tr>
                                        <th data-cy="col-leito">Leito</th>
                                        <th data-cy="col-paciente">Paciente</th>
                                        <th data-cy="col-diagnostico">Diagnóstico</th>
                                        <th data-cy="col-acoes">Ações</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {leitosData.leitos
                                        .filter(leito => leito.status === 'Ocupado')
                                        .map(leito => (
                                            <tr key={leito.id} data-cy={`leito-ocupado-${leito.id}`}>
                                                <td data-cy="leito-numero">
                                                    <strong>{leito.numero}</strong>
                                                    <br />
                                                    <small className="text-muted">{leito.tipo}</small>
                                                </td>
                                                <td data-cy="leito-paciente">
                                                    <div>{leito.paciente}</div>
                                                    <small className="text-muted">
                                                        Desde: {leito.dataInternacao}
                                                    </small>
                                                </td>
                                                <td data-cy="leito-diagnostico">
                                                    <span className="badge bg-warning text-dark">{leito.prioridade}</span>
                                                    <br />
                                                    <small>{leito.diagnostico}</small>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            data-cy="btn-visualizar-internacao"
                                                        >
                                                            Ver
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-success"
                                                            data-cy="btn-alta-paciente"
                                                        >
                                                            Alta
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-info"
                                                            data-cy="btn-transferir-leito"
                                                        >
                                                            Transferir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
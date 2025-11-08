// app/dashboard/profissional/consultas/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ConsultasProfissionalPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const consultasData = {
        resumo: {
            total: 45,
            esteMes: 12,
            confirmadas: 8,
            canceladas: 2
        },
        consultas: [
            {
                id: 1,
                data: '2024-01-15',
                hora: '09:00',
                paciente: 'Carlos Silva',
                tipo: 'Retorno',
                status: 'Realizada',
                modalidade: 'Presencial',
                prontuario: true,
                documentos: ['receita', 'atestado']
            },
            {
                id: 2,
                data: '2024-01-15',
                hora: '10:30',
                paciente: 'Ana Costa',
                tipo: 'Primeira Consulta',
                status: 'Realizada',
                modalidade: 'Teleconsulta',
                prontuario: true,
                documentos: ['receita']
            },
            {
                id: 3,
                data: '2024-01-16',
                hora: '14:00',
                paciente: 'João Santos',
                tipo: 'Acompanhamento',
                status: 'Agendada',
                modalidade: 'Presencial',
                prontuario: false,
                documentos: []
            },
            {
                id: 4,
                data: '2024-01-16',
                hora: '15:30',
                paciente: 'Maria Oliveira',
                tipo: 'Retorno',
                status: 'Confirmada',
                modalidade: 'Presencial',
                prontuario: false,
                documentos: []
            },
            {
                id: 5,
                data: '2024-01-14',
                hora: '11:00',
                paciente: 'Pedro Almeida',
                tipo: 'Urgência',
                status: 'Realizada',
                modalidade: 'Presencial',
                prontuario: true,
                documentos: ['receita', 'laudo']
            }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="consultas-profissional-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Relatório de Consultas</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Visão geral e gestão de todas as consultas
                    </p>
                </div>
                <div>
                    <Link href="/dashboard/profissional/agenda" className="btn btn-outline-primary me-2" data-cy="btn-ir-agenda">
                        Ir para Agenda
                    </Link>
                    <button className="btn btn-primary" data-cy="btn-exportar-relatorio">
                        Exportar Relatório
                    </button>
                </div>
            </div>

            {/* Métricas */}
            <div className="row mb-4" data-cy="metricas-section">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-start-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1" data-cy="metric-total">
                                        Total de Consultas
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-total-count">
                                        {consultasData.resumo.total}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-start-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1" data-cy="metric-mes">
                                        Este Mês
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-mes-count">
                                        {consultasData.resumo.esteMes}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-chart-line fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-start-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1" data-cy="metric-confirmadas">
                                        Confirmadas (Mês)
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-confirmadas-count">
                                        {consultasData.resumo.confirmadas}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-start-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1" data-cy="metric-canceladas">
                                        Canceladas (Mês)
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-canceladas-count">
                                        {consultasData.resumo.canceladas}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card shadow mb-4" data-cy="filtros-section">
                <div className="card-header bg-light">
                    <h6 className="mb-0" data-cy="filtros-title">Filtros</h6>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-periodo">Período</label>
                            <select className="form-select" data-cy="select-periodo">
                                <option value="hoje">Hoje</option>
                                <option value="semana">Esta Semana</option>
                                <option value="mes" selected>Este Mês</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-status">Status</label>
                            <select className="form-select" data-cy="select-status">
                                <option value="">Todos</option>
                                <option value="agendada">Agendada</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="realizada">Realizada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-modalidade">Modalidade</label>
                            <select className="form-select" data-cy="select-modalidade">
                                <option value="">Todas</option>
                                <option value="presencial">Presencial</option>
                                <option value="teleconsulta">Teleconsulta</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-prontuario">Prontuário</label>
                            <select className="form-select" data-cy="select-prontuario">
                                <option value="">Todos</option>
                                <option value="completo">Completo</option>
                                <option value="incompleto">Incompleto</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Consultas */}
            <div className="card shadow" data-cy="consultas-list-section">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0" data-cy="consultas-title">Todas as Consultas</h6>
                    <span className="badge bg-primary" data-cy="total-consultas-badge">
                        {consultasData.consultas.length} consultas
                    </span>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover" data-cy="consultas-table">
                            <thead>
                            <tr>
                                <th data-cy="th-data">Data/Hora</th>
                                <th data-cy="th-paciente">Paciente</th>
                                <th data-cy="th-tipo">Tipo</th>
                                <th data-cy="th-status">Status</th>
                                <th data-cy="th-modalidade">Modalidade</th>
                                <th data-cy="th-prontuario">Prontuário</th>
                                <th data-cy="th-documentos">Documentos</th>
                                <th data-cy="th-acoes">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {consultasData.consultas.map(consulta => (
                                <tr key={consulta.id} data-cy={`consulta-row-${consulta.id}`}>
                                    <td data-cy="consulta-data">
                                        <strong>{new Date(consulta.data).toLocaleDateString('pt-BR')}</strong>
                                        <br />
                                        <small className="text-muted">{consulta.hora}</small>
                                    </td>
                                    <td data-cy="consulta-paciente">
                                        <strong>{consulta.paciente}</strong>
                                    </td>
                                    <td data-cy="consulta-tipo">
                                        <span className="badge bg-secondary">{consulta.tipo}</span>
                                    </td>
                                    <td data-cy="consulta-status">
                                            <span className={`badge ${
                                                consulta.status === 'Realizada' ? 'bg-success' :
                                                    consulta.status === 'Confirmada' ? 'bg-primary' :
                                                        consulta.status === 'Agendada' ? 'bg-warning' : 'bg-danger'
                                            }`}>
                                                {consulta.status}
                                            </span>
                                    </td>
                                    <td data-cy="consulta-modalidade">
                                            <span className={`badge ${
                                                consulta.modalidade === 'Teleconsulta' ? 'bg-info' : 'bg-primary'
                                            }`}>
                                                {consulta.modalidade}
                                            </span>
                                    </td>
                                    <td data-cy="consulta-prontuario">
                                        {consulta.prontuario ? (
                                            <span className="badge bg-success" data-cy="prontuario-completo">
                                                    Completo
                                                </span>
                                        ) : (
                                            <span className="badge bg-warning" data-cy="prontuario-incompleto">
                                                    ✗ Incompleto
                                                </span>
                                        )}
                                    </td>
                                    <td data-cy="consulta-documentos">
                                        <div className="d-flex gap-1">
                                            {consulta.documentos.map((doc, index) => (
                                                <span key={index} className={`badge ${
                                                    doc === 'receita' ? 'bg-primary' :
                                                        doc === 'atestado' ? 'bg-success' : 'bg-info'
                                                }`} data-cy={`documento-${doc}`}>
                                                        {doc}
                                                    </span>
                                            ))}
                                            {consulta.documentos.length === 0 && (
                                                <span className="text-muted" data-cy="sem-documentos">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td data-cy="consulta-acoes">
                                        <div className="btn-group">
                                            {consulta.status === 'Agendada' || consulta.status === 'Confirmada' ? (
                                                <Link
                                                    href={`/dashboard/profissional/consultas/${consulta.id}`}
                                                    className="btn btn-sm btn-primary"
                                                    data-cy="btn-iniciar-consulta"
                                                >
                                                    Iniciar
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/dashboard/profissional/prontuarios/${consulta.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    data-cy="btn-ver-prontuario"
                                                >
                                                    Ver
                                                </Link>
                                            )}
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                data-bs-toggle="dropdown"
                                                data-cy="btn-mais-acoes"
                                            >
                                                ⋮
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <Link
                                                        href={`/dashboard/profissional/consultas/${consulta.id}`}
                                                        className="dropdown-item"
                                                        data-cy="link-detalhes-consulta"
                                                    >
                                                        Detalhes da Consulta
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href={`/dashboard/profissional/prontuarios/${consulta.id}`}
                                                        className="dropdown-item"
                                                        data-cy="link-prontuario"
                                                    >
                                                        Prontuário
                                                    </Link>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item text-warning" data-cy="btn-remarcar">
                                                        Remarcar
                                                    </button>
                                                </li>
                                                <li>
                                                    <button className="dropdown-item text-danger" data-cy="btn-cancelar">
                                                        Cancelar
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
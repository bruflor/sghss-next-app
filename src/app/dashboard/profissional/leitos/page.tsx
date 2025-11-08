import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LeitosPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const leitosData = {
        estatisticas: {
            total: 50,
            ocupados: 38,
            disponiveis: 12,
            manutencao: 2
        },
        leitos: [
            {
                id: 101,
                numero: '101-A',
                tipo: 'Enfermaria',
                status: 'Ocupado',
                paciente: 'Carlos Silva',
                diagnostico: 'Pneumonia',
                dataInternacao: '2024-01-10',
                medico: 'Dr. João Silva'
            },
            {
                id: 102,
                numero: '102-B',
                tipo: 'Enfermaria',
                status: 'Disponível',
                paciente: '',
                diagnostico: '',
                dataInternacao: '',
                medico: ''
            },
            {
                id: 201,
                numero: '201-UTI',
                tipo: 'UTI',
                status: 'Ocupado',
                paciente: 'Maria Oliveira',
                diagnostico: 'COVID-19 Grave',
                dataInternacao: '2024-01-08',
                medico: 'Dra. Ana Costa'
            },
            {
                id: 301,
                numero: '301-A',
                tipo: 'Apartamento',
                status: 'Manutenção',
                paciente: '',
                diagnostico: '',
                dataInternacao: '',
                medico: ''
            }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="leitos-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Controle de Leitos</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Gerencie a ocupação dos leitos hospitalares</p>
                </div>
                <Link href="/dashboard/profissional/internacoes/nova" className="btn btn-primary" data-cy="btn-nova-internacao">
                    Nova Internação
                </Link>
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

            {/* Lista de Leitos */}
            <div className="card shadow" data-cy="leitos-list">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" data-cy="leitos-title">Leitos Hospitalares</h5>
                    <div className="btn-group">
                        <button className="btn btn-sm btn-light" data-cy="btn-filtrar-todos">Todos</button>
                        <button className="btn btn-sm btn-outline-light" data-cy="btn-filtrar-disponiveis">Disponíveis</button>
                        <button className="btn btn-sm btn-outline-light" data-cy="btn-filtrar-ocupados">Ocupados</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        {leitosData.leitos.map(leito => (
                            <div key={leito.id} className="col-xl-3 col-md-4 col-sm-6 mb-3">
                                <div className={`card h-100 ${
                                    leito.status === 'Disponível' ? 'border-success' :
                                        leito.status === 'Ocupado' ? 'border-danger' : 'border-warning'
                                }`} data-cy={`leito-${leito.id}`}>
                                    <div className={`card-header ${
                                        leito.status === 'Disponível' ? 'bg-success' :
                                            leito.status === 'Ocupado' ? 'bg-danger' : 'bg-warning'
                                    } text-white`}>
                                        <h6 className="mb-0" data-cy="leito-numero">{leito.numero}</h6>
                                        <small data-cy="leito-tipo">{leito.tipo}</small>
                                    </div>
                                    <div className="card-body">
                                        <div className="text-center mb-3">
                                            <span className={`badge ${
                                                leito.status === 'Disponível' ? 'bg-success' :
                                                    leito.status === 'Ocupado' ? 'bg-danger' : 'bg-warning'
                                            }`} data-cy="leito-status">
                                                {leito.status}
                                            </span>
                                        </div>

                                        {leito.status === 'Ocupado' && (
                                            <>
                                                <p className="mb-1" data-cy="leito-paciente">
                                                    <strong>Paciente:</strong> {leito.paciente}
                                                </p>
                                                <p className="mb-1" data-cy="leito-diagnostico">
                                                    <strong>Diagnóstico:</strong> {leito.diagnostico}
                                                </p>
                                                <p className="mb-1" data-cy="leito-internacao">
                                                    <strong>Internação:</strong> {leito.dataInternacao}
                                                </p>
                                                <p className="mb-0" data-cy="leito-medico">
                                                    <strong>Médico:</strong> {leito.medico}
                                                </p>
                                            </>
                                        )}

                                        {leito.status === 'Disponível' && (
                                            <p className="text-center text-muted" data-cy="leito-disponivel">
                                                Leito disponível para internação
                                            </p>
                                        )}

                                        {leito.status === 'Manutenção' && (
                                            <p className="text-center text-muted" data-cy="leito-manutencao">
                                                Em manutenção - Indisponível
                                            </p>
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        <div className="btn-group w-100">
                                            {leito.status === 'Ocupado' && (
                                                <>
                                                    <button className="btn btn-sm btn-outline-primary" data-cy="btn-visualizar-internacao">
                                                        Visualizar
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-success" data-cy="btn-alta-paciente">
                                                        Dar Alta
                                                    </button>
                                                </>
                                            )}
                                            {leito.status === 'Disponível' && (
                                                <button className="btn btn-sm btn-success w-100" data-cy="btn-internar-paciente">
                                                    Internar Paciente
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
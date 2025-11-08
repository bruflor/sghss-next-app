// app/dashboard/profissional/prontuarios/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProntuariosPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const prontuariosData = {
        pacientes: [
            {
                id: 1,
                nome: 'Carlos Silva',
                idade: 35,
                sexo: 'Masculino',
                ultimaConsulta: '2024-01-15',
                diagnosticoPrincipal: 'Hipertensão Arterial',
                alergias: 'Penicilina',
                medicamentos: ['Losartana 50mg', 'AAS 100mg'],
                prontuarioCompleto: true
            },
            {
                id: 2,
                nome: 'Ana Costa',
                idade: 28,
                sexo: 'Feminino',
                ultimaConsulta: '2024-01-10',
                diagnosticoPrincipal: 'Diabetes Mellitus Tipo 2',
                alergias: 'Nenhuma',
                medicamentos: ['Metformina 850mg'],
                prontuarioCompleto: true
            },
            {
                id: 3,
                nome: 'João Santos',
                idade: 45,
                sexo: 'Masculino',
                ultimaConsulta: '2024-01-08',
                diagnosticoPrincipal: 'Asma Brônquica',
                alergias: 'Ácaros, Poeira',
                medicamentos: ['Budesonida 200mcg', 'Salbutamol'],
                prontuarioCompleto: false
            },
            {
                id: 4,
                nome: 'Maria Oliveira',
                idade: 62,
                sexo: 'Feminino',
                ultimaConsulta: '2023-12-20',
                diagnosticoPrincipal: 'Osteoartrite',
                alergias: 'Dipirona',
                medicamentos: ['Celecoxib 200mg', 'Cálcio + Vit D'],
                prontuarioCompleto: true
            }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="prontuarios-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Prontuários Eletrônicos</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Acesso completo ao histórico clínico dos pacientes
                    </p>
                </div>
                <div>
                    <button className="btn btn-outline-primary me-2" data-cy="btn-exportar-todos">
                        Exportar Todos
                    </button>
                    <Link href="/dashboard/profissional/pacientes" className="btn btn-primary" data-cy="btn-gerenciar-pacientes">
                        Gerenciar Pacientes
                    </Link>
                </div>
            </div>

            {/* Filtros e Busca */}
            <div className="card shadow mb-4" data-cy="filtros-section">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label" data-cy="label-busca">Buscar Paciente</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o nome do paciente..."
                                data-cy="input-busca"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-status">Status do Prontuário</label>
                            <select className="form-select" data-cy="select-status">
                                <option value="">Todos</option>
                                <option value="completo">Completo</option>
                                <option value="incompleto">Incompleto</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label" data-cy="label-ultima-consulta">Última Consulta</label>
                            <select className="form-select" data-cy="select-ultima-consulta">
                                <option value="">Qualquer data</option>
                                <option value="7d">Últimos 7 dias</option>
                                <option value="30d">Últimos 30 dias</option>
                                <option value="90d">Últimos 3 meses</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-outline-secondary w-100" data-cy="btn-limpar-filtros">
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Prontuários */}
            <div className="row" data-cy="lista-prontuarios">
                {prontuariosData.pacientes.map(paciente => (
                    <div key={paciente.id} className="col-xl-6 mb-4">
                        <div className="card shadow h-100" data-cy={`prontuario-card-${paciente.id}`}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0" data-cy="nome-paciente">{paciente.nome}</h6>
                                <div>
                                    <span className="badge bg-secondary me-1" data-cy="idade-paciente">
                                        {paciente.idade} anos
                                    </span>
                                    <span className={`badge ${
                                        paciente.sexo === 'Masculino' ? 'bg-info' : 'bg-warning'
                                    }`} data-cy="sexo-paciente">
                                        {paciente.sexo}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <small className="text-muted" data-cy="label-ultima-consulta">Última Consulta</small>
                                        <br />
                                        <strong data-cy="data-ultima-consulta">
                                            {new Date(paciente.ultimaConsulta).toLocaleDateString('pt-BR')}
                                        </strong>
                                    </div>
                                    <div className="col-6">
                                        <small className="text-muted" data-cy="label-status-prontuario">Status</small>
                                        <br />
                                        {paciente.prontuarioCompleto ? (
                                            <span className="badge bg-success" data-cy="prontuario-completo">
                                                Completo
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning" data-cy="prontuario-incompleto">
                                                Incompleto
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted" data-cy="label-diagnostico">Diagnóstico Principal</small>
                                    <br />
                                    <span data-cy="diagnostico-principal">{paciente.diagnosticoPrincipal}</span>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted" data-cy="label-alergias">Alergias</small>
                                    <br />
                                    <span className={`badge ${
                                        paciente.alergias === 'Nenhuma' ? 'bg-success' : 'bg-danger'
                                    }`} data-cy="alergias-paciente">
                                        {paciente.alergias}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <small className="text-muted" data-cy="label-medicamentos">Medicamentos em Uso</small>
                                    <br />
                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                        {paciente.medicamentos.map((med, index) => (
                                            <span key={index} className="badge bg-primary" data-cy={`medicamento-${index}`}>
                                                {med}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent">
                                <div className="btn-group w-100">
                                    <Link
                                        href={`/dashboard/profissional/prontuarios/${paciente.id}`}
                                        className="btn btn-outline-primary btn-sm"
                                        data-cy="btn-ver-prontuario"
                                    >
                                       Ver Prontuário
                                    </Link>
                                    <Link
                                        href={`/dashboard/profissional/consultas?paciente=${paciente.id}`}
                                        className="btn btn-outline-info btn-sm"
                                        data-cy="btn-historico-consultas"
                                    >
                                        Histórico
                                    </Link>
                                    <button className="btn btn-outline-secondary btn-sm" data-cy="btn-exportar-prontuario">
                                        Exportar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estatísticas */}
            <div className="row mt-4" data-cy="estatisticas-section">
                <div className="col-md-3">
                    <div className="card border-start-primary shadow">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1" data-cy="metric-total-pacientes">
                                        Total de Pacientes
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-total-count">
                                        {prontuariosData.pacientes.length}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-start-success shadow">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1" data-cy="metric-prontuarios-completos">
                                        Prontuários Completos
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-completos-count">
                                        {prontuariosData.pacientes.filter(p => p.prontuarioCompleto).length}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-start-warning shadow">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1" data-cy="metric-consultas-mes">
                                        Consultas Este Mês
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-consultas-count">
                                        12
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar-check fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-start-info shadow">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1" data-cy="metric-alergias">
                                        Pacientes com Alergias
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800" data-cy="metric-alergias-count">
                                        {prontuariosData.pacientes.filter(p => p.alergias !== 'Nenhuma').length}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-allergies fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
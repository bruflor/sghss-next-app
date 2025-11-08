// app/dashboard/profissional/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardProfissionalPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const dashboardData = {
        resumo: {
            consultasHoje: 5,
            consultasEstaSemana: 18,
            pacientesAtivos: 45,
            prontuariosPendentes: 3,
            receitasPendentes: 2,
            examesPendentes: 4
        },
        consultasHoje: [
            {
                id: 1,
                hora: '09:00',
                paciente: 'Carlos Silva',
                tipo: 'Retorno',
                status: 'Confirmada',
                modalidade: 'Presencial'
            },
            {
                id: 2,
                hora: '10:30',
                paciente: 'Ana Costa',
                tipo: 'Primeira Consulta',
                status: 'Confirmada',
                modalidade: 'Teleconsulta'
            },
            {
                id: 3,
                hora: '14:00',
                paciente: 'João Santos',
                tipo: 'Acompanhamento',
                status: 'Agendada',
                modalidade: 'Presencial'
            },
            {
                id: 4,
                hora: '15:30',
                paciente: 'Maria Oliveira',
                tipo: 'Retorno',
                status: 'Confirmada',
                modalidade: 'Presencial'
            },
            {
                id: 5,
                hora: '16:30',
                paciente: 'Pedro Almeida',
                tipo: 'Urgência',
                status: 'Pendente',
                modalidade: 'Presencial'
            }
        ],
        alertas: [
            {
                id: 1,
                tipo: 'prontuario',
                mensagem: '3 prontuários pendentes de finalização',
                prioridade: 'alta',
                link: '/dashboard/profissional/consultas'
            },
            {
                id: 2,
                tipo: 'receita',
                mensagem: '2 receitas pendentes de assinatura',
                prioridade: 'media',
                link: '/dashboard/profissional/consultas'
            },
            {
                id: 3,
                tipo: 'exame',
                mensagem: '4 resultados de exames disponíveis',
                prioridade: 'baixa',
                link: '/dashboard/profissional/prontuarios'
            }
        ],
        metricasRapidas: {
            taxaConfirmacao: '85%',
            tempoMedioConsulta: '32min',
            satisfacaoPacientes: '4.7/5',
            reconsultas: '78%'
        }
    };

    return (
        <div className="container-fluid py-4" data-cy="dashboard-profissional-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">
                        Dashboard Profissional
                    </h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Bem-vindo, {session.user?.name || 'Profissional'}! Aqui está seu resumo do dia.
                    </p>
                </div>
                <div className="btn-group">
                    <Link href="/dashboard/profissional/agenda" className="btn btn-primary" data-cy="btn-ir-agenda">
                       Minha Agenda
                    </Link>
                </div>
            </div>

            {/* Métricas Principais */}
            <div className="row mb-4" data-cy="metricas-principais">
                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-primary shadow h-100" data-cy="metric-consultas-hoje">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Consultas Hoje
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.consultasHoje}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/agenda"
                                            className="text-xs text-primary"
                                            data-cy="link-ver-agenda"
                                        >
                                            Ver agenda →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar-day fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-success shadow h-100" data-cy="metric-pacientes-ativos">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Pacientes Ativos
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.pacientesAtivos}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/prontuarios"
                                            className="text-xs text-success"
                                            data-cy="link-ver-pacientes"
                                        >
                                            Ver prontuários →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-users fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-warning shadow h-100" data-cy="metric-prontuarios-pendentes">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Prontuários Pendentes
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.prontuariosPendentes}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/consultas"
                                            className="text-xs text-warning"
                                            data-cy="link-finalizar-prontuarios"
                                        >
                                            Finalizar →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-file-medical fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-info shadow h-100" data-cy="metric-receitas-pendentes">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Receitas Pendentes
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.receitasPendentes}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/consultas"
                                            className="text-xs text-info"
                                            data-cy="link-assinar-receitas"
                                        >
                                            Assinar →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-prescription fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-secondary shadow h-100" data-cy="metric-exames-pendentes">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                                        Exames Pendentes
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.examesPendentes}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/prontuarios"
                                            className="text-xs text-secondary"
                                            data-cy="link-ver-exames"
                                        >
                                            Ver resultados →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-microscope fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-6 mb-4">
                    <div className="card border-start-danger shadow h-100" data-cy="metric-consultas-semana">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                        Esta Semana
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {dashboardData.resumo.consultasEstaSemana}
                                    </div>
                                    <div className="mt-2">
                                        <Link
                                            href="/dashboard/profissional/consultas"
                                            className="text-xs text-danger"
                                            data-cy="link-ver-todas-consultas"
                                        >
                                            Ver todas →
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar-week fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Coluna Esquerda - Consultas do Dia e Ações Rápidas */}
                <div className="col-lg-8">
                    {/* Consultas de Hoje */}
                    <div className="card shadow mb-4" data-cy="consultas-hoje-card">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h6 className="mb-0" data-cy="consultas-hoje-title">
                               Consultas de Hoje
                            </h6>
                            <span className="badge bg-light text-dark" data-cy="total-consultas-hoje">
                                {dashboardData.consultasHoje.length} consultas
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush" data-cy="lista-consultas-hoje">
                                {dashboardData.consultasHoje.map(consulta => (
                                    <div key={consulta.id} className="list-group-item d-flex justify-content-between align-items-center" data-cy={`consulta-${consulta.id}`}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <strong data-cy="consulta-hora">{consulta.hora}</strong>
                                            </div>
                                            <div>
                                                <h6 className="mb-0" data-cy="consulta-paciente">{consulta.paciente}</h6>
                                                <small className="text-muted" data-cy="consulta-tipo">{consulta.tipo}</small>
                                                <span className={`badge ms-2 ${
                                                    consulta.modalidade === 'Teleconsulta' ? 'bg-info' : 'bg-secondary'
                                                }`} data-cy="consulta-modalidade">
                                                    {consulta.modalidade}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <span className={`badge me-2 ${
                                                consulta.status === 'Confirmada' ? 'bg-success' :
                                                    consulta.status === 'Agendada' ? 'bg-warning' : 'bg-danger'
                                            }`} data-cy="consulta-status">
                                                {consulta.status}
                                            </span>
                                            <Link
                                                href={`/dashboard/profissional/consultas/${consulta.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                                data-cy="btn-iniciar-consulta"
                                            >
                                                Iniciar
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer bg-transparent">
                            <Link href="/dashboard/profissional/agenda" className="btn btn-outline-primary btn-sm" data-cy="btn-ver-agenda-completa">
                                Ver agenda completa →
                            </Link>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="card shadow" data-cy="acoes-rapidas-card">
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0" data-cy="acoes-rapidas-title">Ações Rápidas</h6>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <Link
                                        href="/dashboard/profissional/agenda"
                                        className="card card-hover text-decoration-none"
                                        data-cy="card-agenda"
                                    >
                                        <div className="card-body text-center">
                                            <div className="text-primary mb-2">
                                                <i className="fas fa-calendar-plus fa-2x"></i>
                                            </div>
                                            <h6 className="card-title">Nova Consulta</h6>
                                            <p className="card-text text-muted small">Agendar nova consulta</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link
                                        href="/dashboard/profissional/prontuarios"
                                        className="card card-hover text-decoration-none"
                                        data-cy="card-prontuarios"
                                    >
                                        <div className="card-body text-center">
                                            <div className="text-success mb-2">
                                                <i className="fas fa-file-medical fa-2x"></i>
                                            </div>
                                            <h6 className="card-title">Prontuários</h6>
                                            <p className="card-text text-muted small">Acessar prontuários</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link
                                        href="/dashboard/profissional/consultas"
                                        className="card card-hover text-decoration-none"
                                        data-cy="card-consultas"
                                    >
                                        <div className="card-body text-center">
                                            <div className="text-info mb-2">
                                                <i className="fas fa-list-alt fa-2x"></i>
                                            </div>
                                            <h6 className="card-title">Todas as Consultas</h6>
                                            <p className="card-text text-muted small">Relatório completo</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-6">
                                    <Link
                                        href="/dashboard/profissional/pacientes"
                                        className="card card-hover text-decoration-none"
                                        data-cy="card-pacientes"
                                    >
                                        <div className="card-body text-center">
                                            <div className="text-warning mb-2">
                                                <i className="fas fa-user-injured fa-2x"></i>
                                            </div>
                                            <h6 className="card-title">Meus Pacientes</h6>
                                            <p className="card-text text-muted small">Lista de pacientes</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita - Alertas e Métricas */}
                <div className="col-lg-4">
                    {/* Alertas e Notificações */}
                    <div className="card shadow mb-4" data-cy="alertas-card">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0" data-cy="alertas-title">Alertas e Notificações</h6>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush" data-cy="lista-alertas">
                                {dashboardData.alertas.map(alerta => (
                                    <Link
                                        key={alerta.id}
                                        href={alerta.link}
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        data-cy={`alerta-${alerta.id}`}
                                    >
                                        <div>
                                            <span className={`badge me-2 ${
                                                alerta.prioridade === 'alta' ? 'bg-danger' :
                                                    alerta.prioridade === 'media' ? 'bg-warning' : 'bg-info'
                                            }`} data-cy="alerta-prioridade">
                                                {alerta.prioridade === 'alta' ? '!' : 'i'}
                                            </span>
                                            <span data-cy="alerta-mensagem">{alerta.mensagem}</span>
                                        </div>
                                        <i className="fas fa-chevron-right text-muted" data-cy="alerta-icone"></i>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Métricas de Desempenho */}
                    <div className="card shadow mb-4" data-cy="metricas-desempenho-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="metricas-desempenho-title">Métricas de Desempenho</h6>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-2" data-cy="metric-taxa-confirmacao">
                                        <div className="h5 mb-0 text-success" data-cy="metric-taxa-confirmacao-valor">
                                            {dashboardData.metricasRapidas.taxaConfirmacao}
                                        </div>
                                        <small className="text-muted" data-cy="metric-taxa-confirmacao-label">
                                            Taxa Confirmação
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-2" data-cy="metric-tempo-medio">
                                        <div className="h5 mb-0 text-primary" data-cy="metric-tempo-medio-valor">
                                            {dashboardData.metricasRapidas.tempoMedioConsulta}
                                        </div>
                                        <small className="text-muted" data-cy="metric-tempo-medio-label">
                                            Tempo Médio
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="border rounded p-2" data-cy="metric-satisfacao">
                                        <div className="h5 mb-0 text-warning" data-cy="metric-satisfacao-valor">
                                            {dashboardData.metricasRapidas.satisfacaoPacientes}
                                        </div>
                                        <small className="text-muted" data-cy="metric-satisfacao-label">
                                            Satisfação
                                        </small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="border rounded p-2" data-cy="metric-reconsultas">
                                        <div className="h5 mb-0 text-info" data-cy="metric-reconsultas-valor">
                                            {dashboardData.metricasRapidas.reconsultas}
                                        </div>
                                        <small className="text-muted" data-cy="metric-reconsultas-label">
                                            Reconsultas
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Rápidos */}
                    <div className="card shadow" data-cy="links-rapidos-card">
                        <div className="card-header bg-secondary text-white">
                            <h6 className="mb-0" data-cy="links-rapidos-title">Links Rápidos</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link href="/dashboard/profissional/agenda" className="btn btn-outline-primary text-start" data-cy="link-agenda">
                                    <i className="fas fa-calendar me-2"></i>
                                    Minha Agenda
                                </Link>
                                <Link href="/dashboard/profissional/consultas" className="btn btn-outline-success text-start" data-cy="link-consultas">
                                    <i className="fas fa-list me-2"></i>
                                    Todas as Consultas
                                </Link>
                                <Link href="/dashboard/profissional/prontuarios" className="btn btn-outline-info text-start" data-cy="link-prontuarios">
                                    <i className="fas fa-file-medical me-2"></i>
                                    Prontuários
                                </Link>
                                <Link href="/dashboard/profissional/pacientes" className="btn btn-outline-warning text-start" data-cy="link-pacientes">
                                    <i className="fas fa-user-injured me-2"></i>
                                    Meus Pacientes
                                </Link>
                                <Link href="/dashboard/profissional/relatorios" className="btn btn-outline-secondary text-start" data-cy="link-relatorios">
                                    <i className="fas fa-chart-bar me-2"></i>
                                    Relatórios
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
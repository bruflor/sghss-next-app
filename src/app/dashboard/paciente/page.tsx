import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PacienteDashboard() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    // Mock data
    const pacienteData = {
        consultasAgendadas: [
            { id: 1, data: '2024-01-15', hora: '14:00', medico: 'Dr. João Silva', tipo: 'Consulta de Rotina', status: 'Agendada' },
            { id: 2, data: '2024-01-20', hora: '10:30', medico: 'Dra. Maria Santos', tipo: 'Retorno', status: 'Agendada' }
        ],
        examesPendentes: [
            { id: 1, tipo: 'Hemograma Completo', data: '2024-01-16', status: 'Coleta Agendada' },
            { id: 2, tipo: 'Ultrassom Abdominal', data: '2024-01-18', status: 'Agendado' }
        ],
        examesResultados: [
            { id: 1, tipo: 'Glicemia', data: '2024-01-10', resultado: 'Normal' },
            { id: 2, tipo: 'Colesterol', data: '2024-01-10', resultado: 'Aguardando' }
        ],
        medicamentos: [
            { id: 1, nome: 'Losartana 50mg', horario: '08:00', status: 'Em uso' },
            { id: 2, nome: 'Metformina 850mg', horario: '12:00 e 20:00', status: 'Em uso' }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="paciente-dashboard">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="dashboard-title">Meu Painel</h1>
                    <p className="text-muted mb-0" data-cy="welcome-message">Bem-vindo(a), {session.user?.name}</p>
                </div>
                <span className="badge bg-primary fs-6" data-cy="user-role">Paciente</span>
            </div>

            {/* Cards de Resumo */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-primary shadow h-100" data-cy="consultas-card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-primary text-uppercase small fw-bold" data-cy="consultas-label">
                                        Consultas Agendadas
                                    </div>
                                    <div className="h3 mb-0 fw-bold" data-cy="consultas-count">{pacienteData.consultasAgendadas.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-success shadow h-100" data-cy="exames-pendentes-card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-success text-uppercase small fw-bold" data-cy="exames-pendentes-label">
                                        Exames Pendentes
                                    </div>
                                    <div className="h3 mb-0 fw-bold" data-cy="exames-pendentes-count">{pacienteData.examesPendentes.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-info shadow h-100" data-cy="resultados-card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-info text-uppercase small fw-bold" data-cy="resultados-label">
                                        Resultados
                                    </div>
                                    <div className="h3 mb-0 fw-bold" data-cy="resultados-count">
                                        {pacienteData.examesResultados.filter(e => e.resultado !== 'Aguardando').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-warning shadow h-100" data-cy="medicamentos-card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-warning text-uppercase small fw-bold" data-cy="medicamentos-label">
                                        Medicamentos
                                    </div>
                                    <div className="h3 mb-0 fw-bold" data-cy="medicamentos-count">{pacienteData.medicamentos.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow" data-cy="acoes-rapidas-card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="acoes-title">Ações Rápidas</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/agendar-consulta" className="btn btn-primary w-100 py-3" data-cy="btn-agendar-consulta">
                                        Agendar Consulta
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/agendar-exame" className="btn btn-success w-100 py-3" data-cy="btn-agendar-exame">
                                        Agendar Exame
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/prontuario" className="btn btn-info w-100 py-3" data-cy="btn-prontuario">
                                        Meu Prontuário
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/perfil" className="btn btn-warning w-100 py-3" data-cy="btn-meus-dados">
                                        Meus Dados / Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Coluna da Esquerda - Consultas */}
                <div className="col-lg-4">
                    {/* Próximas Consultas */}
                    <div className="card shadow mb-4" data-cy="consultas-list">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" data-cy="consultas-list-title">Próximas Consultas</h5>
                            <Link href="/dashboard/paciente/consultas" className="btn btn-sm btn-outline-primary" data-cy="btn-ver-todas-consultas">
                                Ver Todas
                            </Link>
                        </div>
                        <div className="card-body">
                            {pacienteData.consultasAgendadas.map(consulta => (
                                <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`consulta-item-${consulta.id}`}>
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                            <small className="text-muted" data-cy="consulta-datahora">{consulta.data} às {consulta.hora}</small>
                                            <div className="mt-1">
                                                <span className="badge bg-primary me-2" data-cy="consulta-tipo">{consulta.tipo}</span>
                                                <span className="badge bg-success" data-cy="consulta-status">{consulta.status}</span>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary" data-cy="btn-ver-consulta">Ver</button>
                                                <button className="btn btn-sm btn-outline-danger" data-cy="btn-cancelar-consulta">Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna do Meio - Exames Pendentes */}
                <div className="col-lg-4">
                    <div className="card shadow mb-4" data-cy="exames-pendentes-list">
                        <div className="card-header">
                            <h5 className="mb-0" data-cy="exames-pendentes-title">Exames Pendentes</h5>
                        </div>
                        <div className="card-body">
                            {pacienteData.examesPendentes.map(exame => (
                                <div key={exame.id} className="border rounded p-3 mb-3" data-cy={`exame-pendente-item-${exame.id}`}>
                                    <h6 className="mb-1" data-cy="exame-tipo">{exame.tipo}</h6>
                                    <small className="text-muted" data-cy="exame-data">Data: {exame.data}</small>
                                    <div className="mt-1">
                                        <span className="badge bg-warning" data-cy="exame-status">{exame.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna da Direita - Medicamentos Atuais */}
                <div className="col-lg-4">
                    <div className="card shadow mb-4" data-cy="medicamentos-list">
                        <div className="card-header">
                            <h5 className="mb-0" data-cy="medicamentos-title">Medicamentos Atuais</h5>
                        </div>
                        <div className="card-body">
                            {pacienteData.medicamentos.map((med) => (
                                <div key={med.id} className="border rounded p-3 mb-3" data-cy={`medicamento-item-${med.id}`}>
                                    <h6 className="mb-1" data-cy="medicamento-nome">{med.nome}</h6>
                                    <small className="text-muted" data-cy="medicamento-horario">Horário: {med.horario}</small>
                                    <div className="mt-1">
                                        <span className="badge bg-success" data-cy="medicamento-status">{med.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alertas e Lembretes */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-warning shadow" data-cy="alertas-card">
                        <div className="card-header">
                            <h5 className="mb-0" data-cy="alertas-title">Lembretes e Alertas</h5>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-warning" data-cy="alerta-lembrete">
                                <strong>Lembrete:</strong> Você tem uma consulta com Dr. João Silva em 2 dias.
                            </div>
                            <div className="alert alert-info" data-cy="alerta-informacao">
                                <strong>Informação:</strong> Resultado do exame de colesterol disponível em 3 dias.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
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
            { nome: 'Losartana 50mg', horario: '08:00', status: 'Em uso' },
            { nome: 'Metformina 850mg', horario: '12:00 e 20:00', status: 'Em uso' }
        ]
    };

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary">Meu Painel</h1>
                    <p className="text-muted mb-0">Bem-vindo(a), {session.user?.name}</p>
                </div>
                <span className="badge bg-primary fs-6">Paciente</span>
            </div>

            {/* Cards de Resumo */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-primary shadow h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-primary text-uppercase small fw-bold">
                                        Consultas Agendadas
                                    </div>
                                    <div className="h3 mb-0 fw-bold">{pacienteData.consultasAgendadas.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-success shadow h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-success text-uppercase small fw-bold">
                                        Exames Pendentes
                                    </div>
                                    <div className="h3 mb-0 fw-bold">{pacienteData.examesPendentes.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-info shadow h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-info text-uppercase small fw-bold">
                                        Resultados
                                    </div>
                                    <div className="h3 mb-0 fw-bold">
                                        {pacienteData.examesResultados.filter(e => e.resultado !== 'Aguardando').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-warning shadow h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="text-warning text-uppercase small fw-bold">
                                        Medicamentos
                                    </div>
                                    <div className="h3 mb-0 fw-bold">{pacienteData.medicamentos.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Ações Rápidas</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/agendar-consulta" className="btn btn-primary w-100 py-3">
                                        Agendar Consulta
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/agendar-exame" className="btn btn-success w-100 py-3">
                                        Agendar Exame
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/prontuario" className="btn btn-info w-100 py-3">
                                        Meu Prontuário
                                    </Link>
                                </div>
                                <div className="col-md-3">
                                    <Link href="/dashboard/paciente/teleconsulta" className="btn btn-warning w-100 py-3">
                                        Teleconsulta
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
                    <div className="card shadow mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Próximas Consultas</h5>
                            <Link href="/dashboard/paciente/consultas" className="btn btn-sm btn-outline-primary">
                                Ver Todas
                            </Link>
                        </div>
                        <div className="card-body">
                            {pacienteData.consultasAgendadas.map(consulta => (
                                <div key={consulta.id} className="border rounded p-3 mb-3">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <h6 className="mb-1">{consulta.medico}</h6>
                                            <small className="text-muted">{consulta.data} às {consulta.hora}</small>
                                            <div className="mt-1">
                                                <span className="badge bg-primary me-2">{consulta.tipo}</span>
                                                <span className="badge bg-success">{consulta.status}</span>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary">Ver</button>
                                                <button className="btn btn-sm btn-outline-danger">Cancelar</button>
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
                    <div className="card shadow mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Exames Pendentes</h5>
                        </div>
                        <div className="card-body">
                            {pacienteData.examesPendentes.map(exame => (
                                <div key={exame.id} className="border rounded p-3 mb-3">
                                    <h6 className="mb-1">{exame.tipo}</h6>
                                    <small className="text-muted">Data: {exame.data}</small>
                                    <div className="mt-1">
                                        <span className="badge bg-warning">{exame.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna da Direita - Medicamentos Atuais */}
                <div className="col-lg-4">
                    <div className="card shadow mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Medicamentos Atuais</h5>
                        </div>
                        <div className="card-body">
                            {pacienteData.medicamentos.map((med, index) => (
                                <div key={index} className="border rounded p-3 mb-3">
                                    <h6 className="mb-1">{med.nome}</h6>
                                    <small className="text-muted">Horário: {med.horario}</small>
                                    <div className="mt-1">
                                        <span className="badge bg-success">{med.status}</span>
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
                    <div className="card border-warning shadow">
                        <div className="card-header">
                            <h5 className="mb-0">Lembretes e Alertas</h5>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-warning">
                                <strong>Lembrete:</strong> Você tem uma consulta com Dr. João Silva em 2 dias.
                            </div>
                            <div className="alert alert-info">
                                <strong>Informação:</strong> Resultado do exame de colesterol disponível em 3 dias.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ConsultasPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    const consultasData = {
        agendadas: [
            { id: 1, data: '2024-01-15', hora: '14:00', medico: 'Dr. João Silva', tipo: 'Consulta de Rotina', status: 'Agendada', local: 'Clínica Central' },
            { id: 2, data: '2024-01-20', hora: '10:30', medico: 'Dra. Maria Santos', tipo: 'Retorno', status: 'Agendada', local: 'Clínica Central' }
        ],
        realizadas: [
            { id: 3, data: '2024-01-05', hora: '09:00', medico: 'Dr. Carlos Andrade', tipo: 'Primeira Consulta', status: 'Realizada', local: 'Clínica Sul' },
            { id: 4, data: '2023-12-20', hora: '15:30', medico: 'Dra. Ana Costa', tipo: 'Acompanhamento', status: 'Realizada', local: 'Clínica Norte' }
        ],
        canceladas: [
            { id: 5, data: '2023-12-15', hora: '11:00', medico: 'Dr. Pedro Almeida', tipo: 'Especialidade', status: 'Cancelada', local: 'Clínica Leste' }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="consultas-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Minhas Consultas</h1>
                    <p className="text-muted mb-0" data-cy="welcome-message">Gerencie suas consultas médicas</p>
                </div>
                <Link href="/dashboard/paciente/agendar-consulta" className="btn btn-primary" data-cy="btn-nova-consulta">
                    Nova Consulta
                </Link>
            </div>

            {/* Consultas Agendadas */}
            <div className="card shadow mb-4" data-cy="consultas-agendadas-section">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0" data-cy="agendadas-title">Consultas Agendadas</h5>
                </div>
                <div className="card-body">
                    {consultasData.agendadas.map(consulta => (
                        <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`consulta-agendada-${consulta.id}`}>
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                    <p className="mb-1" data-cy="consulta-datahora">
                                        <strong>Data:</strong> {consulta.data} às {consulta.hora}
                                    </p>
                                    <p className="mb-1" data-cy="consulta-local">
                                        <strong>Local:</strong> {consulta.local}
                                    </p>
                                    <div className="mt-2">
                                        <span className="badge bg-primary me-2" data-cy="consulta-tipo">{consulta.tipo}</span>
                                        <span className="badge bg-success" data-cy="consulta-status">{consulta.status}</span>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-primary" data-cy="btn-detalhes-consulta">Detalhes</button>
                                        <button className="btn btn-sm btn-outline-warning" data-cy="btn-remarcar-consulta">Remarcar</button>
                                        <button className="btn btn-sm btn-outline-danger" data-cy="btn-cancelar-consulta">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consultas Realizadas */}
            <div className="card shadow mb-4" data-cy="consultas-realizadas-section">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0" data-cy="realizadas-title">Consultas Realizadas</h5>
                </div>
                <div className="card-body">
                    {consultasData.realizadas.map(consulta => (
                        <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`consulta-realizada-${consulta.id}`}>
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                    <p className="mb-1" data-cy="consulta-datahora">
                                        <strong>Data:</strong> {consulta.data} às {consulta.hora}
                                    </p>
                                    <p className="mb-1" data-cy="consulta-local">
                                        <strong>Local:</strong> {consulta.local}
                                    </p>
                                    <div className="mt-2">
                                        <span className="badge bg-info me-2" data-cy="consulta-tipo">{consulta.tipo}</span>
                                        <span className="badge bg-secondary" data-cy="consulta-status">{consulta.status}</span>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    <button className="btn btn-sm btn-outline-primary" data-cy="btn-ver-prontuario">Ver Prontuário</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Histórico de Canceladas */}
            <div className="card shadow" data-cy="consultas-canceladas-section">
                <div className="card-header bg-secondary text-white">
                    <h5 className="mb-0" data-cy="canceladas-title">Consultas Canceladas</h5>
                </div>
                <div className="card-body">
                    {consultasData.canceladas.map(consulta => (
                        <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`consulta-cancelada-${consulta.id}`}>
                            <div className="row">
                                <div className="col-md-8">
                                    <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                    <p className="mb-1" data-cy="consulta-datahora">
                                        <strong>Data:</strong> {consulta.data} às {consulta.hora}
                                    </p>
                                    <p className="mb-1" data-cy="consulta-local">
                                        <strong>Local:</strong> {consulta.local}
                                    </p>
                                    <div className="mt-2">
                                        <span className="badge bg-warning me-2" data-cy="consulta-tipo">{consulta.tipo}</span>
                                        <span className="badge bg-danger" data-cy="consulta-status">{consulta.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
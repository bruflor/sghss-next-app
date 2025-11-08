import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function TeleconsultaPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    const teleconsultas = [
        { id: 1, data: '2024-01-18', hora: '14:00', medico: 'Dr. João Silva', status: 'Agendada', link: 'https://meet.vidaplus.com/abc123' },
        { id: 2, data: '2024-01-12', hora: '10:00', medico: 'Dra. Maria Santos', status: 'Realizada', link: '' },
        { id: 3, data: '2023-12-20', hora: '16:30', medico: 'Dr. Carlos Andrade', status: 'Cancelada', link: '' }
    ];

    return (
        <div className="container-fluid py-4" data-cy="teleconsulta-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Teleconsultas</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Consultas médicas online</p>
                </div>
                <Link href="/dashboard/paciente/agendar-consulta" className="btn btn-primary" data-cy="btn-nova-teleconsulta">
                    Nova Teleconsulta
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {/* Próximas Teleconsultas */}
                    <div className="card shadow mb-4" data-cy="proximas-teleconsultas">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="proximas-title">Próximas Teleconsultas</h5>
                        </div>
                        <div className="card-body">
                            {teleconsultas
                                .filter(t => t.status === 'Agendada')
                                .map(consulta => (
                                    <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`teleconsulta-${consulta.id}`}>
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                                <p className="mb-1" data-cy="consulta-datahora">
                                                    <strong>Data:</strong> {consulta.data} às {consulta.hora}
                                                </p>
                                                <div className="mt-2">
                                                    <span className="badge bg-success" data-cy="consulta-status">{consulta.status}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6 text-end">
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-primary" data-cy="btn-testar-audio">
                                                        Testar Áudio/Video
                                                    </button>
                                                    <a
                                                        href={consulta.link}
                                                        className="btn btn-sm btn-success"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        data-cy="btn-entrar-consulta"
                                                    >
                                                        Entrar na Consulta
                                                    </a>
                                                    <button className="btn btn-sm btn-outline-danger" data-cy="btn-cancelar-teleconsulta">
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Histórico de Teleconsultas */}
                    <div className="card shadow" data-cy="historico-teleconsultas">
                        <div className="card-header bg-secondary text-white">
                            <h5 className="mb-0" data-cy="historico-title">Histórico de Teleconsultas</h5>
                        </div>
                        <div className="card-body">
                            {teleconsultas
                                .filter(t => t.status !== 'Agendada')
                                .map(consulta => (
                                    <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`teleconsulta-hist-${consulta.id}`}>
                                        <div className="row align-items-center">
                                            <div className="col-md-8">
                                                <h6 className="mb-1" data-cy="consulta-medico">{consulta.medico}</h6>
                                                <p className="mb-1" data-cy="consulta-datahora">
                                                    <strong>Data:</strong> {consulta.data} às {consulta.hora}
                                                </p>
                                                <div className="mt-2">
                                                    <span className={`badge ${
                                                        consulta.status === 'Realizada' ? 'bg-info' : 'bg-danger'
                                                    }`} data-cy="consulta-status">
                                                        {consulta.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 text-end">
                                                {consulta.status === 'Realizada' && (
                                                    <button className="btn btn-sm btn-outline-primary" data-cy="btn-ver-gravacao">
                                                        Ver Gravação
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Preparação para Teleconsulta */}
                    <div className="card shadow mb-4" data-cy="preparacao-card">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0" data-cy="preparacao-title">Preparação para Teleconsulta</h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled small" data-cy="preparacao-lista">
                                <li className="mb-2" data-cy="item-testar-equipamento">
                                    ✅ Teste áudio e vídeo antes da consulta
                                </li>
                                <li className="mb-2" data-cy="item-conexao-internet">
                                    ✅ Use conexão estável de internet
                                </li>
                                <li className="mb-2" data-cy="item-ambiente-silencioso">
                                    ✅ Ambiente silencioso e bem iluminado
                                </li>
                                <li className="mb-2" data-cy="item-documentos-prontos">
                                    ✅ Tenha documentos e exames em mãos
                                </li>
                                <li className="mb-2" data-cy="item-medicamentos-lista">
                                    ✅ Lista de medicamentos em uso
                                </li>
                                <li data-cy="item-checar-antecendencia">
                                    ✅ Acesse 5 minutos antes do horário
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Suporte Técnico */}
                    <div className="card shadow" data-cy="suporte-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="suporte-title">Suporte Técnico</h6>
                        </div>
                        <div className="card-body">
                            <p className="small" data-cy="suporte-contato">
                                <strong>Problemas técnicos?</strong><br />
                                Entre em contato com nosso suporte:
                            </p>
                            <button className="btn btn-sm btn-outline-primary w-100 mb-2" data-cy="btn-chat-suporte">
                                Chat Online
                            </button>
                            <button className="btn btn-sm btn-outline-secondary w-100" data-cy="btn-email-suporte">
                                Enviar Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
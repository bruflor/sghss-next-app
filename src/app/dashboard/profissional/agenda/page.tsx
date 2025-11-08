import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AgendaPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'profissional') {
        redirect('/login');
    }

    const agendaData = {
        hoje: new Date().toISOString().split('T')[0], // Data atual
        eventos: [
            {
                id: 1,
                data: new Date().toISOString().split('T')[0],
                hora: '09:00',
                paciente: 'Carlos Silva',
                tipo: 'Consulta de Retorno',
                duracao: 30,
                status: 'Confirmado',
                tipoConsulta: 'Presencial',
                observacoes: 'Paciente em acompanhamento de hipertensão'
            },
            {
                id: 2,
                data: new Date().toISOString().split('T')[0],
                hora: '10:00',
                paciente: 'Ana Costa',
                tipo: 'Primeira Consulta',
                duracao: 60,
                status: 'Confirmado',
                tipoConsulta: 'Teleconsulta',
                observacoes: 'Link de videochamada enviado'
            },
            {
                id: 3,
                data: new Date().toISOString().split('T')[0],
                hora: '11:30',
                paciente: 'João Santos',
                tipo: 'Acompanhamento',
                duracao: 30,
                status: 'Pendente',
                tipoConsulta: 'Presencial',
                observacoes: 'Trazer exames recentes'
            },
            {
                id: 4,
                data: new Date().toISOString().split('T')[0],
                hora: '14:00',
                paciente: 'Maria Oliveira',
                tipo: 'Retorno',
                duracao: 30,
                status: 'Confirmado',
                tipoConsulta: 'Presencial',
                observacoes: 'Avaliação pós-internação'
            },
            {
                id: 5,
                data: new Date().toISOString().split('T')[0],
                hora: '15:00',
                paciente: 'Pedro Almeida',
                tipo: 'Consulta de Rotina',
                duracao: 30,
                status: 'Cancelado',
                tipoConsulta: 'Presencial',
                observacoes: 'Paciente cancelou'
            }
        ],
        indisponibilidades: [
            {
                id: 1,
                data: new Date().toISOString().split('T')[0],
                horaInicio: '12:00',
                horaFim: '13:30',
                motivo: 'Almoço',
                tipo: 'Recorrente'
            },
            {
                id: 2,
                data: '2024-01-20',
                horaInicio: '14:00',
                horaFim: '18:00',
                motivo: 'Reunião de Equipe',
                tipo: 'Pontual'
            }
        ]
    };

    const horariosDisponiveis = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    // Agrupar eventos por data
    const eventosPorData = agendaData.eventos.reduce((acc, evento) => {
        if (!acc[evento.data]) {
            acc[evento.data] = [];
        }
        acc[evento.data].push(evento);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="container-fluid py-4" data-cy="agenda-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Minha Agenda</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Gerencie sua agenda de consultas e atendimentos
                    </p>
                </div>
                <div>
                    <Link href={`/dashboard/profissional/consultas/agendar-consulta`}
                        className="btn btn-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#modalNovaConsulta"
                        data-cy="btn-nova-consulta"
                    >
                        Nova Consulta
                    </Link>
                    <button
                        className="btn btn-outline-warning"
                        data-bs-toggle="modal"
                        data-bs-target="#modalIndisponibilidade"
                        data-cy="btn-bloquear-horario"
                    >
                        Bloquear Horário
                    </button>
                </div>
            </div>

            <div className="row">
                {/* Calendário e Agenda do Dia */}
                <div className="col-lg-8">
                    {/* Agenda de Hoje */}
                    <div className="card shadow mb-4" data-cy="agenda-hoje-card">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" data-cy="hoje-title">
                                Agenda de Hoje - {new Date().toLocaleDateString('pt-BR')}
                            </h5>
                            <span className="badge bg-light text-dark" data-cy="total-consultas-hoje">
                                {agendaData.eventos.filter(e => e.data === agendaData.hoje).length} consultas
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="timeline" data-cy="timeline-consultas">
                                {horariosDisponiveis.map(horario => {
                                    const evento = agendaData.eventos.find(
                                        e => e.data === agendaData.hoje && e.hora === horario
                                    );
                                    const indisponivel = agendaData.indisponibilidades.some(
                                        i => i.data === agendaData.hoje &&
                                            horario >= i.horaInicio &&
                                            horario < i.horaFim
                                    );

                                    return (
                                        <div key={horario} className="timeline-item mb-3" data-cy={`timeline-item-${horario}`}>
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <strong data-cy="horario">{horario}</strong>
                                                </div>
                                                <div className="col-md-8">
                                                    {evento ? (
                                                        <div className={`border rounded p-3 ${
                                                            evento.status === 'Confirmado' ? 'border-success' :
                                                                evento.status === 'Pendente' ? 'border-warning' :
                                                                    'border-danger'
                                                        }`} data-cy={`consulta-${evento.id}`}>
                                                            <div className="row align-items-center">
                                                                <div className="col-md-6">
                                                                    <h6 className="mb-1" data-cy="consulta-paciente">{evento.paciente}</h6>
                                                                    <span className="badge bg-secondary" data-cy="consulta-tipo">{evento.tipo}</span>
                                                                    <span className={`badge ${
                                                                        evento.tipoConsulta === 'Teleconsulta' ? 'bg-info' : 'bg-primary'
                                                                    } ms-1`} data-cy="consulta-modalidade">
                                                                        {evento.tipoConsulta}
                                                                    </span>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <span className={`badge ${
                                                                        evento.status === 'Confirmado' ? 'bg-success' :
                                                                            evento.status === 'Pendente' ? 'bg-warning' :
                                                                                'bg-danger'
                                                                    }`} data-cy="consulta-status">
                                                                        {evento.status}
                                                                    </span>
                                                                    <br />
                                                                    <small data-cy="consulta-duracao">{evento.duracao} min</small>
                                                                </div>
                                                                <div className="col-md-2 text-end">
                                                                    <div className="btn-group">
                                                                        <Link href={`/dashboard/profissional/consultas/${evento.id}`} className="btn btn-sm btn-outline-primary" data-cy="btn-iniciar-consulta">
                                                                            Iniciar
                                                                        </Link>
                                                                        <button className="btn btn-sm btn-outline-secondary" data-cy="btn-detalhes-consulta">
                                                                            ...
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {evento.observacoes && (
                                                                <small className="text-muted mt-2 d-block" data-cy="consulta-observacoes">
                                                                    {evento.observacoes}
                                                                </small>
                                                            )}
                                                        </div>
                                                    ) : indisponivel ? (
                                                        <div className="border rounded p-3 bg-light" data-cy="horario-indisponivel">
                                                            <span className="text-muted" data-cy="indisponivel-texto">
                                                                ⏸️ Horário indisponível
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="border rounded p-3 bg-light" data-cy="horario-livre">
                                                            <span className="text-muted" data-cy="livre-texto">
                                                                ✅ Horário livre
                                                            </span>
                                                            <button
                                                                className="btn btn-sm btn-outline-success float-end"
                                                                data-cy="btn-agendar-horario"
                                                            >
                                                                Agendar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Próximos Dias */}
                    <div className="card shadow" data-cy="proximos-dias-card">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0" data-cy="proximos-title">Próximos Dias</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {['2024-01-16', '2024-01-17', '2024-01-18'].map(data => (
                                    <div key={data} className="col-md-4 mb-3">
                                        <div className="card" data-cy={`card-dia-${data}`}>
                                            <div className="card-header">
                                                <strong data-cy="data-dia">
                                                    {new Date(data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                                </strong>
                                            </div>
                                            <div className="card-body">
                                                {eventosPorData[data] ? (
                                                    eventosPorData[data].map(evento => (
                                                        <div key={evento.id} className="border rounded p-2 mb-2" data-cy={`evento-${evento.id}`}>
                                                            <small data-cy="evento-hora"><strong>{evento.hora}</strong></small>
                                                            <br />
                                                            <small data-cy="evento-paciente">{evento.paciente}</small>
                                                            <br />
                                                            <span className={`badge ${
                                                                evento.status === 'Confirmado' ? 'bg-success' : 'bg-warning'
                                                            }`} data-cy="evento-status">
                                                                {evento.status}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <small className="text-muted" data-cy="nenhum-evento">
                                                        Nenhuma consulta agendada
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Estatísticas e Ações Rápidas */}
                <div className="col-lg-4">
                    {/* Estatísticas do Dia */}
                    <div className="card shadow mb-4" data-cy="estatisticas-card">
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0" data-cy="estatisticas-title">Estatísticas de Hoje</h6>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-2" data-cy="total-consultas">
                                        <div className="h4 mb-0 text-primary" data-cy="total-consultas-count">
                                            {agendaData.eventos.filter(e => e.data === agendaData.hoje).length}
                                        </div>
                                        <small data-cy="total-consultas-label">Total Consultas</small>
                                    </div>
                                </div>
                                <div className="col-6 mb-3">
                                    <div className="border rounded p-2" data-cy="confirmadas">
                                        <div className="h4 mb-0 text-success" data-cy="confirmadas-count">
                                            {agendaData.eventos.filter(e => e.data === agendaData.hoje && e.status === 'Confirmado').length}
                                        </div>
                                        <small data-cy="confirmadas-label">Confirmadas</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="border rounded p-2" data-cy="teleconsultas">
                                        <div className="h4 mb-0 text-info" data-cy="teleconsultas-count">
                                            {agendaData.eventos.filter(e => e.data === agendaData.hoje && e.tipoConsulta === 'Teleconsulta').length}
                                        </div>
                                        <small data-cy="teleconsultas-label">Teleconsultas</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="border rounded p-2" data-cy="horarios-livres">
                                        <div className="h4 mb-0 text-warning" data-cy="horarios-livres-count">
                                            {horariosDisponiveis.length - agendaData.eventos.filter(e => e.data === agendaData.hoje).length}
                                        </div>
                                        <small data-cy="horarios-livres-label">Horários Livres</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="card shadow mb-4" data-cy="acoes-rapidas-card">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0" data-cy="acoes-title">Ações Rápidas</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link href="/dashboard/profissional/consultas" className="btn btn-outline-primary text-start" data-cy="btn-todas-consultas">
                                   Todas as Consultas
                                </Link>
                                <Link href="/dashboard/profissional/pacientes" className="btn btn-outline-success text-start" data-cy="btn-gerenciar-pacientes">
                                    Gerenciar Pacientes
                                </Link>
                                <button className="btn btn-outline-info text-start" data-cy="btn-exportar-agenda">
                                    📤 Exportar Agenda
                                </button>
                                <button className="btn btn-outline-secondary text-start" data-cy="btn-configurar-horarios">
                                    ⚙️ Configurar Horários
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Indisponibilidades */}
                    <div className="card shadow" data-cy="indisponibilidades-card">
                        <div className="card-header bg-danger text-white">
                            <h6 className="mb-0" data-cy="indisponibilidades-title">Horários Bloqueados</h6>
                        </div>
                        <div className="card-body">
                            {agendaData.indisponibilidades.map(indisponibilidade => (
                                <div key={indisponibilidade.id} className="border rounded p-2 mb-2" data-cy={`indisponibilidade-${indisponibilidade.id}`}>
                                    <small data-cy="indisponibilidade-data">
                                        <strong>{new Date(indisponibilidade.data).toLocaleDateString('pt-BR')}</strong>
                                    </small>
                                    <br />
                                    <small data-cy="indisponibilidade-horario">
                                        {indisponibilidade.horaInicio} - {indisponibilidade.horaFim}
                                    </small>
                                    <br />
                                    <small data-cy="indisponibilidade-motivo">{indisponibilidade.motivo}</small>
                                    <br />
                                    <span className="badge bg-secondary" data-cy="indisponibilidade-tipo">
                                        {indisponibilidade.tipo}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-outline-danger float-end"
                                        data-cy="btn-remover-indisponibilidade"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nova Consulta */}
            <div className="modal fade" id="modalNovaConsulta" tabIndex={-1} data-cy="modal-nova-consulta">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" data-cy="modal-nova-consulta-title">Agendar Nova Consulta</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" data-cy="btn-fechar-modal"></button>
                        </div>
                        <div className="modal-body">
                            <form data-cy="form-nova-consulta">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-paciente">Paciente *</label>
                                            <select className="form-select" data-cy="select-paciente" required>
                                                <option value="">Selecione um paciente</option>
                                                <option value="1" data-cy="option-paciente-1">Carlos Silva</option>
                                                <option value="2" data-cy="option-paciente-2">Ana Costa</option>
                                                <option value="3" data-cy="option-paciente-3">João Santos</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-data">Data *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                data-cy="input-data"
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-horario">Horário *</label>
                                            <select className="form-select" data-cy="select-horario" required>
                                                <option value="">Selecione um horário</option>
                                                {horariosDisponiveis.map(horario => (
                                                    <option key={horario} value={horario} data-cy={`option-horario-${horario}`}>
                                                        {horario}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-duracao">Duração *</label>
                                            <select className="form-select" data-cy="select-duracao" required>
                                                <option value="30" data-cy="option-30min">30 minutos</option>
                                                <option value="60" data-cy="option-60min">60 minutos</option>
                                                <option value="90" data-cy="option-90min">90 minutos</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-tipo-consulta">Tipo de Consulta</label>
                                            <select className="form-select" data-cy="select-tipo-consulta">
                                                <option value="presencial" data-cy="option-presencial">Presencial</option>
                                                <option value="teleconsulta" data-cy="option-teleconsulta">Teleconsulta</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label" data-cy="label-tipo-atendimento">Tipo de Atendimento</label>
                                            <select className="form-select" data-cy="select-tipo-atendimento">
                                                <option value="primeira" data-cy="option-primeira">Primeira Consulta</option>
                                                <option value="retorno" data-cy="option-retorno">Retorno</option>
                                                <option value="urgencia" data-cy="option-urgencia">Urgência</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-observacoes">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Observações sobre a consulta..."
                                        data-cy="textarea-observacoes"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-cy="btn-cancelar-consulta">
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" data-cy="btn-confirmar-consulta">
                                Agendar Consulta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
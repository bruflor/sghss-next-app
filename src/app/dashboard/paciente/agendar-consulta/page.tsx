import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AgendarConsultaPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    const especialidades = [
        'Clínica Geral',
        'Cardiologia',
        'Dermatologia',
        'Pediatria',
        'Ortopedia',
        'Ginecologia',
        'Oftalmologia'
    ];

    const medicos = [
        { id: 1, nome: 'Dr. João Silva', especialidade: 'Cardiologia' },
        { id: 2, nome: 'Dra. Maria Santos', especialidade: 'Clínica Geral' },
        { id: 3, nome: 'Dr. Carlos Andrade', especialidade: 'Dermatologia' },
        { id: 4, nome: 'Dra. Ana Costa', especialidade: 'Pediatria' }
    ];

    const horariosDisponiveis = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    return (
        <div className="container-fluid py-4" data-cy="agendar-consulta-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Agendar Consulta</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Agende uma nova consulta médica</p>
                </div>
                <Link href="/dashboard/paciente/consultas" className="btn btn-outline-secondary" data-cy="btn-voltar">
                    Voltar para Consultas
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow" data-cy="form-agendamento">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0" data-cy="form-title">Dados da Consulta</h5>
                        </div>
                        <div className="card-body">
                            <form data-cy="agendamento-form">
                                {/* Especialidade */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-especialidade">Especialidade Médica</label>
                                    <select className="form-select" data-cy="select-especialidade">
                                        <option value="">Selecione uma especialidade</option>
                                        {especialidades.map((especialidade, index) => (
                                            <option key={index} value={especialidade} data-cy={`option-especialidade-${index}`}>
                                                {especialidade}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Médico */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-medico">Médico</label>
                                    <select className="form-select" data-cy="select-medico">
                                        <option value="">Selecione um médico</option>
                                        {medicos.map((medico) => (
                                            <option key={medico.id} value={medico.id} data-cy={`option-medico-${medico.id}`}>
                                                {medico.nome} - {medico.especialidade}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Data */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-data">Data da Consulta</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min={new Date().toISOString().split('T')[0]}
                                        data-cy="input-data"
                                    />
                                </div>

                                {/* Horário */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-horario">Horário</label>
                                    <select className="form-select" data-cy="select-horario">
                                        <option value="">Selecione um horário</option>
                                        {horariosDisponiveis.map((horario, index) => (
                                            <option key={index} value={horario} data-cy={`option-horario-${index}`}>
                                                {horario}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tipo de Consulta */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-tipo">Tipo de Consulta</label>
                                    <select className="form-select" data-cy="select-tipo">
                                        <option value="rotina" data-cy="option-rotina">Consulta de Rotina</option>
                                        <option value="retorno" data-cy="option-retorno">Retorno</option>
                                        <option value="urgencia" data-cy="option-urgencia">Urgência</option>
                                        <option value="primeira" data-cy="option-primeira">Primeira Consulta</option>
                                    </select>
                                </div>

                                {/* Motivo */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-motivo">Motivo da Consulta</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Descreva o motivo da sua consulta..."
                                        data-cy="textarea-motivo"
                                    ></textarea>
                                </div>

                                {/* Botões */}
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" data-cy="btn-cancelar">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" data-cy="btn-agendar">
                                        Agendar Consulta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Informações do Paciente */}
                    <div className="card shadow mb-4" data-cy="info-paciente-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="info-title">Seus Dados</h6>
                        </div>
                        <div className="card-body">
                            <p data-cy="paciente-nome"><strong>Nome:</strong> {session.user?.name}</p>
                            <p data-cy="paciente-email"><strong>Email:</strong> {session.user?.email}</p>
                            <p data-cy="paciente-tipo"><strong>Tipo:</strong> Paciente</p>
                        </div>
                    </div>

                    {/* Horários Disponíveis */}
                    <div className="card shadow" data-cy="horarios-card">
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0" data-cy="horarios-title">Horários Disponíveis</h6>
                        </div>
                        <div className="card-body">
                            <p className="small text-muted" data-cy="horarios-info">
                                Horários disponíveis para hoje:
                            </p>
                            <div className="row">
                                {horariosDisponiveis.slice(0, 6).map((horario, index) => (
                                    <div key={index} className="col-6 mb-2">
                                        <span className="badge bg-light text-dark border" data-cy={`horario-disponivel-${index}`}>
                                            {horario}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
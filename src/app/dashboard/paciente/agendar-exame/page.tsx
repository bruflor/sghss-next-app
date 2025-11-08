import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AgendarExamePage() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    const tiposExame = [
        'Hemograma Completo',
        'Glicemia em Jejum',
        'Colesterol Total',
        'Triglicerídeos',
        'TGO/TGP',
        'TSH',
        'Urina Tipo I',
        'Ultrassom Abdominal',
        'Raio-X de Tórax',
        'Eletrocardiograma',
        'Tomografia Computadorizada',
        'Ressonância Magnética'
    ];

    const laboratorios = [
        'Laboratório Central',
        'LabMed Análises Clínicas',
        'Diagnóstico Plus',
        'LabVida Saúde',
        'Centro de Imagens Médicas'
    ];

    return (
        <div className="container-fluid py-4" data-cy="agendar-exame-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Agendar Exame</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Solicite exames laboratoriais e de imagem</p>
                </div>
                <Link href="/dashboard/paciente" className="btn btn-outline-secondary" data-cy="btn-voltar">
                    Voltar para Dashboard
                </Link>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow" data-cy="form-agendamento-exame">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0" data-cy="form-title">Dados do Exame</h5>
                        </div>
                        <div className="card-body">
                            <form data-cy="agendamento-exame-form">
                                {/* Tipo de Exame */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-tipo-exame">Tipo de Exame</label>
                                    <select className="form-select" data-cy="select-tipo-exame">
                                        <option value="">Selecione o tipo de exame</option>
                                        {tiposExame.map((tipo, index) => (
                                            <option key={index} value={tipo} data-cy={`option-exame-${index}`}>
                                                {tipo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Laboratório */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-laboratorio">Laboratório/Clínica</label>
                                    <select className="form-select" data-cy="select-laboratorio">
                                        <option value="">Selecione o local</option>
                                        {laboratorios.map((lab, index) => (
                                            <option key={index} value={lab} data-cy={`option-lab-${index}`}>
                                                {lab}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Data */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-data-exame">Data do Exame</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min={new Date().toISOString().split('T')[0]}
                                        data-cy="input-data-exame"
                                    />
                                </div>

                                {/* Horário */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-horario-exame">Horário Preferencial</label>
                                    <select className="form-select" data-cy="select-horario-exame">
                                        <option value="">Selecione um horário</option>
                                        <option value="08:00" data-cy="option-horario-manha1">08:00 - Manhã</option>
                                        <option value="09:00" data-cy="option-horario-manha2">09:00 - Manhã</option>
                                        <option value="10:00" data-cy="option-horario-manha3">10:00 - Manhã</option>
                                        <option value="14:00" data-cy="option-horario-tarde1">14:00 - Tarde</option>
                                        <option value="15:00" data-cy="option-horario-tarde2">15:00 - Tarde</option>
                                        <option value="16:00" data-cy="option-horario-tarde3">16:00 - Tarde</option>
                                    </select>
                                </div>

                                {/* Preparo */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-preparo">Preparo Necessário</label>
                                    <div className="form-check" data-cy="check-jejum">
                                        <input className="form-check-input" type="checkbox" id="jejum" data-cy="input-jejum" />
                                        <label className="form-check-label" htmlFor="jejum" data-cy="label-check-jejum">
                                            Jejum de 8-12 horas
                                        </label>
                                    </div>
                                    <div className="form-check" data-cy="check-medicamentos">
                                        <input className="form-check-input" type="checkbox" id="medicamentos" data-cy="input-medicamentos" />
                                        <label className="form-check-label" htmlFor="medicamentos" data-cy="label-check-medicamentos">
                                            Suspender medicamentos (se orientado)
                                        </label>
                                    </div>
                                    <div className="form-check" data-cy="check-urina">
                                        <input className="form-check-input" type="checkbox" id="urina" data-cy="input-urina" />
                                        <label className="form-check-label" htmlFor="urina" data-cy="label-check-urina">
                                            Coleta da primeira urina da manhã
                                        </label>
                                    </div>
                                </div>

                                {/* Observações */}
                                <div className="mb-3">
                                    <label className="form-label" data-cy="label-observacoes">Observações</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Alguma observação importante..."
                                        data-cy="textarea-observacoes"
                                    ></textarea>
                                </div>

                                {/* Botões */}
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary" data-cy="btn-cancelar-exame">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success" data-cy="btn-solicitar-exame">
                                        Solicitar Exame
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Informações Importantes */}
                    <div className="card shadow mb-4" data-cy="info-exame-card">
                        <div className="card-header bg-warning text-dark">
                            <h6 className="mb-0" data-cy="info-title">Informações Importantes</h6>
                        </div>
                        <div className="card-body">
                            <p className="small" data-cy="info-jejum">
                                <strong>Jejum:</strong> Necessário para exames de glicemia, colesterol e triglicerídeos.
                            </p>
                            <p className="small" data-cy="info-documentos">
                                <strong>Documentos:</strong> Levar RG, CPF e carteirinha do convênio.
                            </p>
                            <p className="small" data-cy="info-atendimento">
                                <strong>Atendimento:</strong> Chegar com 15 minutos de antecedência.
                            </p>
                        </div>
                    </div>

                    {/* Exames Recentes */}
                    <div className="card shadow" data-cy="exames-recentes-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="recentes-title">Seus Últimos Exames</h6>
                        </div>
                        <div className="card-body">
                            <div className="border rounded p-2 mb-2" data-cy="exame-recente-1">
                                <small data-cy="exame-tipo"><strong>Hemograma</strong></small><br />
                                <small data-cy="exame-data">15/12/2023 - Realizado</small>
                            </div>
                            <div className="border rounded p-2" data-cy="exame-recente-2">
                                <small data-cy="exame-tipo"><strong>Glicemia</strong></small><br />
                                <small data-cy="exame-data">10/01/2024 - Pendente</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
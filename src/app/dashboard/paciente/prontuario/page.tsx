import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProntuarioPage() {
    const session = await auth();

    if (!session || session.user?.role !== 'paciente') {
        redirect('/login');
    }

    const prontuarioData = {
        paciente: {
            nome: session.user?.name,
            dataNascimento: '15/03/1985',
            tipoSanguineo: 'O+',
            alergias: 'Penicilina, Dipirona',
            contatoEmergencia: 'Maria Santos (mãe) - (11) 99999-8888'
        },
        documentos: [
            {
                id: 1,
                tipo: 'Receita',
                titulo: 'Receita - Losartana 50mg',
                data: '2024-01-10',
                medico: 'Dr. João Silva',
                status: 'Ativa',
                conteudo: 'Losartana 50mg - 1 comprimido ao dia\nMetformina 850mg - 1 comprimido 2x ao dia',
                validade: '2024-04-10'
            },
            {
                id: 2,
                tipo: 'Atestado',
                titulo: 'Atestado Médico - 5 dias',
                data: '2024-01-08',
                medico: 'Dra. Maria Santos',
                status: 'Utilizado',
                conteudo: 'Paciente com diagnóstico de virose. Afastamento por 5 dias.',
                cid: 'A09',
                diasAfastamento: 5
            },
            {
                id: 3,
                tipo: 'Laudo',
                titulo: 'Laudo - Hemograma Completo',
                data: '2024-01-05',
                medico: 'Dr. Carlos Andrade',
                status: 'Normal',
                conteudo: 'Hemograma dentro dos parâmetros normais. Sem alterações significativas.',
                conclusao: 'Exame normal'
            },
            {
                id: 4,
                tipo: 'Receita',
                titulo: 'Receita - Omeprazol 20mg',
                data: '2023-12-20',
                medico: 'Dr. Pedro Almeida',
                status: 'Inativa',
                conteudo: 'Omeprazol 20mg - 1 comprimido ao dia em jejum',
                validade: '2024-03-20'
            }
        ],
        historicoConsultas: [
            {
                id: 1,
                data: '2024-01-10',
                medico: 'Dr. João Silva',
                especialidade: 'Cardiologia',
                diagnostico: 'Hipertensão arterial controlada',
                sintomas: 'Pressão arterial elevada em consulta de rotina',
                prescricao: 'Manter Losartana 50mg'
            },
            {
                id: 2,
                data: '2024-01-08',
                medico: 'Dra. Maria Santos',
                especialidade: 'Clínica Geral',
                diagnostico: 'Virose gastrointestinal',
                sintomas: 'Náuseas, vômitos, febre baixa',
                prescricao: 'Repouso, hidratação, sintomáticos'
            },
            {
                id: 3,
                data: '2023-12-15',
                medico: 'Dr. Carlos Andrade',
                especialidade: 'Endocrinologia',
                diagnostico: 'Diabetes Mellitus tipo 2 controlado',
                sintomas: 'Controle glicêmico em acompanhamento',
                prescricao: 'Manter Metformina 850mg'
            }
        ],
        exames: [
            {
                id: 1,
                tipo: 'Hemograma Completo',
                data: '2024-01-05',
                resultado: 'Normal',
                valores: 'Hemoglobina: 14.2 g/dL, Hematócrito: 42%',
                laboratorio: 'Laboratório Central'
            },
            {
                id: 2,
                tipo: 'Glicemia em Jejum',
                data: '2024-01-05',
                resultado: 'Normal',
                valores: '92 mg/dL (VR: 70-99 mg/dL)',
                laboratorio: 'Laboratório Central'
            },
            {
                id: 3,
                tipo: 'Colesterol Total',
                data: '2023-11-20',
                resultado: 'Elevado',
                valores: '245 mg/dL (VR: < 200 mg/dL)',
                laboratorio: 'LabMed Análises'
            }
        ],
        cirurgias: [
            {
                id: 1,
                procedimento: 'Apendicectomia',
                data: '2018-05-15',
                hospital: 'Hospital Central',
                medico: 'Dr. Roberto Silva'
            },
            {
                id: 2,
                procedimento: 'Colecistectomia',
                data: '2015-08-22',
                hospital: 'Santa Casa',
                medico: 'Dra. Ana Costa'
            }
        ],
        vacinas: [
            {
                id: 1,
                nome: 'Influenza (Gripe)',
                data: '2024-03-01',
                dose: 'Reforço anual',
                local: 'UBS Jardim das Flores'
            },
            {
                id: 2,
                nome: 'COVID-19',
                data: '2023-11-15',
                dose: '4ª dose',
                local: 'Drive-thru Municipal'
            },
            {
                id: 3,
                nome: 'Febre Amarela',
                data: '2022-06-10',
                dose: 'Dose única',
                local: 'Posto de Saúde Central'
            }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="prontuario-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">Meu Prontuário</h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">Histórico médico completo e documentos</p>
                </div>
                <div>
                    <button className="btn btn-outline-primary me-2" data-cy="btn-exportar-pdf">
                        Exportar PDF
                    </button>
                    <button className="btn btn-outline-secondary" data-cy="btn-compartilhar">
                        Compartilhar
                    </button>
                </div>
            </div>
            {/* Sidebar com Dados do Paciente */}
            <div className="row">
                {/* Exames */}
                <div className="col-md-9">
                <div className="card shadow mb-4" data-cy="dados-paciente-card">
                    <div className="card-header bg-primary text-white">
                        <h6 className="mb-0" data-cy="dados-title">Dados Pessoais</h6>
                    </div>
                    <div className="card-body">
                        <p data-cy="paciente-nome"><strong>Nome:</strong> {prontuarioData.paciente.nome}</p>
                        <p data-cy="paciente-nascimento"><strong>Nascimento:</strong> {prontuarioData.paciente.dataNascimento}</p>
                        <p data-cy="paciente-sanguineo"><strong>Tipo Sanguíneo:</strong> {prontuarioData.paciente.tipoSanguineo}</p>
                        <p data-cy="paciente-alergias"><strong>Alergias:</strong> {prontuarioData.paciente.alergias}</p>
                        <p data-cy="paciente-contato"><strong>Contato Emergência:</strong> {prontuarioData.paciente.contatoEmergencia}</p>
                    </div>
                </div>
                </div>
                <div className="col-md-3">

                {/* Navegação Rápida */}
                <div className=" card shadow" data-cy="navegacao-card">
                    <div className="card-header bg-secondary text-white">
                        <h6 className="mb-0" data-cy="navegacao-title">Navegação Rápida</h6>
                    </div>
                    <div className="card-body">
                        <div className="d-grid gap-2">
                            <Link href="#documentos" className="btn btn-outline-primary btn-sm text-start" data-cy="btn-nav-documentos">
                                📄 Documentos
                            </Link>
                            <Link href="#consultas" className="btn btn-outline-primary btn-sm text-start" data-cy="btn-nav-consultas">
                                🏥 Histórico Consultas
                            </Link>
                            <Link href="#exames" className="btn btn-outline-primary btn-sm text-start" data-cy="btn-nav-exames">
                                🔬 Exames
                            </Link>
                            <Link href="#cirurgias" className="btn btn-outline-primary btn-sm text-start" data-cy="btn-nav-cirurgias">
                                🏨 Cirurgias
                            </Link>
                            <Link href="#vacinas" className="btn btn-outline-primary btn-sm text-start" data-cy="btn-nav-vacinas">
                                💉 Vacinas
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div className="row">


                {/* Conteúdo Principal */}
                <div className="col-lg-12">
                    {/* Documentos Digitais */}
                    <div id="documentos" className="card shadow mb-4" data-cy="documentos-section">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0" data-cy="documentos-title">Documentos Digitais</h5>
                            <span className="badge bg-light text-dark" data-cy="documentos-count">
                                {prontuarioData.documentos.length} documentos
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {prontuarioData.documentos.map(documento => (
                                    <div key={documento.id} className="col-md-6 mb-3">
                                        <div className="card h-100" data-cy={`documento-${documento.id}`}>
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="card-title" data-cy="documento-titulo">{documento.titulo}</h6>
                                                    <span className={`badge ${
                                                        documento.tipo === 'Receita' ? 'bg-primary' :
                                                            documento.tipo === 'Atestado' ? 'bg-warning' : 'bg-info'
                                                    }`} data-cy="documento-tipo">
                                                        {documento.tipo}
                                                    </span>
                                                </div>
                                                <p className="card-text small" data-cy="documento-medico">
                                                    <strong>Médico:</strong> {documento.medico}
                                                </p>
                                                <p className="card-text small" data-cy="documento-data">
                                                    <strong>Data:</strong> {documento.data}
                                                </p>
                                                {documento.validade && (
                                                    <p className="card-text small" data-cy="documento-validade">
                                                        <strong>Validade:</strong> {documento.validade}
                                                    </p>
                                                )}
                                                <div className="mt-2">
                                                    <button className="btn btn-sm btn-outline-primary me-1" data-cy="btn-visualizar-documento">
                                                        Visualizar
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-success" data-cy="btn-download-documento">
                                                        Download
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Histórico de Consultas */}
                    <div id="consultas" className="card shadow mb-4" data-cy="consultas-section">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0" data-cy="consultas-title">Histórico de Consultas</h5>
                        </div>
                        <div className="card-body">
                            {prontuarioData.historicoConsultas.map(consulta => (
                                <div key={consulta.id} className="border rounded p-3 mb-3" data-cy={`consulta-${consulta.id}`}>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <strong data-cy="consulta-data">{consulta.data}</strong>
                                            <br />
                                            <span className="badge bg-primary mt-1" data-cy="consulta-especialidade">
                                                {consulta.especialidade}
                                            </span>
                                        </div>
                                        <div className="col-md-9">
                                            <h6 data-cy="consulta-medico">{consulta.medico}</h6>
                                            <p className="mb-1" data-cy="consulta-diagnostico">
                                                <strong>Diagnóstico:</strong> {consulta.diagnostico}
                                            </p>
                                            <p className="mb-1" data-cy="consulta-sintomas">
                                                <strong>Sintomas:</strong> {consulta.sintomas}
                                            </p>
                                            <p className="mb-0" data-cy="consulta-prescricao">
                                                <strong>Prescrição:</strong> {consulta.prescricao}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row">
                        {/* Exames */}
                        <div id="exames" className="col-md-6">
                            <div className="card shadow mb-4" data-cy="exames-section">
                                <div className="card-header bg-warning text-dark">
                                    <h6 className="mb-0" data-cy="exames-title">Últimos Exames</h6>
                                </div>
                                <div className="card-body">
                                    {prontuarioData.exames.map(exame => (
                                        <div key={exame.id} className="border rounded p-2 mb-2" data-cy={`exame-${exame.id}`}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <strong data-cy="exame-tipo">{exame.tipo}</strong>
                                                    <br />
                                                    <small data-cy="exame-data">{exame.data}</small>
                                                    <br />
                                                    <span className={`badge ${
                                                        exame.resultado === 'Normal' ? 'bg-success' : 'bg-danger'
                                                    }`} data-cy="exame-resultado">
                                                        {exame.resultado}
                                                    </span>
                                                </div>
                                                <button className="btn btn-sm btn-outline-primary" data-cy="btn-ver-exame">
                                                    Ver
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cirurgias */}
                        <div id={"cirurgias"} className="col-md-6">
                            <div className="card shadow mb-4" data-cy="cirurgias-section">
                                <div className="card-header bg-danger text-white">
                                    <h6 className="mb-0" data-cy="cirurgias-title">Histórico Cirúrgico</h6>
                                </div>
                                <div className="card-body">
                                    {prontuarioData.cirurgias.map(cirurgia => (
                                        <div key={cirurgia.id} className="border rounded p-2 mb-2" data-cy={`cirurgia-${cirurgia.id}`}>
                                            <strong data-cy="cirurgia-procedimento">{cirurgia.procedimento}</strong>
                                            <br />
                                            <small data-cy="cirurgia-data">{cirurgia.data}</small>
                                            <br />
                                            <small data-cy="cirurgia-medico">{cirurgia.medico}</small>
                                            <br />
                                            <small data-cy="cirurgia-hospital">{cirurgia.hospital}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vacinas */}
                    <div id="vacinas" className="card shadow" data-cy="vacinas-section">
                        <div className="card-header bg-success text-white">
                            <h6 className="mb-0" data-cy="vacinas-title">Carteira de Vacinação</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {prontuarioData.vacinas.map(vacina => (
                                    <div key={vacina.id} className="col-md-4 mb-2">
                                        <div className="border rounded p-2" data-cy={`vacina-${vacina.id}`}>
                                            <strong data-cy="vacina-nome">{vacina.nome}</strong>
                                            <br />
                                            <small data-cy="vacina-data">{vacina.data}</small>
                                            <br />
                                            <small data-cy="vacina-dose">{vacina.dose}</small>
                                            <br />
                                            <small data-cy="vacina-local">{vacina.local}</small>
                                        </div>
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
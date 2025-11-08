// app/dashboard/profissional/prontuarios/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProntuarioIndividualPage() {
    const params = useParams();
    const pacienteId = params.id as string;

    const [abaAtiva, setAbaAtiva] = useState('dados');

    // Dados mockados do prontuário
    const prontuarioData = {
        paciente: {
            id: parseInt(pacienteId),
            nome: 'Carlos Silva',
            idade: 35,
            sexo: 'Masculino',
            cpf: '123.456.789-00',
            dataNascimento: '1989-05-15',
            telefone: '(11) 99999-9999',
            email: 'carlos.silva@email.com',
            endereco: 'Rua das Flores, 123 - São Paulo/SP',
            planoSaude: 'Unimed',
            numeroCarteira: '123456',
            contatoEmergencia: 'Maria Silva (11) 88888-8888'
        },
        dadosClinicos: {
            tipoSanguineo: 'A+',
            alergias: ['Penicilina', 'Dipirona'],
            medicamentos: ['Losartana 50mg - 1x/dia', 'AAS 100mg - 1x/dia'],
            doencasCronicas: ['Hipertensão Arterial'],
            cirurgias: ['Apendicectomia (2010)'],
            historicoFamiliar: 'Pai com hipertensão, mãe com diabetes'
        },
        consultas: [
            {
                id: 1,
                data: '2024-01-15',
                tipo: 'Retorno',
                profissional: 'Dr. Carlos Silva',
                diagnostico: 'Hipertensão arterial controlada',
                prescricoes: ['Manter Losartana 50mg', 'Continuar AAS 100mg']
            },
            {
                id: 2,
                data: '2023-12-10',
                tipo: 'Consulta de Rotina',
                profissional: 'Dr. Carlos Silva',
                diagnostico: 'Hipertensão arterial',
                prescricoes: ['Iniciar Losartana 50mg', 'Iniciar AAS 100mg']
            }
        ],
        exames: [
            {
                id: 1,
                data: '2024-01-10',
                tipo: 'Hemograma Completo',
                resultado: 'Dentro dos parâmetros normais',
                status: 'Normal'
            },
            {
                id: 2,
                data: '2023-12-15',
                tipo: 'Eletrocardiograma',
                resultado: 'Ritmo sinusal, sem alterações',
                status: 'Normal'
            }
        ]
    };

    return (
        <div className="container-fluid py-4" data-cy="prontuario-individual-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">
                        Prontuário - {prontuarioData.paciente.nome}
                    </h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        Histórico clínico completo do paciente
                    </p>
                </div>
                <div>
                    <button className="btn btn-outline-primary me-2" data-cy="btn-exportar-prontuario">
                        📤 Exportar Prontuário
                    </button>
                    <Link
                        href={`/dashboard/profissional/consultas?paciente=${prontuarioData.paciente.id}`}
                        className="btn btn-primary"
                        data-cy="btn-nova-consulta"
                    >
                       Nova Consulta
                    </Link>
                </div>
            </div>

            <div className="row">
                {/* Sidebar - Informações do Paciente */}
                <div className="col-lg-3">
                    <div className="card shadow mb-4" data-cy="info-paciente-card">
                        <div className="card-header bg-primary text-white">
                            <h6 className="mb-0" data-cy="info-paciente-title">Informações do Paciente</h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-3">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center"
                                     style={{width: '80px', height: '80px'}}>
                                    <span className="h4 text-muted" data-cy="avatar-paciente">
                                        {prontuarioData.paciente.nome.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h5 className="mt-2" data-cy="nome-paciente">{prontuarioData.paciente.nome}</h5>
                                <p className="text-muted" data-cy="idade-paciente">
                                    {prontuarioData.paciente.idade} anos
                                </p>
                            </div>

                            <div className="border-top pt-3">
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-cpf">CPF</small>
                                    <br />
                                    <span data-cy="cpf-paciente">{prontuarioData.paciente.cpf}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-nascimento">Data Nasc.</small>
                                    <br />
                                    <span data-cy="nascimento-paciente">
                                        {new Date(prontuarioData.paciente.dataNascimento).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-telefone">Telefone</small>
                                    <br />
                                    <span data-cy="telefone-paciente">{prontuarioData.paciente.telefone}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-plano">Plano de Saúde</small>
                                    <br />
                                    <span data-cy="plano-paciente">{prontuarioData.paciente.planoSaude}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-contato-emergencia">Contato Emergência</small>
                                    <br />
                                    <span data-cy="contato-emergencia">{prontuarioData.paciente.contatoEmergencia}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dados Clínicos Rápidos */}
                    <div className="card shadow" data-cy="dados-clinicos-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="dados-clinicos-title">Dados Clínicos</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-muted" data-cy="label-tipo-sanguineo">Tipo Sanguíneo</small>
                                <br />
                                <span className="badge bg-danger" data-cy="tipo-sanguineo">
                                    {prontuarioData.dadosClinicos.tipoSanguineo}
                                </span>
                            </div>
                            <div className="mb-2">
                                <small className="text-muted" data-cy="label-alergias">Alergias</small>
                                <br />
                                {prontuarioData.dadosClinicos.alergias.map((alergia, index) => (
                                    <span key={index} className="badge bg-warning me-1" data-cy={`alergia-${index}`}>
                                        {alergia}
                                    </span>
                                ))}
                            </div>
                            <div className="mb-2">
                                <small className="text-muted" data-cy="label-doencas-cronicas">Doenças Crônicas</small>
                                <br />
                                {prontuarioData.dadosClinicos.doencasCronicas.map((doenca, index) => (
                                    <span key={index} className="badge bg-secondary me-1" data-cy={`doenca-${index}`}>
                                        {doenca}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="col-lg-9">
                    {/* Abas */}
                    <div className="card shadow" data-cy="abas-prontuario-card">
                        <div className="card-header bg-white">
                            <ul className="nav nav-tabs card-header-tabs" data-cy="abas-navegacao">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'dados' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('dados')}
                                        data-cy="aba-dados"
                                    >
                                        👤 Dados Pessoais
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'consultas' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('consultas')}
                                        data-cy="aba-consultas"
                                    >
                                       Consultas ({prontuarioData.consultas.length})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'exames' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('exames')}
                                        data-cy="aba-exames"
                                    >
                                        🔬 Exames ({prontuarioData.exames.length})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'receitas' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('receitas')}
                                        data-cy="aba-receitas"
                                    >
                                        💊 Receitas
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="card-body">
                            {/* Aba Dados Pessoais */}
                            {abaAtiva === 'dados' && (
                                <div data-cy="conteudo-dados">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card mb-4">
                                                <div className="card-header bg-light">
                                                    <h6 className="mb-0" data-cy="titulo-dados-pessoais">Dados Pessoais</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row mb-2">
                                                        <div className="col-6">
                                                            <small className="text-muted" data-cy="label-endereco">Endereço</small>
                                                            <br />
                                                            <span data-cy="endereco-paciente">{prontuarioData.paciente.endereco}</span>
                                                        </div>
                                                        <div className="col-6">
                                                            <small className="text-muted" data-cy="label-email">Email</small>
                                                            <br />
                                                            <span data-cy="email-paciente">{prontuarioData.paciente.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <small className="text-muted" data-cy="label-plano-completo">Plano de Saúde</small>
                                                            <br />
                                                            <span data-cy="plano-completo">{prontuarioData.paciente.planoSaude}</span>
                                                        </div>
                                                        <div className="col-6">
                                                            <small className="text-muted" data-cy="label-carteira-completo">Nº Carteira</small>
                                                            <br />
                                                            <span data-cy="carteira-completo">{prontuarioData.paciente.numeroCarteira}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="card mb-4">
                                                <div className="card-header bg-light">
                                                    <h6 className="mb-0" data-cy="titulo-dados-clinicos">Dados Clínicos</h6>
                                                </div>
                                                <div className="card-body">
                                                    <div className="mb-3">
                                                        <small className="text-muted" data-cy="label-medicamentos-uso">Medicamentos em Uso</small>
                                                        <br />
                                                        <ul className="mb-0" data-cy="lista-medicamentos">
                                                            {prontuarioData.dadosClinicos.medicamentos.map((med, index) => (
                                                                <li key={index} data-cy={`medicamento-${index}`}>{med}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mb-3">
                                                        <small className="text-muted" data-cy="label-cirurgias">Cirurgias Realizadas</small>
                                                        <br />
                                                        <ul className="mb-0" data-cy="lista-cirurgias">
                                                            {prontuarioData.dadosClinicos.cirurgias.map((cirurgia, index) => (
                                                                <li key={index} data-cy={`cirurgia-${index}`}>{cirurgia}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <small className="text-muted" data-cy="label-historico-familiar">Histórico Familiar</small>
                                                        <br />
                                                        <span data-cy="historico-familiar">{prontuarioData.dadosClinicos.historicoFamiliar}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Aba Consultas */}
                            {abaAtiva === 'consultas' && (
                                <div data-cy="conteudo-consultas">
                                    {prontuarioData.consultas.map(consulta => (
                                        <div key={consulta.id} className="card mb-3" data-cy={`consulta-${consulta.id}`}>
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong data-cy="consulta-data">
                                                        {new Date(consulta.data).toLocaleDateString('pt-BR')}
                                                    </strong>
                                                    <span className="badge bg-primary ms-2" data-cy="consulta-tipo">
                                                        {consulta.tipo}
                                                    </span>
                                                </div>
                                                <small className="text-muted" data-cy="consulta-profissional">
                                                    {consulta.profissional}
                                                </small>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <small className="text-muted" data-cy="label-diagnostico">Diagnóstico</small>
                                                    <br />
                                                    <span data-cy="consulta-diagnostico">{consulta.diagnostico}</span>
                                                </div>
                                                <div>
                                                    <small className="text-muted" data-cy="label-prescricoes">Prescrições</small>
                                                    <br />
                                                    <ul className="mb-0" data-cy="lista-prescricoes">
                                                        {consulta.prescricoes.map((prescricao, index) => (
                                                            <li key={index} data-cy={`prescricao-${index}`}>{prescricao}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-transparent">
                                                <Link
                                                    href={`/dashboard/profissional/consultas/${consulta.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                    data-cy="btn-ver-detalhes-consulta"
                                                >
                                                    Ver Detalhes
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Aba Exames */}
                            {abaAtiva === 'exames' && (
                                <div data-cy="conteudo-exames">
                                    {prontuarioData.exames.map(exame => (
                                        <div key={exame.id} className="card mb-3" data-cy={`exame-${exame.id}`}>
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong data-cy="exame-data">
                                                        {new Date(exame.data).toLocaleDateString('pt-BR')}
                                                    </strong>
                                                    <span className="badge bg-info ms-2" data-cy="exame-tipo">
                                                        {exame.tipo}
                                                    </span>
                                                </div>
                                                <span className={`badge ${
                                                    exame.status === 'Normal' ? 'bg-success' : 'bg-warning'
                                                }`} data-cy="exame-status">
                                                    {exame.status}
                                                </span>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-2">
                                                    <small className="text-muted" data-cy="label-resultado">Resultado</small>
                                                    <br />
                                                    <span data-cy="exame-resultado">{exame.resultado}</span>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-transparent">
                                                <button className="btn btn-sm btn-outline-primary" data-cy="btn-ver-exame-completo">
                                                    Ver Exame Completo
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Aba Receitas */}
                            {abaAtiva === 'receitas' && (
                                <div data-cy="conteudo-receitas">
                                    <div className="alert alert-info" data-cy="alert-receitas">
                                        <i className="fas fa-info-circle me-2"></i>
                                        As receitas digitais emitidas nas consultas serão exibidas aqui.
                                    </div>
                                    <p className="text-muted" data-cy="texto-receitas">
                                        Nenhuma receita digital encontrada para este paciente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
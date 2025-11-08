// app/dashboard/profissional/consultas/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConsultaAtivaPage() {
    const params = useParams();
    const router = useRouter();
    const consultaId = params.id as string;

    const [abaAtiva, setAbaAtiva] = useState('prontuario');
    const [prontuario, setProntuario] = useState({
        queixaPrincipal: '',
        historiaDoencaAtual: '',
        antecedentes: '',
        exameFisico: '',
        hipotesesDiagnosticas: '',
        conduta: '',
        observacoes: ''
    });
    const [documentos, setDocumentos] = useState<any[]>([]);

    // Dados mockados da consulta
    const consultaData = {
        id: parseInt(consultaId),
        data: '2024-01-16',
        hora: '14:00',
        paciente: {
            id: 1,
            nome: 'João Santos',
            idade: 45,
            sexo: 'Masculino',
            cpf: '123.456.789-00',
            telefone: '(11) 99999-9999',
            email: 'joao.santos@email.com',
            planoSaude: 'Unimed',
            numeroCarteira: '123456'
        },
        tipo: 'Acompanhamento',
        status: 'Em Andamento',
        modalidade: 'Presencial',
        profissional: 'Dr. Carlos Silva',
        especialidade: 'Cardiologia'
    };

    const handleProntuarioChange = (campo: string, valor: string) => {
        setProntuario(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const adicionarDocumento = (tipo: string) => {
        const novoDocumento = {
            id: documentos.length + 1,
            tipo,
            dataCriacao: new Date().toISOString(),
            status: 'Rascunho'
        };
        setDocumentos(prev => [...prev, novoDocumento]);
    };

    const finalizarConsulta = () => {
        // Lógica para finalizar consulta
        console.log('Consulta finalizada:', { prontuario, documentos });
        router.push('/dashboard/profissional/agenda');
    };

    const salvarRascunho = () => {
        // Lógica para salvar rascunho
        console.log('Rascunho salvo:', { prontuario, documentos });
    };

    return (
        <div className="container-fluid py-4" data-cy="consulta-ativa-page">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary" data-cy="page-title">
                        Consulta - {consultaData.paciente.nome}
                    </h1>
                    <p className="text-muted mb-0" data-cy="page-subtitle">
                        {consultaData.data} às {consultaData.hora} • {consultaData.tipo} • {consultaData.modalidade}
                    </p>
                </div>
                <div className="btn-group">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={salvarRascunho}
                        data-cy="btn-salvar-rascunho"
                    >
                        Salvar Rascunho
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={finalizarConsulta}
                        data-cy="btn-finalizar-consulta"
                    >
                        Finalizar Consulta
                    </button>
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
                                        {consultaData.paciente.nome.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h5 className="mt-2" data-cy="nome-paciente">{consultaData.paciente.nome}</h5>
                                <p className="text-muted" data-cy="idade-sexo">
                                    {consultaData.paciente.idade} anos, {consultaData.paciente.sexo}
                                </p>
                            </div>

                            <div className="border-top pt-3">
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-cpf">CPF</small>
                                    <br />
                                    <span data-cy="cpf-paciente">{consultaData.paciente.cpf}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-telefone">Telefone</small>
                                    <br />
                                    <span data-cy="telefone-paciente">{consultaData.paciente.telefone}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-plano">Plano de Saúde</small>
                                    <br />
                                    <span data-cy="plano-paciente">{consultaData.paciente.planoSaude}</span>
                                </div>
                                <div className="mb-2">
                                    <small className="text-muted" data-cy="label-carteira">Nº Carteira</small>
                                    <br />
                                    <span data-cy="carteira-paciente">{consultaData.paciente.numeroCarteira}</span>
                                </div>
                            </div>

                            <div className="mt-3">
                                <Link
                                    href={`/dashboard/profissional/pacientes/${consultaData.paciente.id}`}
                                    className="btn btn-outline-primary btn-sm w-100"
                                    data-cy="btn-prontuario-completo"
                                >
                                    Prontuário Completo
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Ações Rápidas */}
                    <div className="card shadow" data-cy="acoes-rapidas-card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0" data-cy="acoes-title">Documentos</h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-outline-primary text-start"
                                    onClick={() => adicionarDocumento('receita')}
                                    data-cy="btn-nova-receita"
                                >
                                    Receita Digital
                                </button>
                                <button
                                    className="btn btn-outline-success text-start"
                                    onClick={() => adicionarDocumento('atestado')}
                                    data-cy="btn-novo-atestado"
                                >
                                    Atestado Médico
                                </button>
                                <button
                                    className="btn btn-outline-info text-start"
                                    onClick={() => adicionarDocumento('solicitacao-exame')}
                                    data-cy="btn-solicitar-exame"
                                >
                                    Solicitar Exame
                                </button>
                                <button
                                    className="btn btn-outline-warning text-start"
                                    onClick={() => adicionarDocumento('encaminhamento')}
                                    data-cy="btn-encaminhamento"
                                >
                                    Encaminhamento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="col-lg-9">
                    {/* Abas */}
                    <div className="card shadow mb-4" data-cy="abas-card">
                        <div className="card-header bg-white">
                            <ul className="nav nav-tabs card-header-tabs" data-cy="abas-navegacao">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'prontuario' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('prontuario')}
                                        data-cy="aba-prontuario"
                                    >
                                        Prontuário
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'documentos' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('documentos')}
                                        data-cy="aba-documentos"
                                    >
                                        Documentos ({documentos.length})
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${abaAtiva === 'historico' ? 'active' : ''}`}
                                        onClick={() => setAbaAtiva('historico')}
                                        data-cy="aba-historico"
                                    >
                                        Histórico
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="card-body">
                            {/* Aba Prontuário */}
                            {abaAtiva === 'prontuario' && (
                                <div data-cy="conteudo-prontuario">
                                    <form>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-queixa">
                                                    Queixa Principal *
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={prontuario.queixaPrincipal}
                                                    onChange={(e) => handleProntuarioChange('queixaPrincipal', e.target.value)}
                                                    placeholder="Descreva a queixa principal do paciente..."
                                                    data-cy="input-queixa"
                                                    required
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-historia">
                                                    História da Doença Atual (HDA)
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    value={prontuario.historiaDoencaAtual}
                                                    onChange={(e) => handleProntuarioChange('historiaDoencaAtual', e.target.value)}
                                                    placeholder="Descreva a história da doença atual..."
                                                    data-cy="input-historia"
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-antecedentes">
                                                    Antecedentes Pessoais e Familiares
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={prontuario.antecedentes}
                                                    onChange={(e) => handleProntuarioChange('antecedentes', e.target.value)}
                                                    placeholder="Antecedentes relevantes..."
                                                    data-cy="input-antecedentes"
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-exame-fisico">
                                                    Exame Físico
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    value={prontuario.exameFisico}
                                                    onChange={(e) => handleProntuarioChange('exameFisico', e.target.value)}
                                                    placeholder="Achados do exame físico..."
                                                    data-cy="input-exame-fisico"
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-hipoteses">
                                                    Hipóteses Diagnósticas
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={3}
                                                    value={prontuario.hipotesesDiagnosticas}
                                                    onChange={(e) => handleProntuarioChange('hipotesesDiagnosticas', e.target.value)}
                                                    placeholder="Hipóteses diagnósticas..."
                                                    data-cy="input-hipoteses"
                                                />
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label" data-cy="label-conduta">
                                                    Conduta e Tratamento
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    value={prontuario.conduta}
                                                    onChange={(e) => handleProntuarioChange('conduta', e.target.value)}
                                                    placeholder="Conduta adotada e tratamento prescrito..."
                                                    data-cy="input-conduta"
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label className="form-label" data-cy="label-observacoes">
                                                    Observações Adicionais
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    value={prontuario.observacoes}
                                                    onChange={(e) => handleProntuarioChange('observacoes', e.target.value)}
                                                    placeholder="Observações adicionais..."
                                                    data-cy="input-observacoes"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Aba Documentos */}
                            {abaAtiva === 'documentos' && (
                                <div data-cy="conteudo-documentos">
                                    {documentos.length === 0 ? (
                                        <div className="text-center py-5" data-cy="sem-documentos">
                                            <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                                            <h5 className="text-muted">Nenhum documento gerado</h5>
                                            <p className="text-muted">
                                                Utilize os botões da sidebar para adicionar documentos à consulta.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="row" data-cy="lista-documentos">
                                            {documentos.map(documento => (
                                                <div key={documento.id} className="col-md-6 mb-3">
                                                    <div className="card border" data-cy={`documento-${documento.id}`}>
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <h6 className="card-title" data-cy="documento-tipo">
                                                                        {documento.tipo === 'receita' && 'Receita Digital'}
                                                                        {documento.tipo === 'atestado' && 'Atestado Médico'}
                                                                        {documento.tipo === 'solicitacao-exame' && 'Solicitação de Exame'}
                                                                        {documento.tipo === 'encaminhamento' && 'Encaminhamento'}
                                                                    </h6>
                                                                    <small className="text-muted" data-cy="documento-data">
                                                                        Criado em {new Date(documento.dataCriacao).toLocaleString('pt-BR')}
                                                                    </small>
                                                                    <br />
                                                                    <span className={`badge ${
                                                                        documento.status === 'Rascunho' ? 'bg-warning' : 'bg-success'
                                                                    }`} data-cy="documento-status">
                                                                        {documento.status}
                                                                    </span>
                                                                </div>
                                                                <div className="btn-group">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        data-cy="btn-editar-documento"
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-success"
                                                                        data-cy="btn-assinar-documento"
                                                                    >
                                                                        Assinar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Aba Histórico */}
                            {abaAtiva === 'historico' && (
                                <div data-cy="conteudo-historico">
                                    <div className="alert alert-info" data-cy="alert-historico">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Esta aba mostrará o histórico completo do paciente, incluindo consultas anteriores,
                                        exames, medicamentos e outros dados relevantes.
                                    </div>
                                    <p className="text-muted" data-cy="texto-historico">
                                        O histórico completo do paciente será carregado aqui...
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
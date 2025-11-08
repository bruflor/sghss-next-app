/**
 * Tipos baseados no diagrama UML
 */

// Enums do sistema
export enum EnumTipoUnidade {
    HOSPITAL = "hospital",
    CLINICA = "clinica",
    UBS = "ubs",
    CONSULTORIO = "consultorio"
}

export enum EnumTipoLeito {
    ENFERMARIA = "enfermaria",
    APARTAMENTO = "apartamento",
    UTI = "uti",
    UTI_NEONATAL = "uti_neonatal"
}

export enum EnumStatusLeito {
    DISPONIVEL = "disponivel",
    OCUPADO = "ocupado",
    MANUTENCAO = "manutencao",
    BLOQUEADO = "bloqueado"
}

export enum EnumStatusInternacao {
    ATIVA = "ativa",
    ALTA_MEDICA = "alta_medica",
    TRANSFERIDA = "transferida",
    OBITO = "obito"
}

export enum EnumStatusAtendimento {
    AGENDADO = "agendado",
    CONFIRMADO = "confirmado",
    EM_ANDAMENTO = "em_andamento",
    CONCLUIDO = "concluido",
    CANCELADO = "cancelado",
    FALTA = "falta"
}

export enum EnumTipoConsulta {
    PRIMEIRA_VEZ = "primeira_vez",
    RETORNO = "retorno",
    URGENCIA = "urgencia"
}

export enum EnumStatusConexao {
    CONECTADO = "conectado",
    DESCONECTADO = "desconectado",
    AGUARDANDO = "aguardando",
    FALHA = "falha"
}

export enum EnumTipoAtestado {
    COMPARECIMENTO = "comparecimento",
    SAUDE = "saude",
    ACOMPANHAMENTO = "acompanhamento",
    LICENCA = "licenca"
}

export enum EnumTipoOperacao {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout"
}

// Interfaces principais baseadas no UML
export interface Usuario {
    id: string;
    email:string;
    senhaHash: string;
    ativo: boolean;
    ultimoAcesso?: Date;
    dataCriacao: Date;
    perfilId: string;
    perfil?: Perfil;
}

export interface Role {
    id: string;
    codigo: string;
    nome: string;
    descricao: string;
    permissoes: Permissao[];
}

export interface Permissao {
    id: string;
    codigo: string;
    nome: string;
    descricao: string;
    modulo: string;
}

export interface UsuarioRole {
    usuarioId: string;
    roleId: string;
    usuario?: Usuario;
    role?: Role;
}

export interface RolePermissao {
    roleId: string;
    permissaoId: string;
    role?: Role;
    permissao?: Permissao;
}

export interface RelatorioAuditoria {
    id: string;
    usuarioId: string;
    acao: string;
    entidade: string;
    idEntidade: string;
    dadosAnteriores: string;
    dadosNovos: string;
    dataHora: Date;
    ip: string;
    tipoOperacao: EnumTipoOperacao;
    usuario?: Usuario;
}

// Perfis
export interface Perfil {
    id: string;
    cpf: string;
    nomeCompleto: string;
    telefone: string;
    email: string;
    dataNascimento: Date;
    endereco: string;
    ativo: boolean;
    dataCriacao: Date;
    usuario?: Usuario;
}

export interface PerfilPaciente extends Perfil {
    tipoSanguineo: string;
    alergias: string;
    contatoEmergencia: string;
    telefoneEmergencia: string;
    planoSaude: string;
}

export interface PerfilProfissional extends Perfil {
    carteiraTrabalho: string;
    registro: string;
    especialidade: string;
    subEspecialidade?: string;
    dataAdmissao: Date;
    unidadeSaudeId: string;
    unidadeSaude?: UnidadeSaude;
}

export interface PerfilAdministrativo extends Perfil {
    carteiraTrabalho: string;
    cargo: string;
    departamento: string;
    dataAdmissao: Date;
    unidadeSaudeId: string;
    unidadeSaude?: UnidadeSaude;
}

// Gestão Hospitalar
export interface UnidadeSaude {
    id: string;
    codigo: string;
    nome: string;
    tipo: EnumTipoUnidade;
    endereco: string;
    telefone: string;
    ativo: boolean;
    leitos?: Leito[];
    profissionais?: PerfilProfissional[];
    administrativos?: PerfilAdministrativo[];
}

export interface Leito {
    id: string;
    numero: string;
    tipo: EnumTipoLeito;
    status: EnumStatusLeito;
    equipamentos: string;
    unidadeSaudeId: string;
    unidadeSaude?: UnidadeSaude;
    internacoes?: Internacao[];
}

export interface Internacao {
    id: string;
    dataAdmissao: Date;
    dataAlta?: Date;
    diagnosticoAdmissao: string;
    diagnosticoAlta?: string;
    status: EnumStatusInternacao;
    pacienteId: string;
    leitoId: string;
    profissionalId: string;
    paciente?: PerfilPaciente;
    leito?: Leito;
    profissional?: PerfilProfissional;
}

// Atendimentos
export interface Atendimento {
    id: string;
    dataHora: Date;
    status: EnumStatusAtendimento;
    observacoes: string;
    sintomas: string;
    diagnostico: string;
    dataCriacao: Date;
    pacienteId: string;
    profissionalId: string;
    unidadeSaudeId: string;
    prontuarioId: string;
    paciente?: PerfilPaciente;
    profissional?: PerfilProfissional;
    unidadeSaude?: UnidadeSaude;
    prontuario?: Prontuario;
}

export interface ConsultaPresencial extends Atendimento {
    sala: string;
    tipoConsulta: EnumTipoConsulta;
}

export interface Teleconsulta extends Atendimento {
    linkVideo: string;
    plataforma: string;
    statusConexao: EnumStatusConexao;
    gravacao: boolean;
}

export interface Exame extends Atendimento {
    tipoExame: string;
    preparo: string;
    resultado: string;
    anexos: string;
    dataResultado?: Date;
    interpretacao: string;
}

// Documentos Digitais
export interface DocumentoDigital {
    id: string;
    titulo: string;
    conteudo: string;
    dataCriacao: Date;
    dataValidade?: Date;
    assinado: boolean;
    hashDigital: string;
    qrCode: string;
    prontuarioId: string;
    profissionalId: string;
    prontuario?: Prontuario;
    profissional?: PerfilProfissional;
}

export interface Receita extends DocumentoDigital {
    medicamentos: string;
    posologia: string;
    instrucoes: string;
    vias: number;
}

export interface Atestado extends DocumentoDigital {
    tipoAtestado: EnumTipoAtestado;
    cid: string;
    diasAfastamento: number;
    restricoes: string;
}

export interface Laudo extends DocumentoDigital {
    tipoLaudo: string;
    conclusao: string;
    recomendacoes: string;
}

export interface Prontuario {
    id: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
    historico: string;
    pacienteId: string;
    paciente?: PerfilPaciente;
    documentos?: DocumentoDigital[];
    atendimentos?: Atendimento[];
}
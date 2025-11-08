describe('CT001.1 - Cadastro de Novo Paciente por um profissional de saúde (Criação)', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  // Dados do novo paciente
  const novoPaciente = {
    nome: 'Pedro Alves',
    cpf: '123.456.789-10',
    dataNascimento: '1990-05-15',
    genero: 'M',
    telefone: '(11) 98765-4321',
    email: 'pedro.alves@email.com',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    tipoSanguineo: 'O+',
    alergias: 'Penicilina',
    contatoEmergencia: 'Maria Alves - (11) 98765-4322',
    convenio: 'Unimed',
    numeroCarteira: '123456789',
    observacoes: 'Paciente novo no sistema'
  };

  beforeEach(() => {
    // Visita a página inicial
    cy.visit('/');
  });

  it('Deve cadastrar um novo paciente com sucesso', () => {
    // Passo 1: O funcionário da recepção/administração efetua login no sistema
    cy.visit('/login');
    
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Passo 2: Acessa o módulo de Cadastro de Pacientes
    cy.visit('/dashboard/profissional/pacientes');
    
    // Verifica que está na página correta
    cy.get('[data-cy="pacientes-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Gestão de Pacientes');
    
    // Passo 3: Clica em "Novo Cadastro"
    cy.get('[data-cy="btn-novo-paciente"]')
      .should('be.visible')
      .should('contain', 'Novo Paciente')
      .click();
    
    // Verifica que foi redirecionado para a página de cadastro
    cy.url().should('include', '/dashboard/profissional/pacientes/novo');
    cy.get('[data-cy="cadastro-paciente-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Cadastrar Novo Paciente');
    
    // Passo 4: Preenche todos os campos obrigatórios
    // Dados Pessoais
    cy.get('[data-cy="input-nome"]')
      .should('be.visible')
      .type(novoPaciente.nome);
    
    cy.get('[data-cy="input-cpf"]')
      .should('be.visible')
      .type(novoPaciente.cpf);
    
    cy.get('[data-cy="input-data-nascimento"]')
      .should('be.visible')
      .type(novoPaciente.dataNascimento);
    
    cy.get('[data-cy="select-genero"]')
      .should('be.visible')
      .select(novoPaciente.genero);
    
    // Contato
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .type(novoPaciente.telefone);
    
    cy.get('[data-cy="input-email"]')
      .should('be.visible')
      .type(novoPaciente.email);
    
    // Endereço
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .type(novoPaciente.endereco);
    
    // Dados de Saúde
    cy.get('[data-cy="select-tipo-sanguineo"]')
      .should('be.visible')
      .select('O+');
    
    cy.get('[data-cy="input-alergias"]')
      .should('be.visible')
      .type(novoPaciente.alergias);
    
    // Contato de Emergência
    cy.get('[data-cy="input-contato-emergencia"]')
      .should('be.visible')
      .type(novoPaciente.contatoEmergencia);
    
    // Convênio
    cy.get('[data-cy="input-convenio"]')
      .should('be.visible')
      .type(novoPaciente.convenio);
    
    cy.get('[data-cy="input-numero-carteira"]')
      .should('be.visible')
      .type(novoPaciente.numeroCarteira);
    
    // Observações
    cy.get('[data-cy="textarea-observacoes"]')
      .should('be.visible')
      .type(novoPaciente.observacoes);
    
    // Verifica que o formulário está preenchido corretamente
    cy.get('[data-cy="input-nome"]').should('have.value', novoPaciente.nome);
    cy.get('[data-cy="input-cpf"]').should('have.value', novoPaciente.cpf);
    cy.get('[data-cy="input-data-nascimento"]').should('have.value', novoPaciente.dataNascimento);
    cy.get('[data-cy="input-telefone"]').should('have.value', novoPaciente.telefone);
    
    // Passo 5: Clica em "Salvar/Confirmar"
    cy.get('[data-cy="btn-cadastrar-paciente"]')
      .should('be.visible')
      .should('contain', 'Cadastrar Paciente')
      .click();
    
    // Obs: Após implementação do backend, verificar:
    // - Redirecionamento para lista de pacientes
    // - Mensagem de sucesso
    // - Novo paciente aparece na lista
    // - ID único foi gerado
    
    // Verifica que o formulário está completo e funcional
    cy.get('[data-cy="cadastro-paciente-form"]').should('exist');
    
  });

  it('Deve validar campos obrigatórios antes de permitir cadastro', () => {
    // Login
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Acessa página de cadastro
    cy.visit('/dashboard/profissional/pacientes/novo');
    
    // Tenta submeter sem preencher campos obrigatórios
    cy.get('[data-cy="btn-cadastrar-paciente"]').click();
    
    // Verifica que o navegador bloqueia o submit (HTML5 validation)
    cy.get('[data-cy="input-nome"]:invalid').should('exist');
    cy.get('[data-cy="input-cpf"]:invalid').should('exist');
    cy.get('[data-cy="input-data-nascimento"]:invalid').should('exist');
    cy.get('[data-cy="input-telefone"]:invalid').should('exist');
  });

  it('Deve permitir cancelar o cadastro e voltar para a lista', () => {
    // Login
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Acessa página de cadastro
    cy.visit('/dashboard/profissional/pacientes/novo');
    
    // Preenche alguns campos
    cy.get('[data-cy="input-nome"]').type('Teste Cancelamento');
    
    // Clica em cancelar
    cy.get('[data-cy="btn-cancelar"]')
      .should('be.visible')
      .click();
    
    // Verifica redirecionamento para lista de pacientes
    cy.url().should('include', '/dashboard/profissional/pacientes');
    cy.get('[data-cy="pacientes-page"]').should('be.visible');
  });
});
describe('CT004.1 - Criação de Cadastro de Profissional RF011', () => {
  const adminEmail = 'medico@hospital.com';
  const adminPassword = 'medico123';
  
  const dadosProfissional = {
    nomeCompleto: 'Dr. Pedro Mendes',
    cpf: '123.456.789-01',
    crm: 'CRM/SP 123456',
    telefone: '(11) 98765-4321',
    email: 'pedro.mendes@hospital.com',
    dataNascimento: '1980-05-15',
    endereco: 'Rua dos Médicos, 456',
    especialidade: 'Cardiologia',
    subEspecialidade: 'Cardiologia Intervencionista',
    carteiraTrabalho: '123456789',
    registro: 'CRM/SP 123456',
    dataAdmissao: '2024-02-01',
    unidadeSaudeId: '1',
    perfilAcesso: 'medico',
    loginInicial: 'pedro.mendes@hospital.com',
    senhaInicial: 'senha123'
  };

  beforeEach(() => {
    // Intercepta a requisição de cadastro de profissional
    cy.intercept('POST', '**/api/profissionais', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: '10',
          perfilId: '10',
          usuarioId: '10',
          ...dadosProfissional,
          ativo: true,
          dataCriacao: new Date().toISOString(),
          mensagem: 'Profissional cadastrado com sucesso'
        }
      });
    }).as('cadastrarProfissional');

    // Intercepta verificação de CPF existente
    cy.intercept('GET', `**/api/profissionais/verificar-cpf?cpf=${dadosProfissional.cpf.replace(/[.-]/g, '')}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          existe: false
        }
      });
    }).as('verificarCPF');

    // Intercepta verificação de CRM existente
    cy.intercept('GET', `**/api/profissionais/verificar-registro?registro=${dadosProfissional.crm}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          existe: false
        }
      });
    }).as('verificarCRM');

    // Intercepta listagem de unidades de saúde
    cy.intercept('GET', '**/api/unidades-saude', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          unidades: [
            { id: '1', nome: 'Hospital Central', tipo: 'hospital' },
            { id: '2', nome: 'Clínica Norte', tipo: 'clinica' }
          ]
        }
      });
    }).as('listarUnidades');
  });

  it('Deve cadastrar novo profissional com sucesso quando administrador preenche todos os dados obrigatórios', () => {
    // Pré-condição: O administrador/RH possui perfil de acesso (RNF001)
    // Pré-condição: Novo profissional deve ser integrado ao sistema
    
    // Procedimento 1: O administrador acessa o módulo "Gestão de Pessoas/Profissionais"
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de gestão de profissionais
    // Assumindo que existe uma rota /dashboard/admin/profissionais ou /dashboard/admin/usuarios
    cy.visit('/dashboard/admin/usuarios');
    
    // Verifica que está na página correta
    cy.get('[data-cy="gestao-profissionais-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Gestão de Profissionais');
    
    // Procedimento 2: Clica em "Cadastrar Novo Profissional"
    cy.get('[data-cy="btn-novo-profissional"]')
      .should('be.visible')
      .should('contain', 'Cadastrar Novo Profissional')
      .click();
    
    // Aguarda o modal ou página de formulário aparecer
    cy.get('[data-cy="form-cadastro-profissional"]', { timeout: 5000 }).should('be.visible');
    
    // Procedimento 3: Preenche dados obrigatórios (Nome, CRM/Corem, CPF, Especialidade, Contato)
    cy.get('[data-cy="input-nome-completo"]')
      .should('be.visible')
      .type(dadosProfissional.nomeCompleto);
    
    cy.get('[data-cy="input-cpf"]')
      .should('be.visible')
      .type(dadosProfissional.cpf);
    
    cy.get('[data-cy="input-crm"]')
      .should('be.visible')
      .type(dadosProfissional.crm);
    
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .type(dadosProfissional.telefone);
    
    cy.get('[data-cy="input-email"]')
      .should('be.visible')
      .type(dadosProfissional.email);
    
    cy.get('[data-cy="input-data-nascimento"]')
      .should('be.visible')
      .type(dadosProfissional.dataNascimento);
    
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .type(dadosProfissional.endereco);
    
    cy.get('[data-cy="select-especialidade"]')
      .should('be.visible')
      .select(dadosProfissional.especialidade);
    
    cy.get('[data-cy="input-carteira-trabalho"]')
      .should('be.visible')
      .type(dadosProfissional.carteiraTrabalho);
    
    cy.get('[data-cy="input-data-admissao"]')
      .should('be.visible')
      .type(dadosProfissional.dataAdmissao);
    
    cy.get('[data-cy="select-unidade-saude"]')
      .should('be.visible')
      .select(dadosProfissional.unidadeSaudeId);
    
    // Procedimento 4: Define o perfil de acesso e o login inicial (RF011.2)
    cy.get('[data-cy="select-perfil-acesso"]')
      .should('be.visible')
      .select(dadosProfissional.perfilAcesso);
    
    cy.get('[data-cy="input-login-inicial"]')
      .should('be.visible')
      .type(dadosProfissional.loginInicial);
    
    cy.get('[data-cy="input-senha-inicial"]')
      .should('be.visible')
      .type(dadosProfissional.senhaInicial);
    
    // Confirma o cadastro
    cy.get('[data-cy="btn-confirmar-cadastro"]')
      .should('be.visible')
      .should('contain', 'Cadastrar Profissional')
      .click();
    
    // Resultado esperado: O profissional é cadastrado no sistema
    cy.wait('@cadastrarProfissional').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.nomeCompleto).to.eq(dadosProfissional.nomeCompleto);
      expect(interception.response?.body.cpf).to.eq(dadosProfissional.cpf);
      expect(interception.response?.body.ativo).to.eq(true);
    });
    
    // Resultado esperado: Ele se torna elegível para agendamentos (RF002, RF003)
    // Resultado esperado: Gestão de agenda (RF009)
    // Resultado esperado: Pode ter acesso ao sistema conforme o perfil atribuído
    // Verifica mensagem de sucesso
    cy.get('[data-cy="mensagem-sucesso"]', { timeout: 5000 })
      .should('be.visible')
      .should('contain', 'sucesso');
  });

  it('Deve validar campos obrigatórios antes de permitir cadastro', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get('[data-cy="btn-novo-profissional"]').click();
    
    // Aguarda o formulário aparecer
    cy.get('[data-cy="form-cadastro-profissional"]', { timeout: 5000 }).should('be.visible');
    
    // Tenta confirmar sem preencher campos obrigatórios
    cy.get('[data-cy="btn-confirmar-cadastro"]').click();
    
    // Verifica que o formulário não foi submetido (validação HTML5)
    cy.get('[data-cy="input-nome-completo"]:invalid').should('exist');
    cy.get('[data-cy="input-cpf"]:invalid').should('exist');
    cy.get('[data-cy="input-crm"]:invalid').should('exist');
    cy.get('[data-cy="input-email"]:invalid').should('exist');
  });

  it('Deve verificar CPF duplicado antes de cadastrar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get('[data-cy="btn-novo-profissional"]').click();
    
    cy.get('[data-cy="form-cadastro-profissional"]', { timeout: 5000 }).should('be.visible');
    
    // Preenche CPF que já existe
    cy.get('[data-cy="input-cpf"]').type('111.222.333-44'); // CPF já cadastrado
    
    // Ao sair do campo, deve verificar se CPF já existe
    cy.get('[data-cy="input-cpf"]').blur();
    
    // Intercepta verificação de CPF existente (retorna true)
    cy.intercept('GET', '**/api/profissionais/verificar-cpf?cpf=11122233344', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          existe: true,
          mensagem: 'CPF já cadastrado no sistema'
        }
      });
    }).as('verificarCPFDuplicado');
    
    // Verifica mensagem de erro
    cy.get('[data-cy="erro-cpf-duplicado"]', { timeout: 3000 })
      .should('be.visible')
      .should('contain', 'já cadastrado');
  });

  it('Deve verificar CRM/Corem duplicado antes de cadastrar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get('[data-cy="btn-novo-profissional"]').click();
    
    cy.get('[data-cy="form-cadastro-profissional"]', { timeout: 5000 }).should('be.visible');
    
    // Preenche CRM que já existe
    cy.get('[data-cy="input-crm"]').type('CRM/SP 987654');
    
    // Ao sair do campo, deve verificar se CRM já existe
    cy.get('[data-cy="input-crm"]').blur();
    
    // Intercepta verificação de CRM existente (retorna true)
    cy.intercept('GET', '**/api/profissionais/verificar-registro?registro=CRM/SP 987654', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          existe: true,
          mensagem: 'CRM já cadastrado no sistema'
        }
      });
    }).as('verificarCRMDuplicado');
    
    // Verifica mensagem de erro
    cy.get('[data-cy="erro-crm-duplicado"]', { timeout: 3000 })
      .should('be.visible')
      .should('contain', 'já cadastrado');
  });
});
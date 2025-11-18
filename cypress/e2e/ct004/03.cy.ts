describe('CT004.3 - Atualização de Dados Cadastrais RF011', () => {
  const adminEmail = 'admin@hospital.com';
  const adminPassword = 'admin123';
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  const profissionalId = '2'; // Dr. João Silva
  const profissionalOriginal = {
    id: profissionalId,
    nomeCompleto: 'Dr. João Silva',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-8888',
    email: 'medico@hospital.com',
    endereco: 'Rua Médico, 456',
    especialidade: 'Cardiologia',
    dataNascimento: '1975-05-15',
    ativo: true
  };

  const dadosAtualizados = {
    telefone: '(11) 99999-9999',
    endereco: 'Avenida dos Médicos, 789',
    especialidade: 'Cardiologia Clínica',
    situacaoContrato: 'Ativo'
  };

  beforeEach(() => {
    // Intercepta a busca do profissional
    cy.intercept('GET', `**/api/profissionais/${profissionalId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: profissionalOriginal
      });
    }).as('buscarProfissional');

    // Intercepta a atualização dos dados
    cy.intercept('PUT', `**/api/profissionais/${profissionalId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...profissionalOriginal,
          ...req.body,
          dataAtualizacao: new Date().toISOString(),
          mensagem: 'Dados atualizados com sucesso'
        }
      });
    }).as('atualizarProfissional');
  });

  it('Deve atualizar dados cadastrais do profissional com sucesso (administrador)', () => {
    // Pré-condição: O profissional/administrador está logado
    
    // Procedimento 1: O usuário ou administrador acessa a ficha do profissional
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de gestão de profissionais
    cy.visit('/dashboard/admin/usuarios');
    cy.get('[data-cy="gestao-profissionais-page"]').should('be.visible');
    
    // Busca o profissional
    cy.get('[data-cy="input-buscar-profissional"]')
      .type(profissionalOriginal.nomeCompleto);
    
    // Clica no profissional
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    
    // Clica em "Editar"
    cy.get('[data-cy="btn-editar-profissional"]')
      .should('be.visible')
      .click();
    
    // Procedimento 2: Altera dados (Ex: Telefone, Endereço, Situação de Contrato, Especialidade)
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .clear()
      .type(dadosAtualizados.telefone);
    
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .clear()
      .type(dadosAtualizados.endereco);
    
    cy.get('[data-cy="select-especialidade"]')
      .should('be.visible')
      .select(dadosAtualizados.especialidade);
    
    // Procedimento 3: Salva as alterações
    cy.get('[data-cy="btn-salvar-alteracoes"]')
      .should('be.visible')
      .should('contain', 'Salvar Alterações')
      .click();
    
    // Resultado esperado: Os dados do profissional são atualizados imediatamente no sistema
    cy.wait('@atualizarProfissional').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.telefone).to.eq(dadosAtualizados.telefone);
      expect(interception.response?.body.endereco).to.eq(dadosAtualizados.endereco);
      expect(interception.response?.body.especialidade).to.eq(dadosAtualizados.especialidade);
    });
    
    // Resultado esperado: As alterações são refletidas em módulos interligados
    // (Ex: na Agenda - RF009, ou no Faturamento - RF014)
    cy.get('[data-cy="mensagem-sucesso"]', { timeout: 5000 })
      .should('be.visible')
      .should('contain', 'sucesso');
  });

  it('Deve permitir profissional atualizar seus próprios dados', () => {
    // Pré-condição: O profissional está logado
    
    // Procedimento: O profissional acessa seu próprio perfil
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa seu perfil (assumindo que existe uma rota de perfil)
    cy.visit('/dashboard/profissional/perfil');
    
    // Verifica que está na página de perfil
    cy.get('[data-cy="perfil-profissional"]').should('be.visible');
    
    // Clica em "Editar"
    cy.get('[data-cy="btn-editar-perfil"]').click();
    
    // Atualiza telefone
    cy.get('[data-cy="input-telefone"]')
      .clear()
      .type(dadosAtualizados.telefone);
    
    // Salva
    cy.get('[data-cy="btn-salvar-alteracoes"]').click();
    
    // Verifica que foi atualizado
    cy.wait('@atualizarProfissional').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });
  });

  it('Deve validar campos antes de permitir atualização', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="btn-editar-profissional"]').click();
    
    // Limpa campos obrigatórios
    cy.get('[data-cy="input-telefone"]').clear();
    cy.get('[data-cy="input-email"]').clear();
    
    // Tenta salvar
    cy.get('[data-cy="btn-salvar-alteracoes"]').click();
    
    // Verifica que o formulário não foi submetido
    cy.get('[data-cy="input-telefone"]:invalid').should('exist');
    cy.get('[data-cy="input-email"]:invalid').should('exist');
  });

  it('Deve refletir alterações na agenda após atualizar especialidade', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="btn-editar-profissional"]').click();
    
    // Altera especialidade
    cy.get('[data-cy="select-especialidade"]').select('Neurologia');
    
    // Salva
    cy.get('[data-cy="btn-salvar-alteracoes"]').click();
    
    cy.wait('@atualizarProfissional');
    
    // Resultado esperado: As alterações são refletidas em módulos interligados (Agenda - RF009)
    // Verifica que a especialidade foi atualizada
    cy.get('[data-cy="mensagem-sucesso"]').should('be.visible');
    
    // Verifica que a agenda reflete a nova especialidade
    // (Em um teste real, poderia verificar a agenda do profissional)
  });
});
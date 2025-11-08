describe('CT001.2 - Auto Cadastro de Novo Paciente pelo sistema (Criação)', () => {
  const novoPaciente = {
    nome: 'Ana Paula Silva',
    cpf: '987.654.321-00',
    email: 'ana.paula.silva@email.com',
    telefone: '(11) 91234-5678',
    senha: 'SenhaSegura123!',
    confirmarSenha: 'SenhaSegura123!'
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve realizar auto-cadastro de novo paciente com sucesso', () => {
    cy.get('h1').should('contain', 'VidaPlus');
    cy.get('h2').should('contain', 'Sistema de Gestão Hospitalar');

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    cy.get('[data-cy="btn-primeiro-acesso"]')
        .should('be.visible')
        .should('contain', 'Primeiro Acesso')
        .click();

    cy.url().should('include', '/cadastro-paciente');
    cy.get('[data-cy="cadastro-publico-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Primeiro Acesso');

    cy.get('[data-cy="input-nome-cadastro"]')
        .should('be.visible')
        .type(novoPaciente.nome);

    cy.get('[data-cy="input-cpf-cadastro"]')
        .should('be.visible')
        .type(novoPaciente.cpf);

    cy.get('[data-cy="input-email-cadastro"]')
        .should('be.visible')
        .type(novoPaciente.email);

    cy.get('[data-cy="input-telefone-cadastro"]')
        .should('be.visible')
        .type(novoPaciente.telefone);

    cy.get('[data-cy="input-senha-cadastro"]')
        .should('be.visible')
        .type(novoPaciente.senha);

    cy.get('[data-cy="input-confirmar-senha"]')
        .should('be.visible')
        .type(novoPaciente.confirmarSenha);

    cy.get('[data-cy="checkbox-termos-uso"]')
        .should('be.visible')
        .check();

    cy.get('[data-cy="checkbox-politica-privacidade"]')
        .should('be.visible')
        .check();

    cy.get('[data-cy="checkbox-termos-uso"]').should('be.checked');
    cy.get('[data-cy="checkbox-politica-privacidade"]').should('be.checked');

    cy.get('[data-cy="btn-finalizar-cadastro"]')
        .should('be.visible')
        .should('contain', 'Finalizar Cadastro')
        .should('not.be.disabled')
        .click();

    cy.get('[data-cy="mensagem-sucesso"]')
        .should('be.visible')
        .should('contain', 'Bem vindo')
        .should('contain', 'cadastro efetuado com sucesso');

    cy.get('[data-cy="paciente-id"]')
        .should('be.visible')
        .invoke('text')
        .should('match', /^ID: \d+$/);
  });

  it('Deve validar campos obrigatórios no formulário de auto-cadastro', () => {
    cy.visit('/cadastro-paciente');

    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-nome-cadastro"]').focus().blur();
    cy.get('[data-cy="input-cpf-cadastro"]').focus().blur();
    cy.get('[data-cy="input-email-cadastro"]').focus().blur();
    cy.get('[data-cy="input-telefone-cadastro"]').focus().blur();
    cy.get('[data-cy="input-senha-cadastro"]').focus().blur();
    cy.get('[data-cy="input-confirmar-senha"]').focus().blur();

    cy.get('[data-cy="input-nome-cadastro"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });

    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');
  });

  it('Deve exigir aceite dos Termos de Uso e Política de Privacidade', () => {
    cy.visit('/cadastro-paciente');

    cy.get('[data-cy="input-nome-cadastro"]').type(novoPaciente.nome);
    cy.get('[data-cy="input-cpf-cadastro"]').type(novoPaciente.cpf);
    cy.get('[data-cy="input-email-cadastro"]').type(novoPaciente.email);
    cy.get('[data-cy="input-telefone-cadastro"]').type(novoPaciente.telefone);
    cy.get('[data-cy="input-senha-cadastro"]').type(novoPaciente.senha);
    cy.get('[data-cy="input-confirmar-senha"]').type(novoPaciente.confirmarSenha);

    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="checkbox-termos-uso"]').check();
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="checkbox-politica-privacidade"]').check();
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('not.be.disabled');
  });

  it('Deve permitir cadastro com CPF válido', () => {
    cy.visit('/cadastro-paciente');

    cy.get('[data-cy="input-nome-cadastro"]').type('Novo Nome');
    cy.get('[data-cy="input-cpf-cadastro"]').type('123.456.789-00');
    cy.get('[data-cy="input-email-cadastro"]').type('novo@email.com');
    cy.get('[data-cy="input-telefone-cadastro"]').type('(11) 99999-9999');
    cy.get('[data-cy="input-senha-cadastro"]').type('Senha123!');
    cy.get('[data-cy="input-confirmar-senha"]').type('Senha123!');
    cy.get('[data-cy="checkbox-termos-uso"]').check();
    cy.get('[data-cy="checkbox-politica-privacidade"]').check();

    cy.get('[data-cy="btn-finalizar-cadastro"]')
        .should('not.be.disabled')
        .click();

    cy.get('[data-cy="mensagem-sucesso"]')
        .should('be.visible')
        .should('contain', 'Bem vindo');
  });

  it('Deve permitir acesso via link na página de login', () => {
    cy.visit('/login');

    cy.get('[data-cy="link-primeiro-acesso"]')
        .should('be.visible')
        .should('contain', 'Cadastre-se')
        .click();

    cy.url().should('include', '/cadastro-paciente');
    cy.get('[data-cy="cadastro-publico-page"]').should('be.visible');
  });

  it('Deve manter botão desabilitado quando campos estão incompletos', () => {
    cy.visit('/cadastro-paciente');

    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-nome-cadastro"]').type(novoPaciente.nome);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-cpf-cadastro"]').type(novoPaciente.cpf);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-email-cadastro"]').type(novoPaciente.email);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-telefone-cadastro"]').type(novoPaciente.telefone);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-senha-cadastro"]').type(novoPaciente.senha);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="input-confirmar-senha"]').type(novoPaciente.confirmarSenha);
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="checkbox-termos-uso"]').check();
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('be.disabled');

    cy.get('[data-cy="checkbox-politica-privacidade"]').check();
    cy.get('[data-cy="btn-finalizar-cadastro"]').should('not.be.disabled');
  });
});
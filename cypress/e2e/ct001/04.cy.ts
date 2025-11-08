


describe('CT001.4 - Atualização de Cadastro pelo Paciente', () => {
  const pacienteEmail = 'paciente@hospital.com';
  const pacientePassword = 'paciente123';
  
  const novoEndereco = 'Rua Atualizada, 999 - Vila Nova, São Paulo - SP';
  const novoEmail = 'novo.email@hospital.com';
  const novoTelefone = '(11) 95555-4444';

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Deve atualizar dados não-críticos do paciente com sucesso', () => {
    cy.visit('/dashboard/paciente');
    
    cy.get('[data-cy="paciente-dashboard"]').should('be.visible');
    cy.get('[data-cy="btn-meus-dados"]')
      .should('be.visible')
      .should('contain', 'Meus Dados')
      .click();
    
    cy.url().should('include', '/dashboard/paciente/perfil');
    cy.get('[data-cy="perfil-paciente-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Meus Dados');
    
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .clear()
      .type(novoEndereco);
    
    cy.get('[data-cy="input-email"]')
      .should('be.visible')
      .clear()
      .type(novoEmail);
    
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .clear()
      .type(novoTelefone);
    
    cy.get('[data-cy="btn-salvar-alteracoes-perfil"]')
      .should('be.visible')
      .should('contain', 'Salvar Alterações')
      .click();
    
    cy.get('[data-cy="mensagem-sucesso"]')
      .should('be.visible')
      .should('contain', 'Dados atualizados com sucesso');
  });

  it('Deve bloquear edição de dados críticos (Nome, CPF, Data de Nascimento)', () => {
    cy.visit('/dashboard/paciente/perfil');
    
    cy.get('[data-cy="input-nome"]')
      .should('be.visible')
      .should('be.disabled');
    
    cy.get('[data-cy="input-cpf"]')
      .should('be.visible')
      .should('be.disabled');
    
    cy.get('[data-cy="input-data-nascimento"]')
      .should('be.visible')
      .should('be.disabled');
    
    cy.get('[data-cy="info-nome-bloqueado"]')
      .should('be.visible')
      .should('contain', 'comprovativo');
    
    cy.get('[data-cy="info-cpf-bloqueado"]')
      .should('be.visible')
      .should('contain', 'não pode ser alterado');
    
    cy.get('[data-cy="info-data-bloqueado"]')
      .should('be.visible')
      .should('contain', 'não pode ser alterada');
  });

  it('Deve permitir editar apenas campos não-críticos', () => {
    cy.visit('/dashboard/paciente/perfil');
    
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .should('not.be.disabled');
    
    cy.get('[data-cy="input-email"]')
      .should('be.visible')
      .should('not.be.disabled');
    
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .should('not.be.disabled');
  });

  it('Deve validar campos obrigatórios ao atualizar', () => {
    cy.visit('/dashboard/paciente/perfil');
    
    cy.get('[data-cy="input-telefone"]').clear().blur();
    cy.get('[data-cy="input-email"]').clear().blur();
    cy.get('[data-cy="input-endereco"]').clear().blur();
    
    cy.get('[data-cy="btn-salvar-alteracoes-perfil"]').click();
    
    cy.get('[data-cy="input-telefone"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
    
    cy.get('[data-cy="input-email"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
    
    cy.get('[data-cy="input-endereco"]').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
    });
  });

  it('Deve permitir cancelar edição e voltar para dashboard', () => {
    cy.visit('/dashboard/paciente/perfil');
    
    cy.get('[data-cy="input-endereco"]').clear().type('Endereço Teste');
    
    cy.get('[data-cy="btn-cancelar-perfil"]')
      .should('be.visible')
      .should('contain', 'Cancelar')
      .click();
    
    cy.url().should('include', '/dashboard/paciente');
    cy.get('[data-cy="paciente-dashboard"]').should('be.visible');
  });

  it('Deve acessar perfil via link no dashboard', () => {
    cy.visit('/dashboard/paciente');
    
    cy.get('[data-cy="btn-meus-dados"]')
      .should('be.visible')
      .click();
    
    cy.url().should('include', '/dashboard/paciente/perfil');
    cy.get('[data-cy="perfil-paciente-page"]').should('be.visible');
  });
});
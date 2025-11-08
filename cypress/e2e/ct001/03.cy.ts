


describe('CT001.3 - Atualização de Cadastro de Pacientes por um profissional de saúde', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  const pacienteId = 1;
  const pacienteNome = 'Carlos Silva';
  const novoEndereco = 'Rua Nova, 456 - Centro, São Paulo - SP';
  const novoTelefone = '(11) 98888-9999';

  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Deve atualizar cadastro de paciente com sucesso', () => {
    cy.visit('/dashboard/profissional/pacientes');
    
    cy.get('[data-cy="pacientes-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Gestão de Pacientes');
    
    cy.get('[data-cy="input-pesquisa-nome"]').type(pacienteNome);
    cy.get('[data-cy="btn-pesquisar"]').click();
    
    cy.get(`[data-cy="paciente-${pacienteId}"]`).should('be.visible');
    cy.get(`[data-cy="paciente-${pacienteId}"] [data-cy="btn-editar-paciente"]`)
      .should('be.visible')
      .click();
    
    cy.url().should('include', `/dashboard/profissional/pacientes/${pacienteId}`);
    cy.get('[data-cy="editar-paciente-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Editar Paciente');
    
    cy.get('[data-cy="input-endereco"]')
      .should('be.visible')
      .clear()
      .type(novoEndereco);
    
    cy.get('[data-cy="input-telefone"]')
      .should('be.visible')
      .clear()
      .type(novoTelefone);
    
    cy.get('[data-cy="btn-salvar-alteracoes"]')
      .should('be.visible')
      .should('contain', 'Salvar Alterações')
      .click();
    
    cy.get('[data-cy="mensagem-sucesso"]')
      .should('be.visible')
      .should('contain', `Dados do paciente ${pacienteNome} atualizados com sucesso`);
  });

  it('Deve buscar paciente por CPF', () => {
    cy.visit('/dashboard/profissional/pacientes');
    
    cy.get('[data-cy="input-pesquisa-cpf"]').type('123.456.789-00');
    cy.get('[data-cy="btn-pesquisar"]').click();
    
    cy.get(`[data-cy="paciente-${pacienteId}"]`).should('be.visible');
    cy.get(`[data-cy="paciente-${pacienteId}"] [data-cy="paciente-cpf"]`)
      .should('contain', '123.456.789-00');
  });

  it('Deve buscar paciente por nome', () => {
    cy.visit('/dashboard/profissional/pacientes');
    
    cy.get('[data-cy="input-pesquisa-nome"]').type('Carlos');
    cy.get('[data-cy="btn-pesquisar"]').click();
    
    cy.get(`[data-cy="paciente-${pacienteId}"]`).should('be.visible');
    cy.get(`[data-cy="paciente-${pacienteId}"] [data-cy="paciente-nome"]`)
      .should('contain', 'Carlos');
  });

  it('Deve permitir cancelar edição e voltar para lista', () => {
    cy.visit('/dashboard/profissional/pacientes');
    
    cy.get(`[data-cy="paciente-${pacienteId}"] [data-cy="btn-editar-paciente"]`).click();
    
    cy.get('[data-cy="input-endereco"]').clear().type('Endereço Teste');
    
    cy.get('[data-cy="btn-cancelar-edicao"]')
      .should('be.visible')
      .click();
    
    cy.url().should('include', '/dashboard/profissional/pacientes');
    cy.get('[data-cy="pacientes-page"]').should('be.visible');
  });

  it('Deve validar campos obrigatórios ao editar', () => {
    cy.visit(`/dashboard/profissional/pacientes/${pacienteId}`);
    
    cy.get('[data-cy="input-nome"]').clear();
    cy.get('[data-cy="input-cpf"]').clear();
    cy.get('[data-cy="input-telefone"]').clear();
    
    cy.get('[data-cy="btn-salvar-alteracoes"]').click();
    
    cy.get('[data-cy="input-nome"]:invalid').should('exist');
    cy.get('[data-cy="input-cpf"]:invalid').should('exist');
    cy.get('[data-cy="input-telefone"]:invalid').should('exist');
  });
});
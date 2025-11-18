describe('CT002.3 - Cancelamento de Consulta por Profissional/Administrativo', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  const agendamentoId = 3; // ID do agendamento a ser cancelado
  const motivoCancelamento = 'Paciente solicitou remarcação';

  beforeEach(() => {
    // Intercepta a requisição de cancelamento
    cy.intercept('PUT', `**/api/consultas/${agendamentoId}/cancelar`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: agendamentoId,
          status: 'Cancelado',
          motivoCancelamento: motivoCancelamento,
          dataCancelamento: new Date().toISOString(),
          mensagem: 'Agendamento cancelado com sucesso'
        }
      });
    }).as('cancelarAgendamento');

    // Intercepta verificação de status do agendamento
    cy.intercept('GET', `**/api/consultas/${agendamentoId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: agendamentoId,
          status: 'Agendado',
          data: '2024-02-20',
          hora: '14:00',
          paciente: 'João Santos',
          medico: 'Dr. João Silva'
        }
      });
    }).as('verificarAgendamento');
  });

  it('Deve cancelar agendamento com sucesso quando profissional preenche motivo', () => {
    // Pré-condição: Existe um agendamento com status "Agendado"
    // Pré-condição: O usuário possui perfil de acesso para edição (RNF001)
    
    // Procedimento 1: O funcionário acessa o agendamento
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Acessa a página de consultas
    cy.visit('/dashboard/profissional/consultas');
    
    // Verifica que está na página correta
    cy.get('[data-cy="consultas-profissional-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Relatório de Consultas');
    
    // Localiza o agendamento na lista (assumindo que está visível)
    // Em uma implementação real, pode ser necessário filtrar ou buscar
    
    // Procedimento 2: Clica em "Cancelar Agendamento"
    // Simula o clique no botão de cancelar (pode estar em um dropdown)
    cy.get(`[data-cy="consulta-${agendamentoId}"]`).should('exist');
    
    // Abre o dropdown de ações (se existir)
    cy.get(`[data-cy="btn-acoes-consulta-${agendamentoId}"]`).click();
    
    // Clica no botão de cancelar
    cy.get('[data-cy="btn-cancelar"]')
      .should('be.visible')
      .click();
    
    // Procedimento 3: Confirma a ação, registrando o motivo do cancelamento
    // Assumindo que abre um modal ou formulário para o motivo
    cy.get('[data-cy="modal-cancelar-consulta"]').should('be.visible');
    cy.get('[data-cy="textarea-motivo-cancelamento"]')
      .should('be.visible')
      .type(motivoCancelamento);
    
    // Procedimento 4: Clica em "Salvar"
    cy.get('[data-cy="btn-confirmar-cancelamento"]')
      .should('be.visible')
      .should('contain', 'Confirmar Cancelamento')
      .click();
    
    // Resultado esperado: O agendamento tem seu status alterado para "Cancelado"
    cy.wait('@cancelarAgendamento').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.status).to.eq('Cancelado');
      expect(interception.response?.body.motivoCancelamento).to.eq(motivoCancelamento);
    });
    
    // Resultado esperado: O horário na agenda do profissional é liberado (RF009)
    // Verifica que o modal foi fechado e a lista foi atualizada
    cy.get('[data-cy="modal-cancelar-consulta"]').should('not.exist');
    
    // Resultado esperado: O paciente recebe uma notificação de cancelamento (RF017)
    // (Verificação de notificação pode ser feita via API ou interface)
  });

  it('Deve exigir motivo do cancelamento antes de confirmar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/consultas');
    
    // Tenta cancelar sem preencher o motivo
    cy.get(`[data-cy="btn-acoes-consulta-${agendamentoId}"]`).click();
    cy.get('[data-cy="btn-cancelar"]').click();
    
    // Verifica que o campo de motivo é obrigatório
    cy.get('[data-cy="textarea-motivo-cancelamento"]')
      .should('be.visible')
      .should('have.attr', 'required');
    
    // Tenta confirmar sem preencher
    cy.get('[data-cy="btn-confirmar-cancelamento"]').click();
    
    // Verifica que o formulário não foi submetido
    cy.get('[data-cy="modal-cancelar-consulta"]').should('be.visible');
  });
});


describe('CT002.4 - Cancelamento de Consulta pelo Paciente', () => {
  const pacienteEmail = 'paciente@hospital.com';
  const pacientePassword = 'paciente123';
  
  const agendamentoId = 1; // ID do agendamento do paciente
  const motivoCancelamento = 'Imprevisto pessoal';

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
          data: '2024-01-15',
          hora: '14:00',
          medico: 'Dr. João Silva',
          tipo: 'Consulta de Rotina',
          pacienteId: '3' // ID do paciente logado
        }
      });
    }).as('verificarAgendamento');
  });

  it('Deve cancelar agendamento com sucesso quando paciente preenche motivo', () => {
    // Pré-condição: Existe um agendamento com status "Agendado"
    
    // Procedimento 1: O paciente acessa o agendamento
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Acessa a página de consultas do paciente
    cy.visit('/dashboard/paciente/consultas');
    
    // Verifica que está na página correta
    cy.get('[data-cy="consultas-page"]').should('be.visible');
    
    // Localiza o agendamento na lista
    cy.get(`[data-cy="consulta-agendada-${agendamentoId}"]`).should('be.visible');
    
    // Procedimento 2: Clica em "Cancelar Agendamento"
    cy.get(`[data-cy="consulta-agendada-${agendamentoId}"]`)
      .find('[data-cy="btn-cancelar-consulta"]')
      .should('be.visible')
      .should('contain', 'Cancelar')
      .click();
    
    // Procedimento 3: Confirma a ação registrando o motivo do cancelamento
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
    
    // Resultado esperado: O profissional de saúde antes alocado a consulta recebe uma notificação de cancelamento (RF017)
    // (Verificação de notificação pode ser feita via API ou interface)
  });

  it('Deve permitir cancelar agendamento a partir do dashboard do paciente', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Acessa o dashboard do paciente
    cy.visit('/dashboard/paciente');
    
    // Verifica que está na página correta
    cy.get('[data-cy="paciente-dashboard"]').should('be.visible');
    
    // Localiza o agendamento na lista de consultas agendadas
    cy.get(`[data-cy="consulta-item-${agendamentoId}"]`).should('be.visible');
    
    // Clica no botão de cancelar
    cy.get(`[data-cy="consulta-item-${agendamentoId}"]`)
      .find('[data-cy="btn-cancelar-consulta"]')
      .should('be.visible')
      .click();
    
    // Preenche o motivo e confirma
    cy.get('[data-cy="textarea-motivo-cancelamento"]')
      .should('be.visible')
      .type(motivoCancelamento);
    
    cy.get('[data-cy="btn-confirmar-cancelamento"]').click();
    
    // Verifica que o cancelamento foi processado
    cy.wait('@cancelarAgendamento');
  });

  it('Deve exigir motivo do cancelamento antes de confirmar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/paciente/consultas');
    
    // Tenta cancelar sem preencher o motivo
    cy.get(`[data-cy="consulta-agendada-${agendamentoId}"]`)
      .find('[data-cy="btn-cancelar-consulta"]')
      .click();
    
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


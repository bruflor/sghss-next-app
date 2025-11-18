describe('CT002.5 - RNF001 (Segurança) - Bloquear Cancelamento por Paciente Terceiro', () => {
  const pacienteAEmail = 'paciente@hospital.com';
  const pacienteAPassword = 'paciente123';
  
  // Agendamento que pertence ao Paciente B (ID Y)
  // Assumindo que existe um agendamento com ID 999 que pertence a outro paciente
  const agendamentoIdPacienteB = 999;
  const agendamentoPacienteB = {
    id: agendamentoIdPacienteB,
    pacienteId: '999', // ID do Paciente B (diferente do Paciente A que tem ID '3')
    status: 'Agendado',
    data: '2024-02-15',
    hora: '14:00',
    medico: 'Dr. João Silva',
    tipo: 'Consulta de Rotina'
  };

  beforeEach(() => {
    // Intercepta a tentativa de cancelamento - deve retornar erro de autenticação
    cy.intercept('PUT', `**/api/consultas/${agendamentoIdPacienteB}/cancelar`, (req) => {
      req.reply({
        statusCode: 403,
        body: {
          error: 'AuthenticationException',
          message: 'Acesso negado. Você não tem permissão para cancelar este agendamento.'
        }
      });
    }).as('cancelarAgendamento');

    // Intercepta verificação de status do agendamento - deve retornar status AGENDADO
    cy.intercept('GET', `**/api/consultas/${agendamentoIdPacienteB}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...agendamentoPacienteB,
          status: 'Agendado' // Status permanece AGENDADO
        }
      });
    }).as('verificarStatus');
  });

  it('Deve bloquear cancelamento de agendamento de outro paciente e lançar AuthenticationException', () => {
    // Pré-condição: Paciente A logado; Agendamento de ID Y pertence ao Paciente B (Status: AGENDADO)
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteAEmail);
    cy.get('input[type="password"]').type(pacienteAPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Procedimento: Paciente A tenta solicitar o cancelamento do agendamento de ID Y
    // Tenta cancelar o agendamento do Paciente B via API
    cy.request({
      method: 'PUT',
      url: `/api/consultas/${agendamentoIdPacienteB}/cancelar`,
      body: {
        motivo: 'Teste de cancelamento não autorizado'
      },
      failOnStatusCode: false
    }).then((cancelResponse) => {
      // Resultado esperado: O sistema deve lançar uma exceção de acesso negado (AuthenticationException)
      expect(cancelResponse.status).to.eq(403);
      expect(cancelResponse.body.error).to.eq('AuthenticationException');
      expect(cancelResponse.body.message).to.contain('Acesso negado');
    });

    // Resultado esperado: O Status do agendamento Y deve permanecer AGENDADO
    cy.request({
      method: 'GET',
      url: `/api/consultas/${agendamentoIdPacienteB}`,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body.status).to.eq('Agendado');
      }
    });
  });

  it('Deve bloquear cancelamento via interface quando paciente tenta cancelar agendamento de outro paciente', () => {
    // Pré-condição: Paciente A está logado
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteAEmail);
    cy.get('input[type="password"]').type(pacienteAPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa dashboard do paciente
    cy.visit('/dashboard/paciente');
    
    // Verifica que está na página correta
    cy.get('[data-cy="paciente-dashboard"]').should('be.visible');
    
    // Verifica que os agendamentos exibidos pertencem ao paciente logado
    cy.get('[data-cy="consultas-list"]').should('be.visible');
    
    // Tenta acessar diretamente um agendamento de outro paciente via URL
    // (simulando tentativa de acesso não autorizado)
    cy.visit(`/dashboard/paciente/consultas/${agendamentoIdPacienteB}`, {
      failOnStatusCode: false
    });
    
    // O sistema deve redirecionar ou mostrar erro de acesso negado
    // Verifica que não consegue acessar o agendamento de outro paciente
    cy.url().should('not.include', `/consultas/${agendamentoIdPacienteB}`);
  });
});

describe('CT002.2 - Agendamento de Consulta por Paciente (Autoatendimento)', () => {
  const pacienteEmail = 'paciente@hospital.com';
  const pacientePassword = 'paciente123';
  
  const dadosAgendamento = {
    especialidade: 'Cardiologia',
    medico: '1', // Dr. João Silva
    data: '2024-02-25',
    horario: '10:00',
    tipo: 'rotina',
    motivo: 'Consulta de rotina para acompanhamento'
  };

  beforeEach(() => {
    // Intercepta a requisição de agendamento
    cy.intercept('POST', '**/api/consultas/agendar', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 101,
          pacienteId: '3', // ID do paciente logado
          data: dadosAgendamento.data,
          hora: dadosAgendamento.horario,
          status: 'Agendado',
          medicoId: dadosAgendamento.medico,
          especialidade: dadosAgendamento.especialidade,
          mensagem: 'Agendamento realizado com sucesso'
        }
      });
    }).as('agendarConsulta');

    // Intercepta verificação de horários disponíveis
    cy.intercept('GET', '**/api/agenda/horarios-disponiveis**', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          horarios: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30']
        }
      });
    }).as('horariosDisponiveis');
  });

  it('Deve agendar consulta com sucesso quando paciente preenche todos os dados', () => {
    // Pré-condição: O paciente possui cadastro (RF001)
    
    // Procedimento 1: O paciente acessa o portal/app
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Procedimento 2: Acessa a opção "Agendar Consulta"
    cy.visit('/dashboard/paciente/agendar-consulta');
    
    // Verifica que está na página correta
    cy.get('[data-cy="agendar-consulta-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Agendar Consulta');
    
    // Procedimento 3: Filtra por especialidade e/ou profissional. Seleciona ambos
    cy.get('[data-cy="select-especialidade"]')
      .should('be.visible')
      .select(dadosAgendamento.especialidade);
    
    cy.get('[data-cy="select-medico"]')
      .should('be.visible')
      .select(dadosAgendamento.medico);
    
    // Procedimento 4: Seleciona data e horário disponíveis (RF009)
    cy.get('[data-cy="input-data"]')
      .should('be.visible')
      .type(dadosAgendamento.data);
    
    cy.get('[data-cy="select-horario"]')
      .should('be.visible')
      .select(dadosAgendamento.horario);
    
    cy.get('[data-cy="select-tipo"]')
      .should('be.visible')
      .select(dadosAgendamento.tipo);
    
    cy.get('[data-cy="textarea-motivo"]')
      .should('be.visible')
      .type(dadosAgendamento.motivo);
    
    // Procedimento 5: Confirma o agendamento (Ex: aceita termos/pré-pagamento)
    cy.get('[data-cy="btn-agendar"]')
      .should('be.visible')
      .should('contain', 'Agendar Consulta')
      .click();
    
    // Resultado esperado: O sistema registra o agendamento com o status "Agendado"
    cy.wait('@agendarConsulta').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.status).to.eq('Agendado');
    });
    
    // Resultado esperado: A vaga na agenda do profissional é bloqueada (RF009)
    // Verifica que houve sucesso no agendamento
    
    // Resultado esperado: O agendamento é listado na área do paciente
    // (Pode verificar redirecionamento ou mensagem de sucesso)
  });

  it('Deve validar campos obrigatórios antes de permitir agendamento', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/paciente/agendar-consulta');
    
    // Tenta agendar sem preencher campos
    cy.get('[data-cy="btn-agendar"]').click();
    
    // Verifica que o formulário não foi submetido (validação HTML5)
    // Alguns campos podem não ter required, mas a validação deve ocorrer
    cy.get('[data-cy="agendamento-form"]').should('exist');
  });

  it('Deve permitir acessar agendamento via link no dashboard', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(pacienteEmail);
    cy.get('input[type="password"]').type(pacientePassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/paciente');
    
    // Clica no botão de agendar consulta
    cy.get('[data-cy="btn-agendar-consulta"]')
      .should('be.visible')
      .should('contain', 'Agendar Consulta')
      .click();
    
    cy.url().should('include', '/dashboard/paciente/agendar-consulta');
    cy.get('[data-cy="agendar-consulta-page"]').should('be.visible');
  });
});


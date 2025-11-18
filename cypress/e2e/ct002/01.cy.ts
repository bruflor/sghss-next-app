describe('CT002.1 - Agendamento de Consulta por Profissional', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  const dadosAgendamento = {
    paciente: '1', // Carlos Silva
    data: '2024-02-20',
    horario: '14:00',
    duracao: '30',
    tipoConsulta: 'presencial',
    tipoAtendimento: 'retorno',
    observacoes: 'Consulta de retorno agendada pelo profissional'
  };

  beforeEach(() => {
    // Intercepta a requisição de agendamento
    cy.intercept('POST', '**/api/consultas/agendar', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 100,
          pacienteId: dadosAgendamento.paciente,
          data: dadosAgendamento.data,
          hora: dadosAgendamento.horario,
          status: 'Agendado',
          profissionalId: '2',
          unidadeSaudeId: '1',
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

  it('Deve agendar consulta com sucesso quando profissional preenche todos os dados', () => {
    // Pré-condição: O paciente e o médico estão cadastrados (RF001, RF011)
    // Pré-condição: O médico possui horário disponível na agenda (RF009)
    
    // Procedimento 1: O funcionário efetua login
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Procedimento 2: Acessa o módulo de Agendamento
    cy.visit('/dashboard/profissional/agenda');
    
    // Verifica que está na página correta
    cy.get('[data-cy="agenda-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Minha Agenda');
    
    // Procedimento 3: Seleciona o paciente
    // Abre o modal de nova consulta
    cy.get('[data-cy="btn-nova-consulta"]')
      .should('be.visible')
      .click();
    
    // Aguarda o modal aparecer
    cy.get('[data-cy="modal-nova-consulta"]', { timeout: 5000 }).should('be.visible');
    
    // Seleciona o paciente
    cy.get('[data-cy="select-paciente"]')
      .should('be.visible')
      .select(dadosAgendamento.paciente);
    
    // Procedimento 4: Seleciona o profissional e a especialidade
    // (O profissional já está logado, então é automaticamente selecionado)
    
    // Procedimento 5: Escolhe data e horário disponíveis
    cy.get('[data-cy="input-data"]')
      .should('be.visible')
      .type(dadosAgendamento.data);
    
    cy.get('[data-cy="select-horario"]')
      .should('be.visible')
      .select(dadosAgendamento.horario);
    
    cy.get('[data-cy="select-duracao"]')
      .should('be.visible')
      .select(dadosAgendamento.duracao);
    
    cy.get('[data-cy="select-tipo-consulta"]')
      .should('be.visible')
      .select(dadosAgendamento.tipoConsulta);
    
    cy.get('[data-cy="select-tipo-atendimento"]')
      .should('be.visible')
      .select(dadosAgendamento.tipoAtendimento);
    
    cy.get('[data-cy="textarea-observacoes"]')
      .should('be.visible')
      .type(dadosAgendamento.observacoes);
    
    // Procedimento 6: Confirma o agendamento e a unidade de atendimento (RNF005)
    cy.get('[data-cy="btn-confirmar-consulta"]')
      .should('be.visible')
      .should('contain', 'Agendar Consulta')
      .click();
    
    // Resultado esperado: O sistema registra o agendamento com o status "Agendado"
    cy.wait('@agendarConsulta').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.status).to.eq('Agendado');
    });
    
    // Resultado esperado: A vaga na agenda do profissional é bloqueada (RF009)
    // Verifica que o modal foi fechado e a agenda foi atualizada
    cy.get('[data-cy="modal-nova-consulta"]', { timeout: 5000 }).should('not.exist');
    
    // Resultado esperado: O paciente recebe uma confirmação (RF017/RF013)
    // (Verificação de notificação pode ser feita via API ou interface)
  });

  it('Deve validar campos obrigatórios antes de permitir agendamento', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/agenda');
    cy.get('[data-cy="btn-nova-consulta"]').click();
    
    // Aguarda o modal aparecer
    cy.get('[data-cy="modal-nova-consulta"]', { timeout: 5000 }).should('be.visible');
    
    // Tenta confirmar sem preencher campos obrigatórios
    cy.get('[data-cy="btn-confirmar-consulta"]').click();
    
    // Verifica que o formulário não foi submetido (validação HTML5)
    cy.get('[data-cy="select-paciente"]:invalid').should('exist');
    cy.get('[data-cy="input-data"]:invalid').should('exist');
    cy.get('[data-cy="select-horario"]:invalid').should('exist');
  });
});

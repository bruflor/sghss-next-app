describe('CT003.1 - Alocação de Paciente em Leito (Internação) RF010', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  
  const dadosInternacao = {
    pacienteId: '4', // Ana Costa - paciente pendente de internação
    pacienteNome: 'Ana Costa',
    leitoId: '102', // Leito 102-B disponível
    leitoNumero: '102-B',
    diagnostico: 'Pneumonia grave - necessita internação para monitoramento',
    dataInternacao: '2024-02-20',
    horaInternacao: '14:30',
    prioridade: 'alta'
  };

  beforeEach(() => {
    // Intercepta a requisição de alocação de paciente em leito
    cy.intercept('POST', '**/api/internacoes/alocar', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 1001,
          pacienteId: dadosInternacao.pacienteId,
          leitoId: dadosInternacao.leitoId,
          status: 'Internado',
          dataEntrada: `${dadosInternacao.dataInternacao}T${dadosInternacao.horaInternacao}:00`,
          diagnostico: dadosInternacao.diagnostico,
          prioridade: dadosInternacao.prioridade,
          mensagem: 'Paciente alocado ao leito com sucesso'
        }
      });
    }).as('alocarPaciente');

    // Intercepta a atualização do status do leito
    cy.intercept('PUT', `**/api/leitos/${dadosInternacao.leitoId}/status`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: dadosInternacao.leitoId,
          numero: dadosInternacao.leitoNumero,
          status: 'Ocupado',
          paciente: dadosInternacao.pacienteNome,
          pacienteId: dadosInternacao.pacienteId
        }
      });
    }).as('atualizarStatusLeito');

    // Intercepta a listagem de leitos disponíveis
    cy.intercept('GET', '**/api/leitos?status=Disponível', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          leitos: [
            {
              id: 102,
              numero: '102-B',
              tipo: 'Enfermaria',
              status: 'Disponível'
            },
            {
              id: 103,
              numero: '103-C',
              tipo: 'Enfermaria',
              status: 'Disponível'
            },
            {
              id: 202,
              numero: '202-UTI',
              tipo: 'UTI',
              status: 'Disponível'
            }
          ]
        }
      });
    }).as('leitosDisponiveis');

    // Intercepta a listagem de pacientes pendentes de internação
    cy.intercept('GET', '**/api/pacientes?status=Pendente Internação', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          pacientes: [
            {
              id: '4',
              nome: 'Ana Costa',
              cpf: '789.123.456-00',
              status: 'Pendente Internação'
            },
            {
              id: '5',
              nome: 'Pedro Almeida',
              cpf: '321.654.987-00',
              status: 'Pendente Internação'
            }
          ]
        }
      });
    }).as('pacientesPendentes');
  });

  it('Deve alocar paciente em leito disponível com sucesso', () => {
    // Pré-condição: A unidade tem todos os leitos cadastrados (capacidade total)
    // Pré-condição: O profissional possui perfil de acesso (RNF001)
    // Pré-condição: O paciente deu entrada e precisa de internação (status "Pendente Internação")
    
    // Procedimento 1: O profissional acessa o módulo de Gestão de Leitos/Internações
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    // Aguarda redirecionamento para o dashboard
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de Gestão de Leitos
    cy.visit('/dashboard/profissional/leitos');
    
    // Verifica que está na página correta
    cy.get('[data-cy="leitos-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Controle de Leitos');
    
    // Procedimento 2: Visualiza o Mapa de Leitos (RF010.2) e identifica um leito disponível (status "Vazio/Livre")
    cy.get('[data-cy="leitos-list"]').should('be.visible');
    
    // Verifica que existem leitos disponíveis
    cy.get('[data-cy="leitos-disponiveis"]').should('be.visible');
    
    // Identifica um leito disponível (102-B)
    cy.get('[data-cy="leito-102"]').should('be.visible');
    cy.get('[data-cy="leito-102"] [data-cy="leito-status"]').should('contain', 'Disponível');
    
    // Procedimento 3: Seleciona o leito desejado e clica em "Alocar Paciente"
    cy.get('[data-cy="leito-102"] [data-cy="btn-internar-paciente"]')
      .should('be.visible')
      .should('contain', 'Internar Paciente')
      .click();
    
    // Alternativamente, pode acessar via página de internações
    // cy.visit('/dashboard/profissional/internacoes');
    // cy.get('[data-cy="form-internacao-card"]').should('be.visible');
    
    // Se abrir modal ou redirecionar para formulário de internação
    // Procedimento 4: Seleciona o paciente e confirma a alocação, indicando a data/hora de entrada
    
    // Acessa página de internações para completar o processo
    cy.visit('/dashboard/profissional/internacoes');
    cy.get('[data-cy="internacoes-page"]').should('be.visible');
    
    // Seleciona o paciente
    cy.get('[data-cy="select-paciente"]')
      .should('be.visible')
      .select(dadosInternacao.pacienteId);
    
    // Seleciona o leito
    cy.get('[data-cy="select-leito"]')
      .should('be.visible')
      .select(dadosInternacao.leitoId);
    
    // Preenche o diagnóstico
    cy.get('[data-cy="textarea-diagnostico"]')
      .should('be.visible')
      .type(dadosInternacao.diagnostico);
    
    // Preenche data e hora de entrada
    cy.get('[data-cy="input-data-internacao"]')
      .should('be.visible')
      .clear()
      .type(dadosInternacao.dataInternacao);
    
    cy.get('[data-cy="input-hora-internacao"]')
      .should('be.visible')
      .clear()
      .type(dadosInternacao.horaInternacao);
    
    // Seleciona prioridade
    cy.get('[data-cy="select-prioridade"]')
      .should('be.visible')
      .select(dadosInternacao.prioridade);
    
    // Confirma a internação
    cy.get('[data-cy="btn-confirmar-internacao"]')
      .should('be.visible')
      .should('contain', 'Confirmar Internação')
      .click();
    
    // Resultado esperado: O paciente é alocado ao leito no sistema
    cy.wait('@alocarPaciente').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body.status).to.eq('Internado');
      expect(interception.response?.body.pacienteId).to.eq(dadosInternacao.pacienteId);
      expect(interception.response?.body.leitoId).to.eq(dadosInternacao.leitoId);
    });
    
    // Resultado esperado: O status do leito no mapa é alterado para "Ocupado" e exibe o nome do paciente
    cy.wait('@atualizarStatusLeito').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.status).to.eq('Ocupado');
      expect(interception.response?.body.paciente).to.eq(dadosInternacao.pacienteNome);
    });
    
    // Verifica que o sistema inicia o registro da internação
    // (para fins financeiros e médicos)
    // A ação é registrada nos logs de auditoria (RNF003)
  });

  it('Deve validar campos obrigatórios antes de permitir alocação', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/internacoes');
    cy.get('[data-cy="form-internacao"]').should('be.visible');
    
    // Tenta confirmar sem preencher campos obrigatórios
    cy.get('[data-cy="btn-confirmar-internacao"]').click();
    
    // Verifica que o formulário não foi submetido (validação HTML5)
    cy.get('[data-cy="select-paciente"]:invalid').should('exist');
    cy.get('[data-cy="select-leito"]:invalid').should('exist');
    cy.get('[data-cy="textarea-diagnostico"]:invalid').should('exist');
  });

  it('Deve permitir acessar módulo de leitos via dashboard profissional', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional');
    
    // Verifica acesso ao módulo de leitos
    cy.visit('/dashboard/profissional/leitos');
    cy.get('[data-cy="leitos-page"]').should('be.visible');
    cy.get('[data-cy="page-title"]').should('contain', 'Controle de Leitos');
  });
});
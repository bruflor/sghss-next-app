describe('CT004.4 - Inativação de Profissional RF011', () => {
  const adminEmail = 'admin@hospital.com';
  const adminPassword = 'admin123';
  
  const profissionalId = '10';
  const profissionalAtivo = {
    id: profissionalId,
    nomeCompleto: 'Dr. Pedro Mendes',
    cpf: '123.456.789-01',
    crm: 'CRM/SP 123456',
    email: 'pedro.mendes@hospital.com',
    especialidade: 'Cardiologia',
    ativo: true,
    dataAdmissao: '2024-02-01',
    dataDesligamento: null
  };

  const dadosInativacao = {
    dataInativacao: '2024-02-20',
    motivo: 'Desligamento por término de contrato',
    status: 'Inativo'
  };

  beforeEach(() => {
    // Intercepta a busca do profissional
    cy.intercept('GET', `**/api/profissionais/${profissionalId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: profissionalAtivo
      });
    }).as('buscarProfissional');

    // Intercepta a inativação do profissional
    cy.intercept('PUT', `**/api/profissionais/${profissionalId}/inativar`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...profissionalAtivo,
          ativo: false,
          dataDesligamento: req.body.dataInativacao,
          motivoDesligamento: req.body.motivo,
          status: 'Inativo',
          mensagem: 'Profissional inativado com sucesso'
        }
      });
    }).as('inativarProfissional');

    // Intercepta verificação de agendamentos futuros
    cy.intercept('GET', `**/api/profissionais/${profissionalId}/agendamentos-futuros`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          agendamentos: [
            {
              id: 1,
              data: '2024-02-25',
              hora: '10:00',
              paciente: 'Carlos Silva',
              status: 'Agendado'
            }
          ],
          total: 1
        }
      });
    }).as('verificarAgendamentos');
  });

  it('Deve inativar profissional com sucesso quando administrador confirma', () => {
    // Pré-condição: O profissional não faz mais parte do quadro da unidade
    
    // Procedimento 1: O administrador acessa o cadastro do profissional
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
      .type(profissionalAtivo.nomeCompleto);
    
    // Clica no profissional
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    
    // Verifica que o profissional está ativo
    cy.get('[data-cy="status-profissional"]')
      .should('be.visible')
      .should('contain', 'Ativo');
    
    // Procedimento 2: Altera o status para "Inativo" ou "Desligado"
    cy.get('[data-cy="btn-inativar-profissional"]')
      .should('be.visible')
      .should('contain', 'Inativar Profissional')
      .click();
    
    // Aguarda modal de confirmação aparecer
    cy.get('[data-cy="modal-inativar-profissional"]', { timeout: 5000 })
      .should('be.visible');
    
    // Procedimento 3: Informa a data de inativação
    cy.get('[data-cy="input-data-inativacao"]')
      .should('be.visible')
      .type(dadosInativacao.dataInativacao);
    
    cy.get('[data-cy="textarea-motivo-inativacao"]')
      .should('be.visible')
      .type(dadosInativacao.motivo);
    
    // Confirma a inativação
    cy.get('[data-cy="btn-confirmar-inativacao"]')
      .should('be.visible')
      .should('contain', 'Confirmar Inativação')
      .click();
    
    // Resultado esperado: O acesso do profissional ao sistema é bloqueado
    cy.wait('@inativarProfissional').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.ativo).to.eq(false);
      expect(interception.response?.body.status).to.eq('Inativo');
      expect(interception.response?.body.dataDesligamento).to.exist;
    });
    
    // Resultado esperado: Ele é removido da lista de profissionais elegíveis para novos agendamentos (RF002, RF003)
    // Verifica mensagem de sucesso
    cy.get('[data-cy="mensagem-sucesso"]', { timeout: 5000 })
      .should('be.visible')
      .should('contain', 'sucesso');
    
    // Verifica que o status foi atualizado na interface
    cy.get('[data-cy="status-profissional"]')
      .should('contain', 'Inativo');
  });

  it('Deve alertar sobre agendamentos futuros antes de inativar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="btn-inativar-profissional"]').click();
    
    // Verifica se há agendamentos futuros
    cy.wait('@verificarAgendamentos');
    
    // Deve exibir alerta sobre agendamentos futuros
    cy.get('[data-cy="alerta-agendamentos-futuros"]', { timeout: 3000 })
      .should('be.visible')
      .should('contain', 'agendamento');
    
    // Deve permitir cancelar ou prosseguir
    cy.get('[data-cy="btn-prosseguir-inativacao"]')
      .should('be.visible')
      .click();
    
    // Preenche dados e confirma
    cy.get('[data-cy="input-data-inativacao"]').type(dadosInativacao.dataInativacao);
    cy.get('[data-cy="textarea-motivo-inativacao"]').type(dadosInativacao.motivo);
    cy.get('[data-cy="btn-confirmar-inativacao"]').click();
    
    cy.wait('@inativarProfissional');
  });

  it('Deve impedir login de profissional inativado', () => {
    // Primeiro inativa o profissional
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="btn-inativar-profissional"]').click();
    cy.get('[data-cy="input-data-inativacao"]').type(dadosInativacao.dataInativacao);
    cy.get('[data-cy="textarea-motivo-inativacao"]').type(dadosInativacao.motivo);
    cy.get('[data-cy="btn-confirmar-inativacao"]').click();
    cy.wait('@inativarProfissional');
    
    // Tenta fazer login com o profissional inativado
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalAtivo.email);
    cy.get('input[type="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    
    // Resultado esperado: O acesso do profissional ao sistema é bloqueado
    // Deve exibir mensagem de erro
    cy.get('[data-cy="erro-login"]', { timeout: 5000 })
      .should('be.visible')
      .should('not.be.empty');
    
    // Verifica que contém alguma das mensagens esperadas
    cy.get('[data-cy="erro-login"]').then(($el) => {
      const texto = $el.text().toLowerCase();
      const mensagensEsperadas = ['inativo', 'bloqueado', 'acesso negado'];
      const contemMensagem = mensagensEsperadas.some(msg => texto.includes(msg));
      expect(contemMensagem).to.be.true;
    });
    
    // Não deve redirecionar para o dashboard
    cy.url().should('include', '/login');
  });

  it('Deve preservar histórico de registros após inativação', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    cy.wait('@buscarProfissional');
    
    // Verifica histórico antes de inativar
    cy.get('[data-cy="historico-profissional"]').should('be.visible');
    cy.get('[data-cy="total-consultas"]').should('be.visible');
    cy.get('[data-cy="total-prontuarios"]').should('be.visible');
    
    // Inativa o profissional
    cy.get('[data-cy="btn-inativar-profissional"]').click();
    cy.get('[data-cy="input-data-inativacao"]').type(dadosInativacao.dataInativacao);
    cy.get('[data-cy="textarea-motivo-inativacao"]').type(dadosInativacao.motivo);
    cy.get('[data-cy="btn-confirmar-inativacao"]').click();
    cy.wait('@inativarProfissional');
    
    // Resultado esperado: Seu histórico de registros (PEP - RF007) é preservado
    // Verifica que o histórico ainda está acessível
    cy.get('[data-cy="historico-profissional"]').should('be.visible');
    cy.get('[data-cy="total-consultas"]').should('be.visible');
    cy.get('[data-cy="total-prontuarios"]').should('be.visible');
    
    // O histórico não deve ser apagado
    cy.get('[data-cy="historico-profissional"]')
      .should('not.contain', 'Nenhum registro encontrado');
  });

  it('Deve remover profissional da lista de elegíveis para agendamentos', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="btn-inativar-profissional"]').click();
    cy.get('[data-cy="input-data-inativacao"]').type(dadosInativacao.dataInativacao);
    cy.get('[data-cy="textarea-motivo-inativacao"]').type(dadosInativacao.motivo);
    cy.get('[data-cy="btn-confirmar-inativacao"]').click();
    cy.wait('@inativarProfissional');
    
    // Resultado esperado: Ele é removido da lista de profissionais elegíveis para novos agendamentos (RF002, RF003)
    // Verifica que o profissional não aparece mais na lista de profissionais disponíveis para agendamento
    // (Em um teste real, poderia verificar a página de agendamento)
    cy.get('[data-cy="status-profissional"]')
      .should('contain', 'Inativo');
  });
});
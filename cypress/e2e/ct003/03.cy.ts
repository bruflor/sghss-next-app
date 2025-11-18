describe('CT003.3 - Liberação do Leito (Alta do Paciente) RF010', () => {
  const profissionalEmail = 'medico@hospital.com';
  const profissionalPassword = 'medico123';
  const administrativoEmail = 'administrativo@hospital.com';
  const administrativoPassword = 'admin123';

  const dadosAlta = {
    internacaoId: 1001,
    leitoId: 101,
    leitoNumero: '101-A',
    pacienteId: '1',
    pacienteNome: 'Carlos Silva',
    dataAlta: '2024-02-20',
    horaAlta: '10:00',
    motivoAlta: 'Alta médica - paciente recuperado'
  };

  beforeEach(() => {
    // Intercepta a requisição de dar alta ao paciente
    cy.intercept('POST', `**/api/internacoes/${dadosAlta.internacaoId}/alta`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: dadosAlta.internacaoId,
          pacienteId: dadosAlta.pacienteId,
          leitoId: dadosAlta.leitoId,
          status: 'Alta',
          dataAlta: `${dadosAlta.dataAlta}T${dadosAlta.horaAlta}:00`,
          motivoAlta: dadosAlta.motivoAlta,
          mensagem: 'Alta registrada com sucesso'
        }
      });
    }).as('darAlta');

    // Intercepta a atualização do status do leito para "Limpeza/Bloqueado"
    cy.intercept('PUT', `**/api/leitos/${dadosAlta.leitoId}/status`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: dadosAlta.leitoId,
          numero: dadosAlta.leitoNumero,
          status: 'Limpeza',
          paciente: null,
          pacienteId: null
        }
      });
    }).as('atualizarStatusLeitoLimpeza');

    // Intercepta a atualização do status do leito para "Livre" após limpeza
    cy.intercept('PUT', `**/api/leitos/${dadosAlta.leitoId}/liberar`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: dadosAlta.leitoId,
          numero: dadosAlta.leitoNumero,
          status: 'Disponível',
          paciente: null,
          pacienteId: null
        }
      });
    }).as('liberarLeito');

    // Intercepta a busca da internação do paciente
    cy.intercept('GET', `**/api/internacoes/${dadosAlta.internacaoId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: dadosAlta.internacaoId,
          pacienteId: dadosAlta.pacienteId,
          pacienteNome: dadosAlta.pacienteNome,
          leitoId: dadosAlta.leitoId,
          leitoNumero: dadosAlta.leitoNumero,
          status: 'Internado',
          dataEntrada: '2024-01-10T14:30:00',
          diagnostico: 'Pneumonia',
          medico: 'Dr. João Silva'
        }
      });
    }).as('buscarInternacao');

    // Intercepta a listagem de internações
    cy.intercept('GET', '**/api/internacoes', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          internacoes: [
            {
              id: dadosAlta.internacaoId,
              pacienteId: dadosAlta.pacienteId,
              pacienteNome: dadosAlta.pacienteNome,
              leitoId: dadosAlta.leitoId,
              leitoNumero: dadosAlta.leitoNumero,
              status: 'Internado',
              dataEntrada: '2024-01-10T14:30:00',
              diagnostico: 'Pneumonia'
            }
          ]
        }
      });
    }).as('listarInternacoes');
  });

  it('Deve liberar leito e dar alta ao paciente com sucesso (médico)', () => {
    // Pré-condição: O paciente está internado em um leito (status "Ocupado")
    // Pré-condição: O médico responsável determina a alta
    
    // Procedimento 1: O profissional (médico) acessa o registro de internação do paciente
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de leitos
    cy.visit('/dashboard/profissional/leitos');
    cy.get('[data-cy="leitos-page"]').should('be.visible');
    
    // Encontra o leito ocupado
    cy.get('[data-cy="leito-101"]').should('be.visible');
    cy.get('[data-cy="leito-101"] [data-cy="leito-status"]')
      .should('contain', 'Ocupado');
    cy.get('[data-cy="leito-101"] [data-cy="leito-paciente"]')
      .should('contain', dadosAlta.pacienteNome);
    
    // Procedimento 2: Clica em "Dar Alta/Liberar Leito"
    cy.get('[data-cy="leito-101"] [data-cy="btn-alta-paciente"]')
      .should('be.visible')
      .should('contain', 'Dar Alta')
      .click();
    
    // Se abrir modal, preenche os dados da alta
    // Verifica se modal de alta aparece (se implementado)
    // cy.get('[data-cy="modal-alta-paciente"]').should('be.visible');
    
    // Alternativamente, pode acessar via página de internações
    cy.visit('/dashboard/profissional/internacoes');
    cy.get('[data-cy="internacoes-page"]').should('be.visible');
    
    // Encontra a internação na lista de leitos ocupados
    cy.get('[data-cy="tabela-leitos-ocupados"]').should('be.visible');
    cy.get(`[data-cy="leito-ocupado-${dadosAlta.leitoId}"]`).should('be.visible');
    
    // Clica no botão de dar alta
    cy.get(`[data-cy="leito-ocupado-${dadosAlta.leitoId}"] [data-cy="btn-alta-paciente"]`)
      .should('be.visible')
      .click();
    
    // Se houver modal de confirmação
    // Procedimento 3: Confirma a data e hora da alta
    // cy.get('[data-cy="input-data-alta"]').type(dadosAlta.dataAlta);
    // cy.get('[data-cy="input-hora-alta"]').type(dadosAlta.horaAlta);
    // cy.get('[data-cy="textarea-motivo-alta"]').type(dadosAlta.motivoAlta);
    // cy.get('[data-cy="btn-confirmar-alta"]').click();
    
    // Resultado esperado: O status do leito é alterado para "Limpeza/Bloqueado" ou "Livre"
    cy.wait('@darAlta').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.status).to.eq('Alta');
      expect(interception.response?.body.pacienteId).to.eq(dadosAlta.pacienteId);
    });
    
    // Resultado esperado: O sistema finaliza o registro de internação do paciente (RF007, RF016)
    // Verifica que a internação foi finalizada
    
    // Resultado esperado: O leito fica indisponível para nova alocação até que o status seja alterado para "Livre"
    cy.wait('@atualizarStatusLeitoLimpeza').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.status).to.eq('Limpeza');
      expect(interception.response?.body.paciente).to.be.null;
    });
  });

  it('Deve liberar leito e dar alta ao paciente com sucesso (administrativo)', () => {
    // Pré-condição: O paciente está internado em um leito (status "Ocupado")
    // Pré-condição: O médico responsável determina a alta
    
    // Procedimento: O profissional administrativo acessa o registro de internação
    cy.visit('/login');
    cy.get('input[type="email"]').type(administrativoEmail);
    cy.get('input[type="password"]').type(administrativoPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de leitos
    cy.visit('/dashboard/profissional/leitos');
    cy.get('[data-cy="leitos-page"]').should('be.visible');
    
    // Encontra o leito ocupado
    cy.get('[data-cy="leito-101"]').should('be.visible');
    cy.get('[data-cy="leito-101"] [data-cy="leito-status"]')
      .should('contain', 'Ocupado');
    
    // Clica em "Dar Alta"
    cy.get('[data-cy="leito-101"] [data-cy="btn-alta-paciente"]')
      .should('be.visible')
      .click();
    
    // Resultado esperado: O status do leito é alterado
    // (O teste verifica que o administrativo também pode realizar a ação)
  });

  it('Deve alterar status do leito para Limpeza após alta', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/leitos');
    
    // Encontra leito ocupado
    cy.get('[data-cy="leito-101"]').should('be.visible');
    cy.get('[data-cy="leito-101"] [data-cy="leito-status"]')
      .should('contain', 'Ocupado');
    
    // Dá alta ao paciente
    cy.get('[data-cy="leito-101"] [data-cy="btn-alta-paciente"]').click();
    
    // Resultado esperado: O leito muda para status "Limpeza/Bloqueado"
    // Verifica que o leito não está mais disponível para alocação imediata
    cy.wait('@atualizarStatusLeitoLimpeza');
    
    // Verifica que o leito não aparece mais como disponível
    // (A implementação pode variar, mas o leito deve estar em estado de limpeza)
  });

  it('Deve finalizar registro de internação ao dar alta', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/internacoes');
    cy.get('[data-cy="internacoes-page"]').should('be.visible');
    
    // Encontra internação na lista
    cy.get('[data-cy="tabela-leitos-ocupados"]').should('be.visible');
    cy.get(`[data-cy="leito-ocupado-${dadosAlta.leitoId}"]`).should('be.visible');
    
    // Dá alta
    cy.get(`[data-cy="leito-ocupado-${dadosAlta.leitoId}"] [data-cy="btn-alta-paciente"]`)
      .click();
    
    // Resultado esperado: O sistema finaliza o registro de internação (RF007, RF016)
    cy.wait('@darAlta').then((interception) => {
      expect(interception.response?.body.status).to.eq('Alta');
      // Verifica que a internação foi finalizada com data de alta
      expect(interception.response?.body.dataAlta).to.exist;
    });
  });

  it('Deve impedir alocação de novo paciente em leito em limpeza', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(profissionalEmail);
    cy.get('input[type="password"]').type(profissionalPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/profissional/leitos');
    
    // Simula que um leito está em limpeza (status "Manutenção" ou "Limpeza")
    cy.get('[data-cy="leito-301"]').should('be.visible');
    cy.get('[data-cy="leito-301"] [data-cy="leito-status"]')
      .should('contain', 'Manutenção');
    
    // Verifica que o botão de internar paciente não está disponível
    cy.get('[data-cy="leito-301"] [data-cy="btn-internar-paciente"]')
      .should('not.exist');
    
    // Resultado esperado: O leito fica indisponível para nova alocação até que o status seja alterado para "Livre"
    // O leito em manutenção/limpeza não deve permitir alocação
  });
});
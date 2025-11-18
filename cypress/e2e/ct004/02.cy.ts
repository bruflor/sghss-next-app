describe('CT004.2 - Definição de Perfil e Permissões RF011', () => {
  const adminEmail = 'admin@hospital.com';
  const adminPassword = 'admin123';
  
  const profissionalId = '10';
  const profissional = {
    id: profissionalId,
    nomeCompleto: 'Dr. Pedro Mendes',
    cpf: '123.456.789-01',
    crm: 'CRM/SP 123456',
    email: 'pedro.mendes@hospital.com',
    especialidade: 'Cardiologia',
    ativo: true,
    perfilAcesso: null // Ainda não definido
  };

  const perfisDisponiveis = [
    { id: 'medico', nome: 'Médico', descricao: 'Acesso completo a consultas, prontuários e exames' },
    { id: 'enfermeiro', nome: 'Enfermeiro', descricao: 'Acesso a prontuários e procedimentos de enfermagem' },
    { id: 'recepcionista', nome: 'Recepcionista', descricao: 'Acesso a agendamentos e cadastros básicos' },
    { id: 'administrativo', nome: 'Administrativo', descricao: 'Acesso a gestão administrativa' }
  ];

  beforeEach(() => {
    // Intercepta a busca do profissional
    cy.intercept('GET', `**/api/profissionais/${profissionalId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: profissional
      });
    }).as('buscarProfissional');

    // Intercepta a listagem de perfis disponíveis
    cy.intercept('GET', '**/api/perfis-acesso', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          perfis: perfisDisponiveis
        }
      });
    }).as('listarPerfis');

    // Intercepta a atualização do perfil de acesso
    cy.intercept('PUT', `**/api/profissionais/${profissionalId}/perfil`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...profissional,
          perfilAcesso: req.body.perfilAcesso,
          permissoes: req.body.permissoes,
          mensagem: 'Perfil de acesso atualizado com sucesso'
        }
      });
    }).as('atualizarPerfil');
  });

  it('Deve definir perfil de acesso para profissional com sucesso', () => {
    // Pré-condição: O cadastro do profissional está ativo (RF011.1)
    // Pré-condição: O sistema possui perfis de acesso predefinidos (Ex: Médico, Enfermeiro, Recepcionista)
    
    // Procedimento 1: O administrador acessa a ficha do profissional (RF011.1)
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Acessa o módulo de gestão de profissionais
    cy.visit('/dashboard/admin/usuarios');
    cy.get('[data-cy="gestao-profissionais-page"]').should('be.visible');
    
    // Busca ou seleciona o profissional
    cy.get('[data-cy="input-buscar-profissional"]')
      .should('be.visible')
      .type(profissional.nomeCompleto);
    
    // Clica no profissional na lista
    cy.get(`[data-cy="profissional-${profissionalId}"]`)
      .should('be.visible')
      .click();
    
    // Aguarda carregar os dados do profissional
    cy.wait('@buscarProfissional');
    
    // Verifica que está na ficha do profissional
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    cy.get('[data-cy="profissional-nome"]').should('contain', profissional.nomeCompleto);
    
    // Procedimento 2: Atribui o "Perfil de Acesso" (Ex: 'Médico' ou 'Administrativo')
    cy.get('[data-cy="select-perfil-acesso"]')
      .should('be.visible')
      .should('have.value', ''); // Ainda não tem perfil definido
    
    // Seleciona o perfil "Médico"
    cy.get('[data-cy="select-perfil-acesso"]')
      .select('medico');
    
    // Verifica que as permissões do perfil são exibidas
    cy.get('[data-cy="permissoes-perfil"]').should('be.visible');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'consultas');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'prontuários');
    
    // Procedimento 3: Salva a configuração
    cy.get('[data-cy="btn-salvar-perfil"]')
      .should('be.visible')
      .should('contain', 'Salvar Perfil')
      .click();
    
    // Resultado esperado: O sistema associa as permissões de acesso ao usuário (RNF001)
    cy.wait('@atualizarPerfil').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.response?.body.perfilAcesso).to.eq('medico');
    });
    
    // Resultado esperado: Limitando as funcionalidades visíveis e editáveis
    // (Ex: um Recepcionista não acessa o módulo financeiro - RF014)
    // Verifica mensagem de sucesso
    cy.get('[data-cy="mensagem-sucesso"]', { timeout: 5000 })
      .should('be.visible')
      .should('contain', 'sucesso');
  });

  it('Deve exibir permissões específicas de cada perfil ao selecionar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    
    // Seleciona perfil "Recepcionista"
    cy.get('[data-cy="select-perfil-acesso"]').select('recepcionista');
    
    // Verifica que as permissões do Recepcionista são exibidas
    cy.get('[data-cy="permissoes-perfil"]').should('be.visible');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'agendamentos');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'cadastros');
    
    // Verifica que permissões restritas não aparecem
    cy.get('[data-cy="permissoes-perfil"]').should('not.contain', 'financeiro');
    
    // Seleciona perfil "Médico"
    cy.get('[data-cy="select-perfil-acesso"]').select('medico');
    
    // Verifica que as permissões do Médico são exibidas
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'consultas');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'prontuários');
    cy.get('[data-cy="permissoes-perfil"]').should('contain', 'exames');
  });

  it('Deve permitir alterar perfil de acesso de profissional existente', () => {
    // Profissional que já tem perfil definido
    const profissionalComPerfil = {
      ...profissional,
      perfilAcesso: 'enfermeiro'
    };
    
    cy.intercept('GET', `**/api/profissionais/${profissionalId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: profissionalComPerfil
      });
    }).as('buscarProfissionalComPerfil');
    
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissionalComPerfil');
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    
    // Verifica que já tem perfil definido
    cy.get('[data-cy="select-perfil-acesso"]')
      .should('have.value', 'enfermeiro');
    
    // Altera para perfil "Médico"
    cy.get('[data-cy="select-perfil-acesso"]').select('medico');
    
    // Salva a alteração
    cy.get('[data-cy="btn-salvar-perfil"]').click();
    
    // Verifica que o perfil foi atualizado
    cy.wait('@atualizarPerfil').then((interception) => {
      expect(interception.response?.body.perfilAcesso).to.eq('medico');
    });
  });

  it('Deve validar que perfil é obrigatório antes de salvar', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(adminEmail);
    cy.get('input[type="password"]').type(adminPassword);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    cy.visit('/dashboard/admin/usuarios');
    cy.get(`[data-cy="profissional-${profissionalId}"]`).click();
    
    cy.wait('@buscarProfissional');
    cy.get('[data-cy="ficha-profissional"]').should('be.visible');
    
    // Tenta salvar sem selecionar perfil
    cy.get('[data-cy="btn-salvar-perfil"]').click();
    
    // Verifica mensagem de erro ou validação
    cy.get('[data-cy="erro-perfil-obrigatorio"]', { timeout: 3000 })
      .should('be.visible')
      .should('contain', 'obrigatório');
  });
});
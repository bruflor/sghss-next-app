export const mockUsers = [
    {
        id: '1',
        email: 'admin@hospital.com',
        senhaHash: 'admin123',
        ativo: true,
        ultimoAcesso: new Date(),
        dataCriacao: new Date(),
        perfilId: '1',
        perfil: {
            id: '1',
            cpf: '123.456.789-00',
            nomeCompleto: 'Administrador Sistema',
            telefone: '(11) 99999-9999',
            email: 'admin@hospital.com',
            dataNascimento: new Date('1980-01-01'),
            endereco: 'Rua Admin, 123',
            ativo: true,
            dataCriacao: new Date()
        }
    },
    {
        id: '2',
        email: 'medico@hospital.com',
        senhaHash: 'medico123',
        ativo: true,
        ultimoAcesso: new Date(),
        dataCriacao: new Date(),
        perfilId: '2',
        perfil: {
            id: '2',
            cpf: '987.654.321-00',
            nomeCompleto: 'Dr. João Silva',
            telefone: '(11) 98888-8888',
            email: 'medico@hospital.com',
            dataNascimento: new Date('1975-05-15'),
            endereco: 'Rua Médico, 456',
            ativo: true,
            dataCriacao: new Date(),
            especialidade: 'Cardiologia'
        }
    },
    {
        id: '3',
        email: 'paciente@hospital.com',
        senhaHash: 'paciente123',
        ativo: true,
        ultimoAcesso: new Date(),
        dataCriacao: new Date(),
        perfilId: '3',
        perfil: {
            id: '3',
            cpf: '111.222.333-44',
            nomeCompleto: 'Maria Santos',
            telefone: '(11) 97777-7777',
            email: 'paciente@hospital.com',
            dataNascimento: new Date('1990-08-20'),
            endereco: 'Rua Paciente, 789',
            ativo: true,
            dataCriacao: new Date(),
            tipoSanguineo: 'O+',
            alergias: 'Penicilina',
            contatoEmergencia: 'José Santos',
            telefoneEmergencia: '(11) 96666-6666',
            planoSaude: 'Unimed'
        }
    },
    {
        id: '4',
        email: 'enfermeiro@hospital.com',
        senhaHash: 'enfermeiro123',
        ativo: true,
        ultimoAcesso: new Date(),
        dataCriacao: new Date(),
        perfilId: '4',
        perfil: {
            id: '4',
            cpf: '555.666.777-88',
            nomeCompleto: 'Ana Costa',
            telefone: '(11) 95555-5555',
            email: 'enfermeiro@hospital.com',
            dataNascimento: new Date('1985-03-10'),
            endereco: 'Rua Enfermeiro, 321',
            ativo: true,
            dataCriacao: new Date(),
            especialidade: 'Enfermagem Geral'
        }
    },
    {
        id: '5',
        email: 'administrativo@hospital.com',
        senhaHash: 'admin123',
        ativo: true,
        ultimoAcesso: new Date(),
        dataCriacao: new Date(),
        perfilId: '5',
        perfil: {
            id: '5',
            cpf: '999.888.777-66',
            nomeCompleto: 'Carlos Oliveira',
            telefone: '(11) 94444-4444',
            email: 'administrativo@hospital.com',
            dataNascimento: new Date('1978-11-25'),
            endereco: 'Rua Administrativo, 654',
            ativo: true,
            dataCriacao: new Date(),
            cargo: 'Coordenador Administrativo',
            departamento: 'Gestão'
        }
    }
];
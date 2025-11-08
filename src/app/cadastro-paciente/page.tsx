'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function CadastroPacientePublicoPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        confirmarSenha: ''
    });
    const [termosUso, setTermosUso] = useState(false);
    const [politicaPrivacidade, setPoliticaPrivacidade] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [pacienteId, setPacienteId] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'cpf':
                const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                if (!cpfRegex.test(value)) {
                    return 'CPF deve estar no formato 000.000.000-00';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Email deve estar em um formato válido';
                }
                break;
            case 'telefone':
                const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!telefoneRegex.test(value)) {
                    return 'Telefone deve estar no formato (00) 00000-0000';
                }
                break;
            case 'confirmarSenha':
                if (value !== formData.senha) {
                    return 'As senhas não coincidem';
                }
                break;
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Formatação automática do CPF
        if (name === 'cpf') {
            let formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length <= 11) {
                formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
                formattedValue = formattedValue.replace(/(\d{3})(\d)/, '$1.$2');
                formattedValue = formattedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        }
        // Formatação automática do telefone
        else if (name === 'telefone') {
            let formattedValue = value.replace(/\D/g, '');
            if (formattedValue.length <= 11) {
                formattedValue = formattedValue.replace(/(\d{2})(\d)/, '($1) $2');
                formattedValue = formattedValue.replace(/(\d{5})(\d)/, '$1-$2');
            }
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Validação em tempo real
        const fieldError = validateField(name, name === 'cpf' || name === 'telefone' ?
            (name === 'cpf' ? value.replace(/\D/g, '') : value) : value);

        setFieldErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));

        setError('');
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldError = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
    };

    const isFormValid = () => {
        const requiredFields = ['nome', 'cpf', 'email', 'telefone', 'senha', 'confirmarSenha'];
        const areFieldsFilled = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
        const hasNoFieldErrors = Object.values(fieldErrors).every(error => error === '');
        const areCheckboxesChecked = termosUso && politicaPrivacidade;
        const passwordsMatch = formData.senha === formData.confirmarSenha;

        return areFieldsFilled && hasNoFieldErrors && areCheckboxesChecked && passwordsMatch;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validação final
        if (!termosUso || !politicaPrivacidade) {
            setError('Você deve aceitar os Termos de Uso e a Política de Privacidade');
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }

        // Validação de formato
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(formData.cpf)) {
            setError('CPF deve estar no formato 000.000.000-00');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email deve estar em um formato válido');
            return;
        }

        const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!telefoneRegex.test(formData.telefone)) {
            setError('Telefone deve estar no formato (00) 00000-0000');
            return;
        }

        try {
            // Simulação de cadastro bem-sucedido
            const novoId = Math.floor(Math.random() * 100000).toString();
            setPacienteId(novoId);
            setSuccess(true);

            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error) {
            setError('Erro ao realizar cadastro. Tente novamente.');
        }
    };

    return (
        <div className="container mt-5" data-cy="cadastro-publico-page">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <h2 className="card-title" data-cy="page-title">Primeiro Acesso</h2>
                                <p className="text-muted" data-cy="page-subtitle">Cadastre-se no VidaPlus</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" data-cy="erro-cadastro">
                                    {error}
                                </div>
                            )}

                            {success ? (
                                <div className="alert alert-success" data-cy="mensagem-sucesso">
                                    <h5>Bem vindo, cadastro efetuado com sucesso!</h5>
                                    {pacienteId && (
                                        <p className="mb-0" data-cy="paciente-id">ID: {pacienteId}</p>
                                    )}
                                    <p className="mb-0 mt-2">Você será redirecionado para a página de login em instantes...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} data-cy="cadastro-publico-form" noValidate>
                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-nome-cadastro">Nome Completo *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${fieldErrors.nome ? 'is-invalid' : ''}`}
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            data-cy="input-nome-cadastro"
                                            required
                                        />
                                        {fieldErrors.nome && (
                                            <div className="invalid-feedback" data-cy="erro-nome">
                                                {fieldErrors.nome}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-cpf-cadastro">CPF *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${fieldErrors.cpf ? 'is-invalid' : ''}`}
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            data-cy="input-cpf-cadastro"
                                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                                            placeholder="000.000.000-00"
                                            required
                                        />
                                        {fieldErrors.cpf && (
                                            <div className="invalid-feedback" data-cy="erro-cpf">
                                                {fieldErrors.cpf}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-email-cadastro">E-mail *</label>
                                        <input
                                            type="email"
                                            className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            data-cy="input-email-cadastro"
                                            required
                                        />
                                        {fieldErrors.email && (
                                            <div className="invalid-feedback" data-cy="erro-email">
                                                {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-telefone-cadastro">Telefone *</label>
                                        <input
                                            type="tel"
                                            className={`form-control ${fieldErrors.telefone ? 'is-invalid' : ''}`}
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            data-cy="input-telefone-cadastro"
                                            placeholder="(00) 00000-0000"
                                            required
                                        />
                                        {fieldErrors.telefone && (
                                            <div className="invalid-feedback" data-cy="erro-telefone">
                                                {fieldErrors.telefone}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-senha-cadastro">Senha *</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="senha"
                                            value={formData.senha}
                                            onChange={handleChange}
                                            data-cy="input-senha-cadastro"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" data-cy="label-confirmar-senha">Confirmar Senha *</label>
                                        <input
                                            type="password"
                                            className={`form-control ${fieldErrors.confirmarSenha ? 'is-invalid' : ''}`}
                                            name="confirmarSenha"
                                            value={formData.confirmarSenha}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            data-cy="input-confirmar-senha"
                                            required
                                        />
                                        {fieldErrors.confirmarSenha && (
                                            <div className="invalid-feedback" data-cy="erro-confirmar-senha">
                                                {fieldErrors.confirmarSenha}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="termosUso"
                                                checked={termosUso}
                                                onChange={(e) => setTermosUso(e.target.checked)}
                                                data-cy="checkbox-termos-uso"
                                            />
                                            <label className="form-check-label" htmlFor="termosUso" data-cy="label-termos-uso">
                                                Aceito os <Link href="/termos-uso" target="_blank">Termos de Uso</Link> *
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="politicaPrivacidade"
                                                checked={politicaPrivacidade}
                                                onChange={(e) => setPoliticaPrivacidade(e.target.checked)}
                                                data-cy="checkbox-politica-privacidade"
                                            />
                                            <label className="form-check-label" htmlFor="politicaPrivacidade" data-cy="label-politica-privacidade">
                                                Aceito a <Link href="/politica-privacidade" target="_blank">Política de Privacidade (LGPD)</Link> *
                                            </label>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <Link href="/login" className="btn btn-secondary" data-cy="btn-cancelar-cadastro">
                                            Cancelar
                                        </Link>
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-grow-1"
                                            data-cy="btn-finalizar-cadastro"
                                            disabled={!isFormValid()}
                                        >
                                            Finalizar Cadastro
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="mt-4 text-center">
                                <small className="text-muted">
                                    Já possui cadastro? <Link href="/login" data-cy="link-login">Faça login</Link>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
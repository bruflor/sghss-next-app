'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenciais inválidas');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            setError('Erro ao fazer login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Login</h2>

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Entrar
                                </button>
                            </form>

                            <div className="mt-4">
                                <h6>Usuários para teste:</h6>
                                <small className="text-muted">
                                    <div>Admin: admin@hospital.com / admin123</div>
                                    <div>Médico: medico@hospital.com / medico123</div>
                                    <div>Paciente: paciente@hospital.com / paciente123</div>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
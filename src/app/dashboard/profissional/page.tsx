import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProfissionalDashboard() {
    const session = await auth();

    if (!session || session.user?.role !== 'colaborador') {
        redirect('/login');
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary">Painel Profissional</h1>
                    <p className="text-muted mb-0">Bem-vindo(a), {session.user?.name}</p>
                </div>
                <span className="badge bg-success fs-6">Profissional de Saúde</span>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-body text-center py-5">
                            <h3 className="text-muted">Dashboard do Profissional em Desenvolvimento</h3>
                            <p className="text-muted">Aqui será o painel para médicos, enfermeiros e outros profissionais</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
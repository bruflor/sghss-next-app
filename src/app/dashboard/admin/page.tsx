import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
        redirect('/login');
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1 text-primary">Painel Administrativo</h1>
                    <p className="text-muted mb-0">Bem-vindo(a), {session.user?.name}</p>
                </div>
                <span className="badge bg-danger fs-6">Administrador</span>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        <div className="card-body text-center py-5">
                            <h3 className="text-muted">Dashboard Administrativo em Desenvolvimento</h3>
                            <p className="text-muted">Aqui será o painel de administração do sistema</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
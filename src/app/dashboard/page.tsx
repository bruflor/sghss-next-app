import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    // Redireciona para o dashboard específico baseado no role
    switch (session.user?.role) {
        case 'admin':
            redirect('/dashboard/admin');
        case 'paciente':
            redirect('/dashboard/paciente');
        case 'colaborador':
            redirect('/dashboard/profissional');
        default:
            redirect('/dashboard/paciente'); // fallback
    }
}

// Componente vazio pois sempre vai redirecionar
export function DashboardRedirect() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
        </div>
    );
}
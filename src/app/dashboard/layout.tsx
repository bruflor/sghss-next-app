import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="dashboard-layout">
            {/* Header */}
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="/dashboard">
                    VidaPlus
                </Link>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
            <span className="nav-link px-3 text-white">
              {session.user?.name} ({session.user?.role})
            </span>
                    </div>
                </div>
            </header>

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <div className="position-sticky pt-3">
                            <ul className="nav flex-column">

                                {/* Menu para todos os roles */}
                                <li className="nav-item">
                                    <Link className="nav-link" href="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>

                                {/* Menu para Pacientes */}
                                {session.user?.role === 'paciente' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/paciente">
                                                Meu Painel
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/paciente/consultas">
                                                Minhas Consultas
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/paciente/exames">
                                                Meus Exames
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/paciente/prontuario">
                                                Meu Prontuário
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* Menu para Profissionais de Saúde */}
                                {session.user?.role === 'colaborador' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/profissional">
                                                Painel Profissional
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/profissional/agenda">
                                                Minha Agenda
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/profissional/pacientes">
                                                Meus Pacientes
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/profissional/consultas">
                                                Consultas
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* Menu para Admin */}
                                {session.user?.role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/admin">
                                                Painel Admin
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/admin/usuarios">
                                                Gestão de Usuários
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/admin/relatorios">
                                                Relatórios
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="/dashboard/admin/configuracoes">
                                                Configurações
                                            </Link>
                                        </li>
                                    </>
                                )}

                                {/* Logout */}
                                <li className="nav-item mt-4">
                                    <Link className="nav-link text-danger" href="/api/auth/signout">
                                        Sair
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
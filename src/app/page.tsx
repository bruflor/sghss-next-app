import { auth } from '@/lib/auth';
import PublicHomepage from "@/components/PublicHomepage";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <PublicHomepage />;
  }

  // Dashboard baseado no perfil do usuário
  switch (session.user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'paciente':
      return <PacienteDashboard />;
    default: //profissional de saude
      return <ProfissionalSaudeDashboard />;
  }
}

function AdminDashboard() {
  return (
      <div>
        <h1>Dashboard Administrativo</h1>
        {/* Métricas gerais, gestão de usuários, etc */}
      </div>
  );
}

function ProfissionalSaudeDashboard() {
  return (
      <div>
        <h1>Dashboard Médico</h1>
        {/* Agenda, pacientes, consultas, etc */}
      </div>
  );
}

function PacienteDashboard() {
  return (
      <div>
        <h1>Meu Painel</h1>
        {/* Agendamentos, resultados, prontuário, etc */}
      </div>
  );
}
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mockUsers } from "@/mocks/mockUsers";

// ✅ CONFIGURAÇÃO CORRETA com secret
export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = mockUsers.find(
                    u => u.email === credentials.email && u.senhaHash === credentials.password
                );

                if (!user) {
                    return null;
                }

                let role = 'paciente';
                let permissoes: string[] = ['agendamento:create', 'prontuario:read'];

                if (user.email === 'admin@hospital.com') {
                    role = 'admin';
                    permissoes = ['*'];
                } else if (user.email === 'medico@hospital.com' ||
                    user.email === 'enfermeiro@hospital.com' ||
                    user.email === 'administrativo@hospital.com') {
                    role = 'profissional';
                    permissoes = ['atendimento:read', 'prontuario:read', 'agenda:view'];
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.perfil?.nomeCompleto,
                    role: role,
                    perfil: user.perfil?.nomeCompleto,
                    permissoes: permissoes,
                    ativo: user.ativo,
                    ultimoAcesso: user.ultimoAcesso,
                    dataCriacao: user.dataCriacao,
                    perfilId: user.perfilId
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email as string;
                token.name = user.name as string;
                token.role = user.role;
                token.perfil = user.perfil;
                token.permissoes = user.permissoes;
                token.ativo = user.ativo;
                token.ultimoAcesso = user.ultimoAcesso;
                token.dataCriacao = user.dataCriacao;
                token.perfilId = user.perfilId;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            session.user.role = token.role as string;
            session.user.perfil = token.perfil as string;
            session.user.permissoes = token.permissoes as string[];
            session.user.ativo = token.ativo as boolean;
            session.user.ultimoAcesso = token.ultimoAcesso as Date;
            session.user.dataCriacao = token.dataCriacao as Date;
            return session;
        }
    }
});

// Funções auxiliares
export function hasPermission(session: any, permission: string): boolean {
    if (!session?.user?.permissoes) return false;
    return session.user.permissoes.includes('*') || session.user.permissoes.includes(permission);
}

export function hasRole(session: any, role: string): boolean {
    return session?.user?.role === role;
}

export function isprofissional(session: any): boolean {
    return session?.user?.role === 'profissional';
}

export function isAdmin(session: any): boolean {
    return session?.user?.role === 'admin';
}

export function isPaciente(session: any): boolean {
    return session?.user?.role === 'paciente';
}
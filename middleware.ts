import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: any) {
    const session = await auth();

    const { pathname } = request.nextUrl;

    // Definir permissões por rota
    const routePermissions: Record<string, string[]> = {
        '/dashboard/admin': ['admin'],
        '/dashboard/profissional': ['profissional', 'admin'],
        '/dashboard/paciente': ['paciente', 'admin'],
        '/dashboard/usuarios': ['admin'],
        '/dashboard/unidades': ['admin'],
        '/dashboard/leitos': ['admin', 'profissional'],
    };

    // Verificar se a rota requer permissão específica
    const requiredRole = Object.entries(routePermissions).find(([route]) =>
        pathname.startsWith(route)
    )?.[1];

    if (requiredRole && session) {
        const userRole = session.user?.role as string;
        if (!userRole || !requiredRole.includes(userRole)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
    ],
};
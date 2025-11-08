import NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Extendendo a interface User padrão do NextAuth
     */
    interface User {
        id: string;
        role?: string;
        perfil?: string;
        especialidade?: string;
        permissoes?: string[];
        senhaHash?: string;
        ativo?: boolean;
        ultimoAcesso?: Date;
        dataCriacao?: Date;
        perfilId?: string;
    }

    /**
     * Extendendo a interface Session para incluir nossas propriedades
     */
    interface Session {
        user: {
            id: string;
            email?: string;
            name?: string;
            image?: string;

            role?: string;
            perfil?: string;
            especialidade?: string;
            permissoes?: string[];

            ativo?: boolean;
            ultimoAcesso?: Date;
            dataCriacao?: Date;
        }
    }
}

declare module "next-auth/jwt" {
    /**
     * Extendendo a interface JWT para incluir nossas propriedades
     */
    interface JWT {
        sub?: string;
        email?: string;
        name?: string;
        picture?: string;

        role?: string;
        perfil?: string;
        id?: string;
        especialidade?: string;
        permissoes?: string[];

        ativo?: boolean;
        ultimoAcesso?: Date;
        dataCriacao?: Date;
        perfilId?: string;
    }
}
'use client';

import Link from 'next/link';

export default function PublicHomepage(){
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
            <h1 className="display-3 fw-bold text-primary">VidaPlus</h1>
            <h2 className="h4 text-secondary mb-4">Sistema de Gestão Hospitalar e de Serviços de Saúde</h2>
            <p className="lead">Desenvolvido por Bruna Flôr</p>
            <caption className="text-muted small">RU 4596056</caption>

            <div className="mt-5 d-flex gap-3 justify-content-center">
                <Link href="/login" className="btn btn-primary btn-md px-5 py-3 fw-semibold" data-cy="btn-acessar-sistema">
                    Acessar Sistema
                </Link>
                <Link href="/cadastro-paciente" className="btn btn-outline-primary btn-md px-5 py-3 fw-semibold" data-cy="btn-primeiro-acesso">
                    Primeiro Acesso / Cadastre-se
                </Link>
            </div>
        </div>
    )
};
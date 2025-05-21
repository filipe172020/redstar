'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



export default function Cadastro() {

    useEffect(() => {
        document.title = "Cadastro - RedStar";
    }, []);

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erro desconhecido');
                setLoading(false);
                return;
            }

            alert('Cadastro efetuado com sucesso!');
            setEmail('');
            setPassword('');

            router.push('/login');

        } catch (err) {
            setError('Falha na conexão!');
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="text-center">
                        <img
                            alt="RedStar"
                            src="/redstar.png"
                            className="mx-auto h-10 w-auto"
                        />

                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                    Usuário
                                </label>
                                <div className="mt-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Digite seu e-mail"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                        Senha
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-red-600 hover:text-red-500">
                                            Esqueceu sua senha?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Digite sua senha"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
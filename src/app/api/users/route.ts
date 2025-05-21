import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
// lib para hash de senha
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const result = await pool.query('SELECT id, email FROM users');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email e Senha são obrigatórios!' }, { status: 400 });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
          );
      
          if (existingUser.rowCount! > 0) {
            return NextResponse.json(
              { error: "E-mail já cadastrado!" },
              { status: 409 } // 409 Conflict
            );
          }

        // hasheia a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users(email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        const user = result.rows[0];
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar usuário, tente novamente.', error);
        return NextResponse.json({ error: 'Erro ao criar usuário.' }, { status: 501 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, email, password } = body;

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório para atualizar." }, { status: 400 });
        }

        let query = "UPDATE users SET";
        const params: any[] = [];
        let idx = 1;

        if (email) {
            query += ` email = $${idx}`;
            params.push(email);
            idx++;
        }
        if (password) {
            if (email) query += ",";
            query += ` password = $${idx}`;
            const hashedPassword = await bcrypt.hash(password, 10);
            params.push(hashedPassword);
            idx++;
        }
        query += ` WHERE id = $${idx} RETURNING id, email`;
        params.push(id);

        const result = await pool.query(query, params);
        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário." }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório para deletar." }, { status: 400 });
        }

        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
        }

        return NextResponse.json({ message: "Usuário deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return NextResponse.json({ error: "Erro ao deletar usuário." }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'email e senha são obrigatórios!' }, { status: 400 });
    }

    const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'usuário não cadastrado!' }, { status: 404 });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar token
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return NextResponse.json({ error: 'Erro ao autenticar usuário.' }, { status: 500 });
  }
}
import { pool } from './_db';

export default async function handler(req: any, res: any) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS plataformas (
      id SERIAL PRIMARY KEY,
      nome TEXT UNIQUE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lancamentos (
      id SERIAL PRIMARY KEY,
      plataforma TEXT,
      mes INTEGER,
      ano INTEGER,
      adriele NUMERIC,
      larissa NUMERIC
    );
  `);

  res.status(200).json({ ok: true });
}
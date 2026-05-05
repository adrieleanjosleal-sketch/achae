import { pool } from './_db';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const plats = await pool.query('SELECT * FROM plataformas');
    const lanc = await pool.query('SELECT * FROM lancamentos');

    return res.json({
      plataformas: plats.rows,
      lancamentos: lanc.rows,
    });
  }

  if (req.method === 'POST') {
    const { tipo, payload } = req.body;

    if (tipo === 'plataforma') {
      await pool.query('INSERT INTO plataformas (nome) VALUES ($1)', [payload.nome]);
    }

    if (tipo === 'lancamento') {
      await pool.query(
        'INSERT INTO lancamentos (plataforma, mes, ano, adriele, larissa) VALUES ($1,$2,$3,$4,$5)',
        [payload.plataforma, payload.mes, payload.ano, payload.valorAdriele, payload.valorLarissa]
      );
    }

    return res.json({ ok: true });
  }
}
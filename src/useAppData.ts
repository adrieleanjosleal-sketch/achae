import { useState, useEffect } from 'react';
import { AppData, Lancamento } from './types';

const EMPTY_DATA: AppData = {
  plataformas: [],
  lancamentos: [],
};

export function useAppData() {
  const [data, setData] = useState<AppData>(EMPTY_DATA);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();

      setData({
        plataformas: json.plataformas.map((p: any) => ({
          id: String(p.id),
          nome: p.nome,
        })),
        lancamentos: json.lancamentos.map((l: any) => ({
          id: String(l.id),
          plataforma: l.plataforma,
          mes: Number(l.mes),
          ano: Number(l.ano),
          valorAdriele: Number(l.valoradriele ?? l.valorAdriele ?? l.adriele ?? 0),
          valorLarissa: Number(l.valorlarissa ?? l.valorLarissa ?? l.larissa ?? 0),
        })),
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPlataforma = async (nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed) return false;

    if (data.plataformas.some(p => p.nome.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }

    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'plataforma',
        payload: { nome: trimmed },
      }),
    });

    await fetchData();
    return true;
  };

  const deletePlataforma = async (id: string) => {
    const plat = data.plataformas.find(p => p.id === id);
    if (!plat) return;

    const hasLancamentos = data.lancamentos.some(l => l.plataforma === plat.nome);

    if (hasLancamentos) {
      const confirmed = window.confirm(
        `A plataforma "${plat.nome}" possui lançamentos vinculados. Deseja excluir a plataforma e todos os seus lançamentos?`
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(`Excluir a plataforma "${plat.nome}"?`);
      if (!confirmed) return;
    }

    await fetch('/api/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'plataforma',
        payload: { id },
      }),
    });

    await fetchData();
  };

  const addLancamento = async (
    plataforma: string,
    mes: number,
    ano: number,
    valorAdriele: number,
    valorLarissa: number
  ) => {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'lancamento',
        payload: {
          plataforma,
          mes,
          ano,
          valorAdriele,
          valorLarissa,
        },
      }),
    });

    await fetchData();
  };

  const deleteLancamento = async (id: string) => {
    await fetch('/api/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'lancamento',
        payload: { id },
      }),
    });

    await fetchData();
  };

  const deleteAllLancamentosByMesAno = async (mes: number, ano: number) => {
    const confirmed = window.confirm(`Excluir todos os lançamentos deste mês?`);
    if (!confirmed) return;

    await fetch('/api/data', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'mes',
        payload: { mes, ano },
      }),
    });

    await fetchData();
  };

  const getLancamentosByMesAno = () => {
    const map = new Map<string, Lancamento[]>();

    for (const l of data.lancamentos) {
      const key = `${l.ano}-${String(l.mes).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(l);
    }

    return map;
  };

  const getLancamentosByPlataforma = (nome: string) => {
    return data.lancamentos
      .filter(l => l.plataforma === nome)
      .sort((a, b) => (a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes));
  };

  return {
    data,
    addPlataforma,
    deletePlataforma,
    addLancamento,
    deleteLancamento,
    deleteAllLancamentosByMesAno,
    getLancamentosByMesAno,
    getLancamentosByPlataforma,
  };
}
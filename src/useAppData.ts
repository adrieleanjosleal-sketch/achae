import { useState, useEffect } from 'react';
import { AppData, Lancamento, PlataformaItem } from './types';

const STORAGE_KEY = 'achae-promos-data';

const DEFAULT_DATA: AppData = {
  plataformas: [
    { id: '1', nome: 'Amazon' },
    { id: '2', nome: 'Americanas' },
    { id: '3', nome: 'Casas Bahia' },
    { id: '4', nome: 'Magalu' },
    { id: '5', nome: 'Mercado Pago' },
    { id: '6', nome: 'Shopee' },
  ],
  lancamentos: [
    { id: 'l1', plataforma: 'Amazon', mes: 5, ano: 2026, valorAdriele: 100, valorLarissa: 50 },
    { id: 'l2', plataforma: 'Magalu', mes: 5, ano: 2026, valorAdriele: 15, valorLarissa: 30 },
    { id: 'l3', plataforma: 'Amazon', mes: 6, ano: 2026, valorAdriele: 56, valorLarissa: 100 },
  ],
};

export function useAppData() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addPlataforma = (nome: string) => {
    const trimmed = nome.trim();
    if (!trimmed) return false;
    if (data.plataformas.some(p => p.nome.toLowerCase() === trimmed.toLowerCase())) return false;
    const id = Date.now().toString();
    setData(d => ({ ...d, plataformas: [...d.plataformas, { id, nome: trimmed }] }));
    return true;
  };

  const deletePlataforma = (id: string) => {
    const plat = data.plataformas.find(p => p.id === id);
    if (!plat) return;
    const hasLancamentos = data.lancamentos.some(l => l.plataforma === plat.nome);
    if (hasLancamentos) {
      const confirmed = window.confirm(
        `A plataforma "${plat.nome}" possui lançamentos vinculados. Deseja excluir a plataforma e todos os seus lançamentos?`
      );
      if (!confirmed) return;
      setData(d => ({
        plataformas: d.plataformas.filter(p => p.id !== id),
        lancamentos: d.lancamentos.filter(l => l.plataforma !== plat.nome),
      }));
    } else {
      const confirmed = window.confirm(`Excluir a plataforma "${plat.nome}"?`);
      if (!confirmed) return;
      setData(d => ({ ...d, plataformas: d.plataformas.filter(p => p.id !== id) }));
    }
  };

  const addLancamento = (
    plataforma: string,
    mes: number,
    ano: number,
    valorAdriele: number,
    valorLarissa: number
  ) => {
    const existing = data.lancamentos.find(
      l => l.plataforma === plataforma && l.mes === mes && l.ano === ano
    );
    if (existing) {
      setData(d => ({
        ...d,
        lancamentos: d.lancamentos.map(l =>
          l.id === existing.id ? { ...l, valorAdriele, valorLarissa } : l
        ),
      }));
    } else {
      const id = Date.now().toString();
      setData(d => ({
        ...d,
        lancamentos: [...d.lancamentos, { id, plataforma, mes, ano, valorAdriele, valorLarissa }],
      }));
    }
  };

  const deleteLancamento = (id: string) => {
    setData(d => ({ ...d, lancamentos: d.lancamentos.filter(l => l.id !== id) }));
  };

  const deleteAllLancamentosByMesAno = (mes: number, ano: number) => {
    setData(d => ({
      ...d,
      lancamentos: d.lancamentos.filter(l => !(l.mes === mes && l.ano === ano)),
    }));
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
      .sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes);
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

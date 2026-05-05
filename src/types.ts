export interface Lancamento {
  id: string;
  plataforma: string;
  mes: number; // 1-12
  ano: number;
  valorAdriele: number;
  valorLarissa: number;
}

export interface PlataformaItem {
  id: string;
  nome: string;
}

export interface AppData {
  plataformas: PlataformaItem[];
  lancamentos: Lancamento[];
}

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function mesAnoLabel(mes: number, ano: number): string {
  return `${MESES[mes - 1]} ${ano}`;
}

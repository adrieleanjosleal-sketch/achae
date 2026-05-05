import React from 'react'
import { Lancamento, formatCurrency, mesAnoLabel } from '../types'

interface Props { lancamentosByMesAno: Map<string, Lancamento[]> }

export default function TabResumo({ lancamentosByMesAno }: Props) {
  const sortedKeys = Array.from(lancamentosByMesAno.keys()).sort()
  let totalGeral = 0

  const rows = sortedKeys.map(key => {
    const items = lancamentosByMesAno.get(key)!
    const [anoK, mesK] = key.split('-').map(Number)
    const totalMes = items.reduce((s, l) => s + l.valorAdriele + l.valorLarissa, 0)
    totalGeral += totalMes
    return { key, mes: mesK, ano: anoK, totalMes }
  })

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Resumo Geral</h2>
        <p className="subtitle">Acompanhe o desempenho de todos os meses.</p>
      </div>

      <div className="resumo-grid">
        <div className="resumo-big-card card-vinho">
          <div className="resumo-label">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1,11 6,6 9,9 15,3"/><polyline points="11,3 15,3 15,7"/></svg>
            Total Arrecadado
          </div>
          <div className="resumo-value">{formatCurrency(totalGeral)}</div>
        </div>
        <div className="resumo-big-card card-gold">
          <div className="resumo-label">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="12" height="9" rx="2"/><path d="M5 4V3a3 3 0 0 1 6 0v1"/></svg>
            Parte de Cada Uma
          </div>
          <div className="resumo-value">{formatCurrency(totalGeral / 2)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Histórico Mensal</div>
        </div>
        {rows.length === 0 ? (
          <p className="empty-state">Nenhum lançamento encontrado.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mês/Ano</th>
                <th className="td-right">Total do Mês</th>
                <th className="td-right">Cada Uma Recebe</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ key, mes, ano, totalMes }) => (
                <tr key={key}>
                  <td>{mesAnoLabel(mes, ano)}</td>
                  <td className="td-right">{formatCurrency(totalMes)}</td>
                  <td className="td-right td-gold">{formatCurrency(totalMes / 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

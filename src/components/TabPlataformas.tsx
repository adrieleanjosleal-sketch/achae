import React, { useState } from 'react'
import { Lancamento, PlataformaItem, formatCurrency, mesAnoLabel } from '../types'

interface Props {
  plataformas: PlataformaItem[]
  onAddPlataforma: (nome: string) => boolean
  onDeletePlataforma: (id: string) => void
  getLancamentosByPlataforma: (nome: string) => Lancamento[]
}

export default function TabPlataformas({ plataformas, onAddPlataforma, onDeletePlataforma, getLancamentosByPlataforma }: Props) {
  const [novaNome, setNovaNome] = useState('')
  const [erro, setErro] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const handleAdd = () => {
    setErro('')
    if (!novaNome.trim()) return setErro('Digite o nome da plataforma.')
    if (!onAddPlataforma(novaNome)) return setErro('Plataforma já cadastrada.')
    setNovaNome('')
  }

  const handleSelect = (nome: string) => setSelected(s => s === nome ? null : nome)

  const lancamentos = selected ? getLancamentosByPlataforma(selected) : []
  const totalGeral = lancamentos.reduce((s, l) => s + l.valorAdriele + l.valorLarissa, 0)
  const totalAdriele = lancamentos.reduce((s, l) => s + l.valorAdriele, 0)
  const totalLarissa = lancamentos.reduce((s, l) => s + l.valorLarissa, 0)

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Plataformas</h2>
        <p className="subtitle">Gerencie as plataformas de afiliação e consulte o histórico de cada uma.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Nova Plataforma</div>
          <div className="card-subtitle">Adicione uma nova fonte de renda afiliada.</div>
        </div>
        <div className="card-body">
          <div className="form-inline">
            <input
              type="text"
              placeholder="Nome da plataforma (ex: Shopee, Amazon...)"
              value={novaNome}
              onChange={e => setNovaNome(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="btn-primary" onClick={handleAdd}>+ &nbsp;Adicionar</button>
          </div>
          {erro && <p className="erro-msg" style={{ marginTop: 10 }}>{erro}</p>}
        </div>
      </div>

      <div className="section-label">Plataformas Cadastradas</div>

      <div className="pill-grid">
        {plataformas.map(p => (
          <div key={p.id} className={`pill-item ${selected === p.nome ? 'selected' : ''}`}>
            <button className="pill-btn" onClick={() => handleSelect(p.nome)}>{p.nome}</button>
            <button className="pill-del" title="Excluir" onClick={() => onDeletePlataforma(p.id)}>✕</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="history-card">
          <div className="history-card-header">
            <h3>{selected} — Histórico</h3>
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
          </div>
          {lancamentos.length === 0 ? (
            <p className="empty-state">Nenhum lançamento para esta plataforma.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mês / Ano</th>
                  <th className="td-right">Adriele</th>
                  <th className="td-right">Larissa</th>
                  <th className="td-right">Total Arrecadado</th>
                </tr>
              </thead>
              <tbody>
                {lancamentos.map(l => (
                  <tr key={l.id}>
                    <td className="td-bold">{mesAnoLabel(l.mes, l.ano)}</td>
                    <td className="td-right">{formatCurrency(l.valorAdriele)}</td>
                    <td className="td-right">{formatCurrency(l.valorLarissa)}</td>
                    <td className="td-right td-bold">{formatCurrency(l.valorAdriele + l.valorLarissa)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td>TOTAL GERAL</td>
                  <td className="td-right">{formatCurrency(totalAdriele)}</td>
                  <td className="td-right">{formatCurrency(totalLarissa)}</td>
                  <td className="td-right">{formatCurrency(totalGeral)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

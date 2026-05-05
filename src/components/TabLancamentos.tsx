import React, { useState } from 'react'
import { Lancamento, PlataformaItem, MESES, formatCurrency, mesAnoLabel } from '../types'

interface Props {
  plataformas: PlataformaItem[]
  lancamentosByMesAno: Map<string, Lancamento[]>
  onAddLancamento: (plataforma: string, mes: number, ano: number, adriele: number, larissa: number) => void
}

export default function TabLancamentos({ plataformas, lancamentosByMesAno, onAddLancamento }: Props) {
  const [plataforma, setPlataforma] = useState('')
  const [mes, setMes] = useState('5')
  const [ano, setAno] = useState('2026')
  const [adriele, setAdriele] = useState('')
  const [larissa, setLarissa] = useState('')
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())
  const [erro, setErro] = useState('')

  const parseBRL = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.'))

  const handleAdd = () => {
    setErro('')
    if (!plataforma) return setErro('Selecione uma plataforma.')
    const m = parseInt(mes)
    const a = parseInt(ano)
    if (!m || m < 1 || m > 12) return setErro('Mês inválido.')
    if (!a || a < 2000 || a > 2100) return setErro('Ano inválido.')
    const vA = parseBRL(adriele)
    const vL = parseBRL(larissa)
    if (isNaN(vA) || vA < 0) return setErro('Valor de Adriele inválido.')
    if (isNaN(vL) || vL < 0) return setErro('Valor de Larissa inválido.')
    onAddLancamento(plataforma, m, a, vA, vL)
    setAdriele('')
    setLarissa('')
  }

  const toggle = (key: string) => setOpenKeys(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  const sortedKeys = Array.from(lancamentosByMesAno.keys()).sort()

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Lançamentos</h2>
        <p className="subtitle">Controle de ganhos divididos mensalmente.</p>
      </div>

      {/* Form card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Novo Lançamento</div>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field">
              <label>Plataforma</label>
              <select value={plataforma} onChange={e => setPlataforma(e.target.value)}>
                <option value="">Selecione...</option>
                {plataformas.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Mês</label>
              <select value={mes} onChange={e => setMes(e.target.value)}>
                {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Ano</label>
              <input type="number" value={ano} onChange={e => setAno(e.target.value)} min="2000" max="2100" />
            </div>
            <div className="field">
              <label>Valor Adriele (R$)</label>
              <input type="text" placeholder="0.00" value={adriele} onChange={e => setAdriele(e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn: '1 / 2' }}>
              <label>Valor Larissa (R$)</label>
              <input type="text" placeholder="0.00" value={larissa} onChange={e => setLarissa(e.target.value)} />
            </div>
            <div className="field" style={{ alignSelf: 'flex-end' }}>
              <button className="btn-primary btn-full" onClick={handleAdd}>+ &nbsp;Adicionar</button>
            </div>
          </div>
          {erro && <p className="erro-msg">{erro}</p>}
        </div>
      </div>

      {/* Month list */}
      <div className="section-label">Meses com lançamentos</div>

      {sortedKeys.length === 0 && <div className="empty-state">Nenhum lançamento cadastrado ainda.</div>}

      <div className="accordion-list">
        {sortedKeys.map(key => {
          const items = lancamentosByMesAno.get(key)!
          const [anoK, mesK] = key.split('-').map(Number)
          const totalAdriele = items.reduce((s, l) => s + l.valorAdriele, 0)
          const totalLarissa = items.reduce((s, l) => s + l.valorLarissa, 0)
          const totalMes = totalAdriele + totalLarissa
          const cadaUma = totalMes / 2
          const isOpen = openKeys.has(key)

          return (
            <div key={key} className={`accordion ${isOpen ? 'open' : ''}`}>
              <button className="accordion-header" onClick={() => toggle(key)}>
                <span className="acc-month">{mesAnoLabel(mesK, anoK)}</span>
                <div className="acc-right">
                  <span className="acc-stat">Total: <strong>{formatCurrency(totalMes)}</strong></span>
                  <span className="acc-stat green">Cada uma: <strong>{formatCurrency(cadaUma)}</strong></span>
                  <span className="acc-chevron">▼</span>
                </div>
              </button>

              {isOpen && (
                <div className="accordion-body">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Plataforma</th>
                        <th className="td-right">Adriele</th>
                        <th className="td-right">Larissa</th>
                        <th className="td-right">Total Arrecadado</th>
                        <th className="td-right">Cada Uma Recebe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(l => {
                        const tot = l.valorAdriele + l.valorLarissa
                        return (
                          <tr key={l.id}>
                            <td className="td-bold">{l.plataforma}</td>
                            <td className="td-right">{formatCurrency(l.valorAdriele)}</td>
                            <td className="td-right">{formatCurrency(l.valorLarissa)}</td>
                            <td className="td-right td-bold">{formatCurrency(tot)}</td>
                            <td className="td-right td-gold">{formatCurrency(tot / 2)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td>TOTAL DO MÊS</td>
                        <td className="td-right">{formatCurrency(totalAdriele)}</td>
                        <td className="td-right">{formatCurrency(totalLarissa)}</td>
                        <td className="td-right">{formatCurrency(totalMes)}</td>
                        <td className="td-right">{formatCurrency(cadaUma)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

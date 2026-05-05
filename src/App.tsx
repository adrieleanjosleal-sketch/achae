import React, { useState } from 'react'
import { useAppData } from './useAppData'
import TabLancamentos from './components/TabLancamentos'
import TabPlataformas from './components/TabPlataformas'
import TabResumo from './components/TabResumo'
import './App.css'

type Tab = 'lancamentos' | 'plataformas' | 'resumo'

// Icon components
const IconLancamentos = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="12" height="12" rx="2"/>
    <line x1="5" y1="6" x2="11" y2="6"/>
    <line x1="5" y1="9" x2="11" y2="9"/>
    <line x1="5" y1="12" x2="8" y2="12"/>
  </svg>
)

const IconPlataformas = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="6" height="4" rx="1"/>
    <rect x="9" y="4" width="6" height="4" rx="1"/>
    <rect x="5" y="10" width="6" height="4" rx="1"/>
    <line x1="4" y1="8" x2="4" y2="10"/>
    <line x1="12" y1="8" x2="12" y2="10"/>
    <line x1="8" y1="8" x2="8" y2="10"/>
  </svg>
)

const IconResumo = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6"/>
    <polyline points="8,5 8,8 10,10"/>
  </svg>
)

// Logo SVG (inspired by real Achaê Promos brand — ACHAÊ bold text with magnifier)
const LogoIcon = () => (
  <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="2" y="20" fontSize="16" fontWeight="900" fill="white" fontFamily="Arial Black, sans-serif" letterSpacing="-1">AÊ</text>
    <circle cx="22" cy="20" r="5" stroke="white" strokeWidth="2"/>
    <line x1="26" y1="24" x2="29" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lancamentos')
  const { data, addPlataforma, deletePlataforma, addLancamento, deleteLancamento, deleteAllLancamentosByMesAno, getLancamentosByMesAno, getLancamentosByPlataforma } = useAppData()
  const lancamentosByMesAno = getLancamentosByMesAno()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-img-wrap"><LogoIcon /></div>
            <span className="logo-text">Achaê Promos</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${activeTab === 'lancamentos' ? 'active' : ''}`} onClick={() => setActiveTab('lancamentos')}>
              <IconLancamentos /><span>Lançamentos</span>
            </button>
            <button className={`nav-btn ${activeTab === 'plataformas' ? 'active' : ''}`} onClick={() => setActiveTab('plataformas')}>
              <IconPlataformas /><span>Plataformas</span>
            </button>
            <button className={`nav-btn ${activeTab === 'resumo' ? 'active' : ''}`} onClick={() => setActiveTab('resumo')}>
              <IconResumo /><span>Resumo</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === 'lancamentos' && (
        <TabLancamentos plataformas={data.plataformas} lancamentosByMesAno={lancamentosByMesAno} onAddLancamento={addLancamento} onDeleteLancamento={deleteLancamento} onDeleteMes={deleteAllLancamentosByMesAno} />
        )}
        {activeTab === 'plataformas' && (
          <TabPlataformas plataformas={data.plataformas} onAddPlataforma={addPlataforma} onDeletePlataforma={deletePlataforma} getLancamentosByPlataforma={getLancamentosByPlataforma} />
        )}
        {activeTab === 'resumo' && (
          <TabResumo lancamentosByMesAno={lancamentosByMesAno} />
        )}
      </main>

      <footer className="footer">Achaê Promos © 2026 · Controle de Comissões</footer>
    </div>
  )
}

import { useState } from 'react'
import AIChat from './components/AIChat'
import Login from './components/Login'
import DataHistory from './components/DataHistory'

const sections = [
  {
    id: 'income',
    title: 'Gelir yükseltme politikası',
    icon: '📈',
    description: 'Yapay zeka modellerimiz ile maliyetleri düşürün ve kar marjınızı maksimize edin.',
    details: [
      'Gider Analizi',
      'Dinamik fiyatlandırma stratejileri',
      'Pazar trendi tahmini'
    ]
  },
  {
    id: 'customer',
    title: 'Müşteri profili analizi',
    icon: '👥',
    description: 'Müşterilerinizin davranışlarını anlayarak onlara özel deneyimler sunun.',
    details: [
      'Segmentasyon ve hedefleme',
      'Churn (terk) riski analizi',
      'Kişiselleştirilmiş pazarlama'
    ]
  },
  {
    id: 'moves',
    title: 'Yeni iş hamleleri',
    icon: '🚀',
    description: 'Büyüme fırsatlarını keşfedin ve rekabette öne geçin.',
    details: [
      'Stratejik genişleme planları',
      'Yeni ürün/servis önerileri',
      'Rakip performans takibi'
    ]
  }
]

function App() {
  const [activeSection, setActiveSection] = useState(sections[0])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInitialContext, setChatInitialContext] = useState(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Business Growth</h1>
        <p style={{ color: 'var(--primary-gold)', marginTop: '5px' }}>
          Hoşgeldiniz, {user.businessName}
        </p>
      </header>

      <div className="button-grid">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`nav-button ${activeSection.id === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            <span className="icon">{section.icon}</span>
            <h3>{section.title}</h3>
          </div>
        ))}
      </div>

      <div className="content-area">
        <h2 style={{ marginBottom: '15px', color: activeSection.id === 'income' ? '#fff' : 'inherit' }}>
          {activeSection.title}
        </h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '25px' }}>
          {activeSection.description}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {activeSection.details.map((detail, index) => (
            <div
              key={index}
              onClick={() => {
                setChatInitialContext({ type: 'report', topic: detail });
                setIsChatOpen(true);
              }}
              style={{
                padding: '15px 20px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span style={{ color: 'var(--primary-gold)' }}>•</span>
              {detail}
            </div>
          ))}
        </div>

        <button
          className="action-btn"
          onClick={() => {
            setChatInitialContext(null); // General context
            setIsChatOpen(true);
          }}
        >
          Uzmanla Görüş
        </button>

        {/* Data History Button - Only visible in 'income' section or generally available */}
        {activeSection.id === 'income' && (
          <button
            className="action-btn"
            style={{ marginTop: '10px' }}
            onClick={() => setIsHistoryOpen(true)}
          >
            Haftalık Veri Analizi
          </button>
        )}
      </div>

      {isHistoryOpen && (
        <DataHistory
          data={user}
          onUpdate={setUser}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isChatOpen && (
        <AIChat
          activeContext={activeSection.id}
          initialContext={chatInitialContext}
          user={user}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  )
}

export default App

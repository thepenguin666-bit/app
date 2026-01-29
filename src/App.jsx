import { useState, useEffect } from 'react'
import './App.css'
import AIChat from './components/AIChat'
import Login from './components/Login'
import Register from './components/Register'
import Onboarding from './components/Onboarding'
import DataHistory from './components/DataHistory'
import SalesTable from './components/SalesTable'

import { weeklyReports } from './data/weeklyReports'
import { userProfile } from './data/userProfile'

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

// Shared Mock History Data (Sync with DataHistory.jsx)
const MOCK_HISTORY_DATA = [
  {
    id: 'hist_1',
    dateLabel: '01.01.2026',
    rent: '15000',
    totalSalaries: '45000',
    otherExpenses: '3200',
    productList: [
      { id: 101, name: 'Eski Sezon Defter', price: 120, cost: 30, quantity: 15, stock: 54 },
      { id: 102, name: '2025 Kalem Seti', price: 250, cost: 80, quantity: 40, stock: 12 }
    ],
    additionalExpenses: [
      {
        id: 999, title: 'Yılbaşı Süslemesi', items: [
          { id: 1, name: 'Işıklar', cost: 1200 },
          { id: 2, name: 'Dekor', cost: 800 }
        ]
      }
    ]
  }
];

// Helper to calculate Net Profit for a given data object
const calculatePeriodNetProfit = (data) => {
  if (!data) return 0;

  const totalRevenue = (data.productList || []).reduce((acc, p) => acc + (Number(p.price) * Number(p.quantity)), 0);
  const totalCOGS = (data.productList || []).reduce((acc, p) => acc + (Number(p.cost || 0) * Number(p.quantity)), 0);

  const fixedExpenses = Number(data.rent || 0) + Number(data.totalSalaries || 0) + Number(data.otherExpenses || 0);
  const additionalExpenses = (data.additionalExpenses || []).reduce((acc, cat) =>
    acc + (cat.items || []).reduce((sum, item) => sum + Number(item.cost), 0), 0);

  const totalExpenses = fixedExpenses + additionalExpenses + totalCOGS;
  return totalRevenue - totalExpenses;
};

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('growth_ai_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('growth_ai_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('growth_ai_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInitialContext, setChatInitialContext] = useState(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSalesTableOpen, setIsSalesTableOpen] = useState(false)

  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('growth_ai_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return (parsed.productList && parsed.productList.length > 0) ? 'dashboard' : 'onboarding';
    }
    return 'login';
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('growth_ai_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('growth_ai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('growth_ai_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('growth_ai_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // -- Dynamic Average Income Calculation --
  const currentNetProfit = calculatePeriodNetProfit(user);

  // Use real history or mock if empty
  const historySource = (user?.history && user.history.length > 0) ? user.history : MOCK_HISTORY_DATA;

  // Calculate total profit from history
  const historyTotalProfit = historySource.reduce((acc, period) => acc + calculatePeriodNetProfit(period), 0);

  // Average = (Current + History Sum) / (1 + History Count)
  const totalMonths = 1 + historySource.length;
  const averageMonthlyIncome = (currentNetProfit + historyTotalProfit) / totalMonths;

  // -- Trend Calculation for Hero --
  const lastHistoryEntry = historySource[historySource.length - 1];
  const previousNetProfit = calculatePeriodNetProfit(lastHistoryEntry);
  const profitDiff = currentNetProfit - previousNetProfit;
  const profitTrendPercent = previousNetProfit !== 0 ? ((Math.abs(profitDiff) / Math.abs(previousNetProfit)) * 100).toFixed(1) : 0;
  const isTrendPositive = profitDiff >= 0;

  if (currentView === 'login' && !user) {
    return <Login
      allUsers={allUsers}
      onLogin={(u) => {
        setUser(u);
        const hasData = u.productList && u.productList.length > 0;
        setCurrentView(hasData ? 'dashboard' : 'onboarding');
      }}
      onShowRegister={() => setCurrentView('register')}
    />
  }

  if (currentView === 'register') {
    return <Register
      onRegister={(regData) => {
        const newUser = { ...regData, id: Date.now().toString() };
        setUser(newUser);
        setAllUsers(prev => {
          const existingIndex = prev.findIndex(u =>
            (u.username && u.username.toLowerCase() === regData.username?.toLowerCase()) ||
            (u.businessName.toLowerCase() === regData.businessName.toLowerCase())
          );

          let newList;
          if (existingIndex >= 0) {
            // Update existing user with new info (like username) but preserve their ID if possible or merge
            const existing = prev[existingIndex];
            newList = [...prev];
            newList[existingIndex] = { ...existing, ...newUser, id: existing.id || newUser.id };
          } else {
            newList = [...prev, newUser];
          }

          localStorage.setItem('growth_ai_all_users', JSON.stringify(newList));
          return newList;
        });
        setCurrentView('onboarding');
      }}
      onBackToLogin={() => setCurrentView('login')}
    />
  }

  if (currentView === 'onboarding') {
    return <Onboarding
      onComplete={(onboardData) => {
        const updatedUser = { ...user, ...onboardData };
        setUser(updatedUser);
        setAllUsers(prev => {
          const newList = prev.map(u =>
            (u.id && u.id === updatedUser.id) || (u.businessName === user.businessName) ? updatedUser : u
          );
          localStorage.setItem('growth_ai_all_users', JSON.stringify(newList));
          return newList;
        });
        setCurrentView('dashboard');
      }}
    />
  }

  if (!user && currentView === 'dashboard') {
    setCurrentView('login');
    return null;
  }

  // Helper to create a new session
  const createNewSession = (initialContext, initialMessages = []) => {
    const newSession = {
      id: Date.now(),
      title: initialContext?.topic || 'Yeni Sohbet',
      date: new Date().toLocaleDateString('tr-TR'),
      context: initialContext,
      messages: initialMessages
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  // Helper to load report or open existing session
  const handleDetailClick = (detail) => {
    const context = { type: 'report', topic: detail };

    // Find existing sessions for this topic
    const existingSession = chatSessions.find(s => s.context?.topic === detail);

    if (existingSession) {
      setActiveSessionId(existingSession.id);
    } else {
      // Create new session with report
      const reportContent = weeklyReports[detail] || "Bu başlık için henüz haftalık rapor hazırlanmadı.";
      const initialMessages = [
        { role: 'assistant', content: reportContent },
        { role: 'assistant', content: "Bu haftaki raporunuz bu şekilde. Herhangi bir sorunuz var mı?" }
      ];
      createNewSession(context, initialMessages);
    }

    setChatInitialContext(context);
    setIsChatOpen(true);
  };

  const handleGeneralChat = () => {
    setChatInitialContext(null);
    const lastGeneral = chatSessions.find(s => !s.context || s.context.type !== 'report');
    if (lastGeneral) {
      setActiveSessionId(lastGeneral.id);
    } else {
      createNewSession(null);
    }
    setIsChatOpen(true);
  }

  const handleLogout = () => {
    // DO NOT use localStorage.clear() as it wipes the user registry
    setUser(null);
    setChatSessions([]);
    setActiveSection(null);
    setIsChatOpen(false);
    setIsHistoryOpen(false);
    setIsSettingsOpen(false);
  };
  const handleMonthlyAnalysis = () => {
    const analysisSessionId = 'monthly-analysis';
    const existingSession = chatSessions.find(s => s.id === analysisSessionId);

    if (existingSession) {
      setActiveSessionId(analysisSessionId);
      setIsChatOpen(true);
      return;
    }

    // Generate Initial AI Analysis
    const totalRevenue = (user.productList || []).reduce((acc, p) => acc + (Number(p.price) * Number(p.quantity)), 0);
    const totalCOGS = (user.productList || []).reduce((acc, p) => acc + (Number(p.cost || 0) * Number(p.quantity)), 0);
    const fixedExpenses = Number(user.rent || 0) + Number(user.totalSalaries || 0) + Number(user.otherExpenses || 0) + (user.additionalExpenses || []).reduce((acc, cat) => acc + (cat.items || []).reduce((sum, item) => sum + Number(item.cost), 0), 0);

    const totalExpenses = fixedExpenses + totalCOGS;
    const netProfit = totalRevenue - totalExpenses;
    const topProduct = (user.productList || []).sort((a, b) => b.quantity - a.quantity)[0];

    const analysisMessage = `
**${new Date().toLocaleString('tr-TR', { month: 'long', year: 'numeric' })} Veri Analizi Raporu** 📊

İşletmenizin bu ayki performansını inceledim. İşte öne çıkan detaylar:

🔹 **Finansal Durum:**
*   **Toplam Ciro:** ${totalRevenue.toLocaleString('tr-TR')} ₺
*   **Sabit Giderler:** ${totalExpenses.toLocaleString('tr-TR')} ₺
*   **Tahmini Net Kar:** ${netProfit.toLocaleString('tr-TR')} ₺

🔹 **Satış Performansı:**
Bu ay en çok ilgi gören ürününüz **${topProduct ? topProduct.name : 'Belirtilmemiş'}** oldu. Stok yönetiminde bu ürüne öncelik vermeniz nakit akışınızı hızlandırabilir.

💡 **Yapay Zeka Önerisi:**
Kar marjınızı artırmak için düşük performanslı ürünlerde kampanya yapmayı veya sabit giderlerinizi optimize etmeyi düşünebilirsiniz. Detaylı strateji için bana sorular sorabilirsiniz!
    `.trim();

    const newSession = {
      id: analysisSessionId,
      title: 'Bu Ayın Veri Analizi',
      date: new Date().toLocaleDateString('tr-TR'),
      messages: [{ role: 'assistant', content: analysisMessage }],
      context: { type: 'analysis', topic: 'monthly' }
    };

    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(analysisSessionId);
    setIsChatOpen(true);
  };

  // Get active session data
  const activeSession = chatSessions.find(s => s.id === activeSessionId) || { messages: [] };

  return (
    <div className="app-container">
      <div className="dashboard-container">
        {/* Profile Section (Absolute Top Left) */}
        <div style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 100 }}>
          <div
            className="user-profile-header"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div className="profile-icon"></div>
            <div className="profile-details" style={{ textAlign: 'center' }}>
              <h2 className="profile-name" style={{ fontSize: '0.9rem', marginBottom: '0' }}>{user.businessName}</h2>
              {isProfileOpen && (
                <div className="profile-id" style={{ marginTop: '5px', justifyContent: 'center' }}>
                  <span>TR9148...34</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Settings Button (Absolute Top Right) */}
        <div style={{ position: 'absolute', top: '0px', right: '0px', zIndex: 100 }}>
          <button className="settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>

          {isSettingsOpen && (
            <div className="settings-dropdown">
              <div className="dropdown-header-info">
                <div className="dd-name">{user.businessName}</div>
                <div className="dd-id">TR9148...34 - {user.username || 'Kullanıcı'}</div>
              </div>
              <button className="dropdown-logout-btn" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </div>
          )}
        </div>

        {/* BODO Branding (Moved below top bar) */}
        <div className="bodo-branding" style={{ textAlign: 'center', marginBottom: '5px' }}>
          <img src="/BODO.svg" alt="BODO" className="header-logo" style={{ height: '40px', marginBottom: '10px' }} />
          <p style={{ color: 'var(--primary-gold)', marginTop: '5px', fontSize: '1.1rem', fontWeight: '500' }}>
            AI destekli İşletme Profili
          </p>
        </div>

        {/* Custom Dashboard Hero */}
        <div className="dashboard-hero">
          <div className="hero-label">Aylık ortalama net gelir</div>
          {/* Dynamic Average Income Display */}
          <div className="hero-value">₺{averageMonthlyIncome.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
          <div className="hero-trend">
            <span>{isTrendPositive ? '+' : ''}{profitDiff.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
            <span className="trend-text-dim">
              ( bu ay <span className="trend-highlight" style={{ color: isTrendPositive ? '#4cd137' : '#ff6b6b' }}>
                {isTrendPositive ? '+' : ''}{profitTrendPercent}%
              </span> {isTrendPositive ? 'artış' : 'azalış'} )
            </span>
          </div>
          <button className="hero-action-btn" onClick={() => setIsHistoryOpen(true)}>Ekonomi Verileri</button>
        </div>

        {/* Circular Actions */}
        <div className="actions-grid">
          <div className="action-circle-item" onClick={() => setIsHistoryOpen(true)}>
            <div className="action-circle-btn">+</div>
            <div className="action-label">Sisteme<br />Veri Ekle</div>
          </div>
          <div className="action-circle-item" onClick={() => setIsHistoryOpen(true)}>
            <div className="action-circle-btn">✎</div>
            <div className="action-label">Verileri<br />Düzenle</div>
          </div>
          <div className="action-circle-item" onClick={() => alert('Rapor indiriliyor...')}>
            <div className="action-circle-btn">↓</div>
            <div className="action-label">Verileri<br />İndir</div>
          </div>
        </div>

        {/* AI Assistant Card */}
        <div className="ai-assistant-card">
          <div className="ai-hint-text">
            <div className="ai-icon-bg">✨</div>
            <span>Yeni gelir/gider stratejisi geliştirmek için;</span>
          </div>
          <button className="ai-chat-btn" onClick={handleGeneralChat}>
            Bodo Asistan'a sor!
          </button>
          <div className="ai-footer-link" onClick={handleMonthlyAnalysis}>
            Bu ayın veri analizini görmek için <span>tıkla →</span>
          </div>
        </div>

        {/* Product List */}
        <div className="dashboard-products">
          {(user.productList && user.productList.length > 0 ? user.productList : [
            /* Mock data if empty list but user logged in (fallback) */
            { id: 1, name: 'Rotring xyz', price: 190, cost: 40, quantity: 24 },
            { id: 2, name: 'Mona Lisa Defter', price: 390, cost: 30, quantity: 10 },
            { id: 3, name: 'XYZ oyuncakk', price: 710, cost: 50, quantity: 2 },
          ]).map((p, index) => {

            // Calculate real trend based on history
            const history = (user.history && user.history.length > 0) ? user.history : MOCK_HISTORY_DATA;

            // Find the most recent history entry for comparison
            // In DataHistory.jsx, it uses `DataHistory[0]` as previous.
            // If user.history is verified sorted, last item is usually newest.
            const isMock = history === MOCK_HISTORY_DATA;
            // IMPORTANT: If mock, select [0]. If real, select [last].
            const prevHistory = isMock ? history[0] : history[history.length - 1];

            // Loose matching: Match by name OR by ID if available
            const prevProduct = prevHistory?.productList?.find(hp =>
              (hp.name && p.name && hp.name.trim().toLowerCase() === p.name.trim().toLowerCase()) ||
              (hp.id && p.id && hp.id == p.id)
            );

            const currentTotal = Number(p.price) * Number(p.quantity);
            let percentChange = 0;
            let isPositive = false;
            let hasHistory = false;

            if (prevProduct) {
              const prevTotal = Number(prevProduct.price) * Number(prevProduct.quantity);
              if (prevTotal > 0) {
                const diff = currentTotal - prevTotal;
                percentChange = Math.round((Math.abs(diff) / prevTotal) * 100);
                isPositive = diff >= 0;
                hasHistory = true;
              }
            }

            return (
              <div key={p.id || index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 15px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: '8px'
              }}>
                {/* Left: Icon + Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Circle Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    📦
                  </div>

                  {/* Text Block - Italicized, Left Aligned */}
                  <div style={{ display: 'flex', flexDirection: 'column', fontStyle: 'italic', alignItems: 'flex-start', textAlign: 'left' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', textAlign: 'left' }}>{p.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                      Stok: {p.stock || (Math.floor(Math.random() * 50) + 5)}
                    </span>
                  </div>
                </div>

                {/* Right: Price/Quantity Info */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {p.quantity} adet / ₺{currentTotal.toLocaleString('tr-TR')}
                  </span>

                  {hasHistory ? (
                    <span style={{ fontSize: '0.8rem', color: isPositive ? '#4cd137' : '#ff6b6b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      (bu ay) <span style={{ fontSize: '0.7rem' }}>{isPositive ? '▲' : '▼'}</span> %{percentChange}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      (yeni ürün)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isSalesTableOpen && (
          <SalesTable
            data={user}
            onClose={() => setIsSalesTableOpen(false)}
          />
        )}

        {
          isHistoryOpen && (
            <DataHistory
              data={user}
              historyData={MOCK_HISTORY_DATA}
              onUpdate={(updatedUser) => {
                setUser(updatedUser);
                setAllUsers(prev => prev.map(u =>
                  (u.id && u.id === updatedUser.id) || (u.businessName === user.businessName) ? updatedUser : u
                ));
              }}
              onArchive={(newArchiveItem) => {
                const updatedHistory = [...(user.history || []), newArchiveItem];
                // Reset current month quantities for a fresh start, but keep products
                const resetProductList = (user.productList || []).map(p => ({ ...p, quantity: 0 }));

                const updatedUser = {
                  ...user,
                  history: updatedHistory,
                  productList: resetProductList
                };

                setUser(updatedUser);
                setAllUsers(prev => prev.map(u =>
                  (u.id && u.id === updatedUser.id) || (u.businessName === user.businessName) ? updatedUser : u
                ));
              }}
              onClose={() => setIsHistoryOpen(false)}
            />
          )
        }

        {
          isChatOpen && (
            <AIChat
              activeContext={activeSection?.id || 'general'}
              initialContext={chatInitialContext}
              user={user}
              sessions={chatSessions}
              activeSessionId={activeSessionId}
              onSwitchSession={(id) => setActiveSessionId(id)}
              onNewSession={() => {
                const context = activeSession.context || chatInitialContext;
                let initialMessages = [];
                if (context?.type === 'report') {
                  const reportContent = weeklyReports[context.topic] || "Rapor yükleniyor...";
                  initialMessages = [
                    { role: 'assistant', content: reportContent },
                    { role: 'assistant', content: "Bu haftaki raporunuz bu şekilde. Herhangi bir sorunuz var mı?" }
                  ];
                }
                createNewSession(context, initialMessages);
              }}
              currentMessages={activeSession.messages}
              onUpdateHistory={(newMessages) => {
                setChatSessions(prev => prev.map(session =>
                  session.id === activeSessionId
                    ? { ...session, messages: newMessages }
                    : session
                ));
              }}
              onClose={() => setIsChatOpen(false)}
            />
          )
        }
      </div>
    </div>
  )
}

export default App

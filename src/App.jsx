import { useState, useEffect } from 'react'
import './App.css'
import AIChat from './components/AIChat'
import Login from './components/Login'
import Register from './components/Register'
import Onboarding from './components/Onboarding'
import DataHistory from './components/DataHistory'
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
        setUser(regData);
        setAllUsers(prev => {
          if (!prev.find(u => u.businessName === regData.businessName)) {
            return [...prev, regData];
          }
          return prev;
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
        setAllUsers(prev => prev.map(u =>
          u.businessName === user.businessName ? updatedUser : u
        ));
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
    localStorage.clear();
    setUser(null);
    setChatSessions([]);
    setCurrentView('login');
    setActiveSection(null);
    setIsChatOpen(false);
    setIsHistoryOpen(false);
  };

  // Get active session data
  const activeSession = chatSessions.find(s => s.id === activeSessionId) || { messages: [] };

  return (
    <div className="app-container">
      <header className="header">
        <button className="logout-btn-header" onClick={handleLogout}>Çıkış Yap</button>
        <h1>AI Business Growth</h1>
        <p style={{ color: 'var(--primary-gold)', marginTop: '5px' }}>
          Hoşgeldiniz, {user.businessName}
        </p>
      </header>

      <div className="button-grid">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`nav-button ${activeSection?.id === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            <span className="icon">{section.icon}</span>
            <h3>{section.title}</h3>
          </div>
        ))}
      </div>

      {activeSection && (
        <div className="content-area" key={activeSection.id}>
          <h2 style={{ marginBottom: '15px', color: activeSection.id === 'income' ? '#fff' : 'inherit' }}>
            {activeSection.title}
          </h2>
          <p className="section-description">
            {activeSection.description}
          </p>
          <div className="detail-list">
            {activeSection.details.map((detail, index) => (
              <div
                key={index}
                className="detail-button"
                onClick={() => handleDetailClick(detail)}
              >
                <span className="detail-bullet">•</span>
                {detail}
              </div>
            ))}
          </div>

          <div className="action-group">
            <button
              className="action-btn"
              onClick={handleGeneralChat}
            >
              Uzmanla Görüş
            </button>

            <button
              className="action-btn"
              onClick={() => setIsHistoryOpen(true)}
              style={{ background: 'var(--gold-gradient)', color: '#000', fontWeight: 'bold' }}
            >
              Aylık Veri Analizi
            </button>
          </div>
        </div>
      )}

      {isHistoryOpen && (
        <DataHistory
          data={user}
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            setAllUsers(prev => prev.map(u =>
              u.businessName === user.businessName ? updatedUser : u
            ));
          }}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isChatOpen && (
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
      )}
    </div>
  )
}

export default App

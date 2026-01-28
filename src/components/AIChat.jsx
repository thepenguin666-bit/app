import { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';
import { weeklyReports } from '../data/weeklyReports';

const AIChat = ({
    activeContext,
    initialContext,
    user,
    sessions,
    activeSessionId,
    onSwitchSession,
    onNewSession,
    currentMessages,
    onUpdateHistory,
    onClose
}) => {
    const contextNames = {
        income: 'Gelir yükseltme politikası',
        customer: 'Müşteri profili analizi',
        moves: 'Yeni iş hamleleri'
    };

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Initialize logic for simple greetings if it's a new empty session
        if (currentMessages.length === 0 && !initialContext && !hasInitialized.current) {
            const greeting = { role: 'assistant', content: `Selam! ${contextNames[activeContext] || 'İş stratejisi'} konusunda sana nasıl yardımcı olabilirim?` };
            onUpdateHistory([greeting]);
            hasInitialized.current = true;
        }
    }, [activeSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages, input]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        const userMessage = { role: 'user', content: userText };

        // Optimistic update
        const newHistory = [...currentMessages, userMessage];
        onUpdateHistory(newHistory);

        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await sendMessageToAI(userText, activeContext, user);
            onUpdateHistory([...newHistory, { role: 'assistant', content: aiResponseText }]);
        } catch (error) {
            console.error('Chat Error:', error);
            onUpdateHistory([...newHistory, { role: 'assistant', content: "Üzgünüm, şu an yanıt veremiyorum. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-overlay">
            <div className="chat-window-container" style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1000px',
                height: '85vh',
                gap: '0',
                background: 'var(--bg-accent)',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>

                {/* Sidebar */}
                <div className="chat-sidebar" style={{
                    width: '280px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRight: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '25px', borderBottom: '1px solid var(--glass-border)' }}>
                        <button
                            onClick={onNewSession}
                            className="action-btn"
                            style={{
                                padding: '12px',
                                fontSize: '0.9rem',
                                background: 'transparent',
                                border: '1px dashed var(--primary-gold)',
                                color: 'var(--primary-gold)'
                            }}
                        >
                            + Yeni Sohbet Başlat
                        </button>
                    </div>

                    <div className="session-list" style={{ overflowY: 'auto', flex: 1, padding: '15px' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '15px', paddingLeft: '10px' }}>
                            GEÇMİŞ SOHBETLER
                        </div>
                        {sessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => onSwitchSession(session.id)}
                                style={{
                                    padding: '15px',
                                    borderRadius: '16px',
                                    marginBottom: '10px',
                                    cursor: 'pointer',
                                    background: session.id === activeSessionId ? 'var(--gold-gradient)' : 'transparent',
                                    border: session.id === activeSessionId ? 'none' : '1px solid transparent',
                                    color: session.id === activeSessionId ? '#000' : 'var(--text-main)',
                                    fontWeight: session.id === activeSessionId ? '700' : '500',
                                    boxShadow: session.id === activeSessionId ? 'var(--gold-glow)' : 'none',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                <div style={{ fontSize: '0.95rem', marginBottom: '4px' }}>
                                    {session.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', opacity: session.id === activeSessionId ? 0.8 : 0.6 }}>{session.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat */}
                <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                    <div className="chat-header" style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4cd964' }}></div>
                            <h3 style={{ fontSize: '1.2rem' }}>
                                {sessions.find(s => s.id === activeSessionId)?.title || 'AI Danışman'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="close-btn" style={{ fontSize: '2rem' }}>×</button>
                    </div>

                    <div className="chat-messages" style={{ flex: 1, padding: '30px' }}>
                        {currentMessages.length === 0 ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', textAlign: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💬</div>
                                    <p>Sohbet başlatmak için bir mesaj yazın veya <br />soldaki listeden seçim yapın.</p>
                                </div>
                            </div>
                        ) : (
                            currentMessages.map((msg, index) => (
                                <div key={index} className={`message-bubble ${msg.role}`} style={{
                                    maxWidth: '85%',
                                    marginBottom: '20px',
                                    animation: 'fadeIn 0.3s ease-out'
                                }}>
                                    <div style={{
                                        padding: '15px 20px',
                                        borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        background: msg.role === 'user' ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === 'user' ? '#000' : '#fff',
                                        border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
                                        boxShadow: msg.role === 'user' ? 'var(--gold-glow)' : 'none',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {msg.content}
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--text-dim)',
                                        marginTop: '6px',
                                        textAlign: msg.role === 'user' ? 'right' : 'left',
                                        padding: '0 5px'
                                    }}>
                                        {msg.role === 'user' ? 'Siz' : 'AI Danışman'}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="message-bubble assistant loading" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px 20px', borderRadius: '20px 20px 20px 4px', width: 'fit-content' }}>
                                <span>•</span><span>•</span><span>•</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend} style={{ padding: '25px', background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid var(--glass-border)' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Bir şeyler sorun veya strateji isteyin..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                padding: '15px 20px',
                                color: '#fff'
                            }}
                        />
                        <button type="submit" disabled={isLoading} style={{
                            padding: '0 25px',
                            borderRadius: '16px',
                            background: 'var(--gold-gradient)',
                            color: '#000',
                            fontWeight: 'bold',
                            boxShadow: 'var(--gold-glow)',
                            opacity: isLoading ? 0.5 : 1
                        }}>
                            {isLoading ? '...' : 'Gönder'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;

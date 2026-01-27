import { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../services/aiService';

const AIChat = ({ activeContext, initialContext, user, onClose }) => {
    const contextNames = {
        income: 'Gelir yükseltme politikası',
        customer: 'Müşteri profili analizi',
        moves: 'Yeni iş hamleleri'
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        if (initialContext?.type === 'report') {
            setIsLoading(true);
            const prompt = `Lütfen "${initialContext.topic}" hakkında haftalık detaylı bir güncelleme ve analiz raporu hazırla. Şu anki Kullanıcı Verileri: ${JSON.stringify(user)}. Bu verilere dayanarak somut çıkarımlar yap.`;

            // Set initial user-side message for clarity (optional, or just show assistant thinking)
            setMessages([{ role: 'user', content: `${initialContext.topic} hakkında haftalık rapor istiyorum.` }]);

            sendMessageToAI(prompt, activeContext, user).then(response => {
                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsLoading(false);
            });
        } else {
            setMessages([
                { role: 'assistant', content: `Selam! ${contextNames[activeContext] || 'İş stratejisi'} konusunda sana nasıl yardımcı olabilirim?` }
            ]);
        }
    }, [initialContext, activeContext, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const response = await sendMessageToAI(input, activeContext, user);
        setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    };

    return (
        <div className="chat-overlay">
            <div className="chat-window">
                <div className="chat-header">
                    <h3>{initialContext?.type === 'report' ? 'Haftalık Rapor' : 'AI Danışman'}</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
                    {isLoading && <div className="message-bubble assistant loading">...</div>}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '...' : 'Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIChat;

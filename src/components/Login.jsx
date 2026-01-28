import { useState } from 'react';
import { userProfile } from '../data/userProfile';
import logo from '../assets/logo.png';

const Login = ({ allUsers, onLogin, onShowRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Check registered users
        const existingUser = (allUsers || []).find(u => u.businessName.toLowerCase() === username.toLowerCase());

        if (existingUser) {
            onLogin(existingUser);
        } else if (username.toLowerCase() === 'inci bar' || username.toLowerCase() === 'incibar') {
            // Hardcoded fallback for demo
            onLogin(userProfile);
        } else {
            setError('Kullanıcı bulunamadı. (Kayıt olduğunuz işletme adını girin)');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">BODO</h1>
                <p className="login-subtitle">Geleceğin İşletme Koçu</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-btn">
                        Giriş Yap
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    Hesabınız yok mu? {' '}
                    <span
                        onClick={onShowRegister}
                        style={{ color: 'var(--primary-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Kaydol
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;

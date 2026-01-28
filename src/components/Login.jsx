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
        const existingUser = (allUsers || []).find(u =>
            (u.username && u.username.toLowerCase() === username.toLowerCase()) ||
            (u.businessName.toLowerCase() === username.toLowerCase())
        );

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
                {/* Logo Replacement */}
                <img
                    src="/BODO.svg"
                    alt="BODO"
                    className="login-logo"
                    style={{
                        width: '200px',
                        marginBottom: '10px',
                        filter: 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.2))'
                    }}
                />
                <p className="login-subtitle" style={{ color: 'var(--primary-gold)', fontWeight: '600' }}>AI destekli İşletme Profili</p>

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

                    <button
                        type="submit"
                        className="login-btn"
                        style={{
                            background: 'var(--primary-gold)', // Flat gold palette
                            boxShadow: 'none', // No glow
                            transform: 'none', // Remove hover lift if desired, or keep it. User said 'no glow' specifically.
                            filter: 'none' // Remove brightness filter on hover if conflicting
                        }}
                    >
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

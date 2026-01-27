import { useState } from 'react';
import { userProfile } from '../data/userProfile';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock validation - accepts any password for now if username matches or is empty for demo
        if (username.toLowerCase() === 'inci bar' || username.toLowerCase() === 'incibar') {
            onLogin(userProfile);
        } else {
            setError('Kullanıcı bulunamadı. (Demo: "İnci Bar" yazın)');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">AI Business Growth</h1>
                <p className="login-subtitle">Geleceği Tasarlayın</p>

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
            </div>
        </div>
    );
};

export default Login;

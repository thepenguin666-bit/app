import { useState } from 'react';
import logo from '../assets/logo.png';

const Register = ({ onRegister, onBackToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        businessType: '',
        city: '',
        launchDate: '',
        address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '450px' }}>
                <h2 className="login-title">BODO'ya Katılın</h2>
                <p className="login-subtitle">İşletmenizi büyütmeye bugün başlayın.</p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', textAlign: 'left' }}>
                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Ad Soyad</label>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Ad Soyad"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>İşletmenin İsmi</label>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Örn: İnci Bar"
                            required
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>İşletme Türü</label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Örn: Restoran / Bar"
                                required
                                value={formData.businessType}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Şehir</label>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Örn: İstanbul"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Açılış Tarihi</label>
                        <input
                            type="date"
                            className="login-input"
                            required
                            value={formData.launchDate}
                            onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Detaylı Adres (İsteğe bağlı)</label>
                        <textarea
                            className="login-input"
                            placeholder="Adres detayları..."
                            rows="2"
                            style={{ resize: 'none' }}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="login-btn">Devam Et</button>
                </form>

                <p style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    Zaten hesabınız var mı? {' '}
                    <span
                        onClick={onBackToLogin}
                        style={{ color: 'var(--primary-gold)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Giriş Yap
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

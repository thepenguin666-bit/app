import { useState } from 'react';

const Onboarding = ({ onComplete }) => {
    const [data, setData] = useState({
        productList: [],
        productCosts: '', // Global fallback or ignore if detailed
        rent: '',
        employeeCount: '',
        totalSalaries: '',
        otherExpenses: ''
    });

    const [newProduct, setNewProduct] = useState({ name: '', price: '', cost: '', quantity: '' });

    const addProduct = () => {
        if (newProduct.name && newProduct.price && newProduct.cost && newProduct.quantity) {
            setData({
                ...data,
                productList: [...data.productList, { ...newProduct, id: Date.now() }]
            });
            setNewProduct({ name: '', price: '', cost: '', quantity: '' });
        }
    };

    const removeProduct = (id) => {
        setData({
            ...data,
            productList: data.productList.filter(p => p.id !== id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.productList.length === 0) {
            alert('Lütfen en az bir ürün ekleyin.');
            return;
        }
        // Prepare legacy compatibility
        const legacyData = {
            ...data,
            products: data.productList.map(p => p.name).join(', '),
            productCosts: Math.round(data.productList.reduce((acc, p) => acc + Number(p.cost), 0) / data.productList.length) || 0
        };
        onComplete(legacyData);
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '500px', width: '90%' }}>
                <h2 className="login-title">İşletme Verileri</h2>
                <p className="login-subtitle">Ürünlerinizi ve maliyetlerinizi detaylandırın.</p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', textAlign: 'left' }}>
                    <div className="data-section" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ marginBottom: '10px', color: 'var(--primary-gold)' }}>Ürün Listesi</h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr auto', gap: '8px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Ürün Adı"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                            <input
                                type="number"
                                className="login-input"
                                placeholder="Fiyat"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                            <input
                                type="number"
                                className="login-input"
                                placeholder="Mal. %"
                                value={newProduct.cost}
                                onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                            />
                            <input
                                type="number"
                                className="login-input"
                                placeholder="Adet/Ay"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                            />
                            <button type="button" onClick={addProduct} className="action-btn" style={{ padding: '0 12px', height: '100%' }}>+</button>
                        </div>

                        <div className="added-products" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                            {data.productList.map(p => {
                                const unitProfit = p.price * (1 - p.cost / 100);
                                const totalProfit = unitProfit * p.quantity;
                                return (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary-gold)' }}>{p.name}</div>
                                            <div style={{ opacity: 0.7 }}>{p.quantity} Adet × {p.price}₺ (%{p.cost} Mal.)</div>
                                        </div>
                                        <div style={{ textAlign: 'right', marginRight: '15px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{totalProfit.toLocaleString('tr-TR')} ₺</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Aylık Toplam Net Kâr</div>
                                        </div>
                                        <button type="button" onClick={() => removeProduct(p.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="input-group">
                            <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Aylık Kira Tutarı (₺)</label>
                            <input
                                type="number"
                                className="login-input"
                                placeholder="0"
                                required
                                value={data.rent}
                                onChange={(e) => setData({ ...data, rent: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Çalışan Sayısı</label>
                            <input
                                type="number"
                                className="login-input"
                                placeholder="0"
                                required
                                value={data.employeeCount}
                                onChange={(e) => setData({ ...data, employeeCount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Toplam Aylık Maaş Gideri (₺)</label>
                        <input
                            type="number"
                            className="login-input"
                            placeholder="0"
                            required
                            value={data.totalSalaries}
                            onChange={(e) => setData({ ...data, totalSalaries: e.target.value })}
                        />
                    </div>

                    <div className="input-group">
                        <label style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '5px', display: 'block' }}>Diğer Sabit Giderler (₺)</label>
                        <input
                            type="number"
                            className="login-input"
                            placeholder="Elektrik, su, internet vb."
                            required
                            value={data.otherExpenses}
                            onChange={(e) => setData({ ...data, otherExpenses: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="login-btn">Kurulumu Tamamla</button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;

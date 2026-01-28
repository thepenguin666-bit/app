
import { useState, useRef, useEffect } from 'react';

const DataHistory = ({ data: user, onUpdate, onClose }) => {
    const contentRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState('current'); // 'current' or date string
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState(user);

    // Mock History Data
    const historyData = [
        {
            id: 'hist_1',
            dateLabel: '01.01.2026',
            rent: '15000',
            totalSalaries: '45000',
            otherExpenses: '3200',
            employeeCount: 3,
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

    // Sync local data if external user data changes
    useEffect(() => {
        setLocalData(user);
    }, [user]);

    const handleSave = () => {
        onUpdate(localData);
        setIsEditing(false);
    };

    // Determine which data to show
    const isCurrent = selectedTab === 'current';
    const displayData = isCurrent ? (isEditing ? localData : user) : historyData.find(h => h.dateLabel === selectedTab);

    // Helpers for calculations
    const calculateStats = (d) => {
        const productProfit = (d?.productList || []).reduce((acc, p) => acc + ((Number(p.price) - Number(p.cost)) * Number(p.quantity)), 0);
        const fixed = Number(d?.rent || 0) + Number(d?.totalSalaries || 0) + Number(d?.otherExpenses || 0);
        const dynamic = (d?.additionalExpenses || []).reduce((acc, cat) => acc + (cat.items || []).reduce((sum, item) => sum + Number(item.cost), 0), 0);
        const totalExpenses = fixed + dynamic;
        return {
            totalExpenses,
            netProfit: productProfit - totalExpenses
        };
    };

    const stats = calculateStats(displayData);

    return (
        <div className="data-history-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="data-history-container" style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '900px',
                width: '95%',
                height: '85vh',
                background: '#13131a',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>

                {/* TOP NAVIGATION BAR */}
                <div
                    className="history-topbar"
                    style={{
                        width: '100%',
                        height: '60px',
                        background: 'rgba(0,0,0,0.3)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        padding: '0 10px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                    }}
                >
                    <h2 style={{ fontSize: '1rem', margin: '0 15px 0 5px', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📅</span> Dönemler
                    </h2>

                    {/* Tabs Container */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div
                            onClick={() => setSelectedTab('current')}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                background: selectedTab === 'current' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.05)',
                                color: selectedTab === 'current' ? '#000' : 'rgba(255,255,255,0.6)',
                                fontWeight: selectedTab === 'current' ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                height: '36px',
                                border: selectedTab === 'current' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{ fontSize: '1rem', marginRight: '6px' }}>⚡</span>
                            <span style={{ fontSize: '0.9rem' }}>Mevcut Ay</span>
                        </div>

                        {historyData.map(hist => (
                            <div
                                key={hist.id}
                                onClick={() => setSelectedTab(hist.dateLabel)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    background: selectedTab === hist.dateLabel ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                                    color: selectedTab === hist.dateLabel ? '#fff' : 'rgba(255,255,255,0.6)',
                                    border: selectedTab === hist.dateLabel ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '36px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1rem', marginRight: '6px' }}>📜</span>
                                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                                    <span style={{ fontSize: '0.85rem' }}>{hist.dateLabel}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="history-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', width: '100%' }}>

                    <div className="history-header" style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{isCurrent ? "Veri Analizi" : `Arşiv: ${selectedTab}`}</h2>
                            {!isCurrent && <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>Salt Okunur</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {isCurrent && (
                                <button
                                    className="action-btn"
                                    style={{ padding: '6px 15px', marginTop: 0, fontSize: '0.85rem', width: 'auto', background: isEditing ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.1)', color: isEditing ? '#000' : '#fff', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                >
                                    {isEditing ? '✓ Kaydet' : '✎ Düzenle'}
                                </button>
                            )}
                            <button className="close-btn" style={{ fontSize: '1.4rem', lineHeight: '1', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} onClick={onClose}>×</button>
                        </div>
                    </div>

                    <div className="history-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                            <div className="stat-card highlight" style={{ padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px', opacity: 0.8 }}>Toplam Gider</h3>
                                <div className="stat-value" style={{ fontSize: '1.6rem', margin: 0 }}>
                                    {stats.totalExpenses.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                            <div className="stat-card highlight" style={{ border: '1px solid var(--primary-gold)', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px', opacity: 0.8 }}>Tahmini Net Kar</h3>
                                <div className="stat-value" style={{ fontSize: '1.6rem', color: 'var(--primary-gold)', margin: 0 }}>
                                    {stats.netProfit.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                        </div>

                        {/* Product List - CARD STYLE */}
                        <div className="data-section" style={{ marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px', borderLeft: '3px solid var(--primary-gold)', paddingLeft: '10px' }}>Ürün Analizi</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(displayData?.productList || []).map((product, index) => (
                                    <div key={product.id || index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '15px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.05)'
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
                                                {isCurrent && isEditing ? (
                                                    <input
                                                        value={product.name}
                                                        onChange={(e) => {
                                                            const newList = [...localData.productList];
                                                            newList[index].name = e.target.value;
                                                            setLocalData({ ...localData, productList: newList });
                                                        }}
                                                        className="edit-input"
                                                        style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '2px', width: '150px', textAlign: 'left' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', textAlign: 'left' }}>{product.name}</span>
                                                )}

                                                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                                                    Stok: {product.stock || (Math.floor(Math.random() * 50) + 10)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right: Price/Quantity Info */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            {isCurrent && isEditing ? (
                                                <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                                    <input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) => {
                                                            const newList = [...localData.productList];
                                                            newList[index].quantity = e.target.value;
                                                            setLocalData({ ...localData, productList: newList });
                                                        }}
                                                        className="edit-input" style={{ width: '50px', textAlign: 'center' }}
                                                    />
                                                    <span style={{ alignSelf: 'center' }}>/</span>
                                                    <input
                                                        type="number"
                                                        value={product.price}
                                                        onChange={(e) => {
                                                            const newList = [...localData.productList];
                                                            newList[index].price = e.target.value;
                                                            setLocalData({ ...localData, productList: newList });
                                                        }}
                                                        className="edit-input" style={{ width: '70px', textAlign: 'right' }}
                                                    />
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                                    {product.quantity} adet / ₺{Number(product.price).toLocaleString()}
                                                </span>
                                            )}

                                            {/* Mock Trend - "(bu ay) ▼ %10" */}
                                            <span style={{ fontSize: '0.8rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                (bu ay) <span style={{ fontSize: '0.7rem' }}>▼</span> %{Math.floor(Math.random() * 10) + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isCurrent && isEditing && (
                                    <button
                                        className="action-btn"
                                        onClick={() => {
                                            const newList = [...(localData.productList || []), { id: Date.now(), name: 'Yeni Ürün', price: 0, cost: 0, quantity: 0, stock: 100 }];
                                            setLocalData({ ...localData, productList: newList });
                                        }}
                                        style={{ width: '100%', marginTop: '0', padding: '10px', background: 'rgba(197, 160, 89, 0.1)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem', color: 'var(--primary-gold)' }}
                                    >
                                        + Yeni Ürün Ekle
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Expenses Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            {/* Fixed Expenses List */}
                            <div className="data-section">
                                <h3 style={{ fontSize: '1rem', marginBottom: '10px', borderLeft: '3px solid #ff6b6b', paddingLeft: '10px' }}>Sabit Giderler</h3>
                                <div className="data-list" style={{ fontSize: '0.9rem' }}>
                                    <div className="data-list-item" style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.02)' }}>
                                        <span>Kira Gideri</span>
                                        {isCurrent && isEditing ? (
                                            <input
                                                type="number"
                                                value={localData.rent}
                                                onChange={(e) => setLocalData({ ...localData, rent: e.target.value })}
                                                className="edit-input" style={{ padding: '4px', maxWidth: '100px', textAlign: 'right' }}
                                            />
                                        ) : (
                                            <span className="expense-amount">-{Number(displayData?.rent || 0).toLocaleString('tr-TR')} ₺</span>
                                        )}
                                    </div>
                                    <div className="data-list-item" style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.02)' }}>
                                        <span>Maaş Sum. ({displayData?.employeeCount || user?.employeeCount})</span>
                                        {isCurrent && isEditing ? (
                                            <input
                                                type="number"
                                                value={localData.totalSalaries}
                                                onChange={(e) => setLocalData({ ...localData, totalSalaries: e.target.value })}
                                                className="edit-input" style={{ padding: '4px', maxWidth: '100px', textAlign: 'right' }}
                                            />
                                        ) : (
                                            <span className="expense-amount">-{Number(displayData?.totalSalaries || 0).toLocaleString('tr-TR')} ₺</span>
                                        )}
                                    </div>
                                    <div className="data-list-item" style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.02)' }}>
                                        <span>Operasyonel</span>
                                        {isCurrent && isEditing ? (
                                            <input
                                                type="number"
                                                value={localData.otherExpenses}
                                                onChange={(e) => setLocalData({ ...localData, otherExpenses: e.target.value })}
                                                className="edit-input" style={{ padding: '4px', maxWidth: '100px', textAlign: 'right' }}
                                            />
                                        ) : (
                                            <span className="expense-amount">-{Number(displayData?.otherExpenses || 0).toLocaleString('tr-TR')} ₺</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Expenses Section */}
                            <div className="data-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ fontSize: '1rem', margin: 0, borderLeft: '3px solid #ff9f43', paddingLeft: '10px' }}>Ek Giderler</h3>
                                    {isCurrent && isEditing && (
                                        <button
                                            onClick={() => {
                                                const newCat = { id: Date.now(), title: 'Yeni', items: [] };
                                                setLocalData({ ...localData, additionalExpenses: [...(localData.additionalExpenses || []), newCat] });
                                            }}
                                            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                                        >
                                            + Kategori
                                        </button>
                                    )}
                                </div>

                                {(displayData?.additionalExpenses || []).map((cat, catIndex) => (
                                    <div key={cat.id} className="data-list" style={{ marginBottom: '10px' }}>
                                        <div className="data-list-item" style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px', minHeight: '36px' }}>
                                            {isCurrent && isEditing ? (
                                                <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
                                                    <input
                                                        value={cat.title}
                                                        onChange={(e) => {
                                                            const newExp = [...localData.additionalExpenses];
                                                            newExp[catIndex].title = e.target.value;
                                                            setLocalData({ ...localData, additionalExpenses: newExp });
                                                        }}
                                                        className="edit-input" style={{ fontWeight: 'bold', color: 'var(--primary-gold)', padding: '4px', background: 'transparent', borderBottom: '1px solid var(--primary-gold)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0' }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newExp = localData.additionalExpenses.filter((_, i) => i !== catIndex);
                                                            setLocalData({ ...localData, additionalExpenses: newExp });
                                                        }}
                                                        style={{ color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                    >🗑️</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold', fontSize: '0.9rem' }}>{cat.title}</span>
                                            )}
                                        </div>

                                        {/* Items under Category */}
                                        {(cat.items || []).map((item, itemIndex) => (
                                            <div key={item.id} className="data-list-item" style={{ padding: '4px 12px', fontSize: '0.85rem', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                {isCurrent && isEditing ? (
                                                    <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                                                        <input
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const newExp = [...localData.additionalExpenses];
                                                                newExp[catIndex].items[itemIndex].name = e.target.value;
                                                                setLocalData({ ...localData, additionalExpenses: newExp });
                                                            }}
                                                            className="edit-input" placeholder="Ad" style={{ padding: '4px', flex: 1 }}
                                                        />
                                                        <input
                                                            type="number"
                                                            value={item.cost}
                                                            onChange={(e) => {
                                                                const newExp = [...localData.additionalExpenses];
                                                                newExp[catIndex].items[itemIndex].cost = e.target.value;
                                                                setLocalData({ ...localData, additionalExpenses: newExp });
                                                            }}
                                                            className="edit-input" placeholder="Tutar" style={{ padding: '4px', width: '60px', textAlign: 'right' }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                const newExp = [...localData.additionalExpenses];
                                                                newExp[catIndex].items = newExp[catIndex].items.filter((_, i) => i !== itemIndex);
                                                                setLocalData({ ...localData, additionalExpenses: newExp });
                                                            }}
                                                            style={{ color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                        >×</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{item.name}</span>
                                                        <span className="expense-amount">-{Number(item.cost).toLocaleString()} ₺</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        {isCurrent && isEditing && (
                                            <button
                                                onClick={() => {
                                                    const newExp = [...localData.additionalExpenses];
                                                    newExp[catIndex].items.push({ id: Date.now(), name: 'Yeni', cost: 0 });
                                                    setLocalData({ ...localData, additionalExpenses: newExp });
                                                }}
                                                style={{ background: 'transparent', border: 'none', width: '100%', padding: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0', cursor: 'pointer', textAlign: 'left', paddingLeft: '12px' }}
                                            >
                                                + Ekle
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;

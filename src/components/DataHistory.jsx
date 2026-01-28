
import { useState, useRef, useEffect } from 'react';

const DataHistory = ({ data: user, onUpdate, onClose }) => {
    const contentRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState('current'); // 'current' or date string
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState(user);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Collapsed by default

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
                { id: 101, name: 'Eski Sezon Defter', price: 120, cost: 30, quantity: 15 },
                { id: 102, name: '2025 Kalem Seti', price: 250, cost: 80, quantity: 40 }
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
                flexDirection: 'row',
                maxWidth: '1000px', // Reduced max-width for better compactness
                width: '95%',
                height: '85vh', // Slightly reduced height
                background: '#13131a',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>

                {/* SIDEBAR */}
                <div
                    className="history-sidebar"
                    style={{
                        width: isSidebarOpen ? '220px' : '50px', // Slightly smaller
                        background: 'rgba(0,0,0,0.3)',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        zIndex: 10,
                        overflow: 'hidden'
                    }}
                >
                    {/* Toggle Handle/Header */}
                    <div
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{
                            padding: '0',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '50px',
                            minHeight: '50px',
                            whiteSpace: 'nowrap',
                            background: isSidebarOpen ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                    >
                        {isSidebarOpen ? (
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '15px' }}>
                                <span style={{ marginRight: '10px', fontSize: '1rem' }}>◀</span>
                                <h2 style={{ fontSize: '0.9rem', margin: 0, color: '#fff' }}>Dönemler</h2>
                            </div>
                        ) : (
                            <span style={{ fontSize: '1.2rem' }}>📅</span>
                        )}
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '5px', overflowX: 'hidden' }}>
                        {/* Current Month Item */}
                        <div
                            onClick={() => { setSelectedTab('current'); if (!isSidebarOpen) setIsSidebarOpen(true); }}
                            style={{
                                padding: '8px 8px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginBottom: '4px',
                                background: selectedTab === 'current' ? 'var(--gold-gradient)' : 'transparent',
                                color: selectedTab === 'current' ? '#000' : 'rgba(255,255,255,0.6)',
                                fontWeight: selectedTab === 'current' ? 'bold' : 'normal',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                height: '40px',
                                minWidth: '35px'
                            }}
                            title="Mevcut Ay"
                        >
                            <span style={{ fontSize: '1rem', minWidth: '20px', textAlign: 'center', marginRight: isSidebarOpen ? '10px' : 0 }}>⚡</span>
                            {isSidebarOpen && <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>Mevcut Ay</span>}
                        </div>

                        {/* History Items */}
                        {historyData.map(hist => (
                            <div
                                key={hist.id}
                                onClick={() => { setSelectedTab(hist.dateLabel); if (!isSidebarOpen) setIsSidebarOpen(true); }}
                                style={{
                                    padding: '8px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    marginBottom: '4px',
                                    background: selectedTab === hist.dateLabel ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: selectedTab === hist.dateLabel ? '#fff' : 'rgba(255,255,255,0.4)',
                                    border: selectedTab === hist.dateLabel ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                                    height: '40px',
                                    minWidth: '35px'
                                }}
                                title={hist.dateLabel}
                            >
                                <span style={{ fontSize: '1rem', minWidth: '20px', textAlign: 'center', marginRight: isSidebarOpen ? '10px' : 0 }}>📜</span>
                                {isSidebarOpen && (
                                    <div style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'nowrap' }}>
                                        <span style={{ fontSize: '0.9rem' }}>{hist.dateLabel}</span>
                                        <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>Arşiv</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="history-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

                    <div className="history-header" style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{isCurrent ? "Veriler" : `Arşiv: ${selectedTab}`}</h2>
                            {!isCurrent && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Salt Okunur</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {isCurrent && (
                                <button
                                    className="action-btn"
                                    style={{ padding: '6px 12px', marginTop: 0, fontSize: '0.8rem', width: 'auto', background: isEditing ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.1)', color: isEditing ? '#000' : '#fff' }}
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                >
                                    {isEditing ? '✓ Kaydet' : '✎ Düzenle'}
                                </button>
                            )}
                            <button className="close-btn" style={{ fontSize: '1.2rem', lineHeight: '1rem' }} onClick={onClose}>×</button>
                        </div>
                    </div>

                    <div className="history-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* Stats Cards - COMPACT */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div className="stat-card highlight" style={{ padding: '15px' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Toplam Gider</h3>
                                <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                                    {stats.totalExpenses.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                            <div className="stat-card highlight" style={{ border: '1px solid var(--primary-gold)', padding: '15px' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Tahmini Net Kar</h3>
                                <div className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--primary-gold)' }}>
                                    {stats.netProfit.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                        </div>

                        {/* Product Table - COMPACT */}
                        <div className="data-section" style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Ürün Analizi</h3>
                            <div className="data-table" style={{ fontSize: '0.9rem' }}>
                                <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr', padding: '8px 0', fontSize: '0.85rem' }}>
                                    <span>Ürün</span>
                                    <span>Adet</span>
                                    <span>Fiyat</span>
                                    <span>Maliyet</span>
                                    <span>Kazanç</span>
                                </div>
                                {(displayData?.productList || []).map((product, index) => (
                                    <div key={product.id || index} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {isCurrent && isEditing ? (
                                            <>
                                                <input
                                                    value={product.name}
                                                    onChange={(e) => {
                                                        const newList = [...localData.productList];
                                                        newList[index].name = e.target.value;
                                                        setLocalData({ ...localData, productList: newList });
                                                    }}
                                                    className="edit-input" style={{ padding: '4px', fontSize: '0.9rem' }}
                                                />
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={(e) => {
                                                        const newList = [...localData.productList];
                                                        newList[index].quantity = e.target.value;
                                                        setLocalData({ ...localData, productList: newList });
                                                    }}
                                                    className="edit-input" style={{ padding: '4px', fontSize: '0.9rem' }}
                                                />
                                                <input
                                                    type="number"
                                                    value={product.price}
                                                    onChange={(e) => {
                                                        const newList = [...localData.productList];
                                                        newList[index].price = e.target.value;
                                                        setLocalData({ ...localData, productList: newList });
                                                    }}
                                                    className="edit-input" style={{ padding: '4px', fontSize: '0.9rem' }}
                                                />
                                                <input
                                                    type="number"
                                                    value={product.cost}
                                                    onChange={(e) => {
                                                        const newList = [...localData.productList];
                                                        newList[index].cost = e.target.value;
                                                        setLocalData({ ...localData, productList: newList });
                                                    }}
                                                    className="edit-input" style={{ padding: '4px', fontSize: '0.9rem' }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={product.name}>{product.name}</span>
                                                <span>{product.quantity}</span>
                                                <span>{Number(product.price).toLocaleString()} ₺</span>
                                                <span>{Number(product.cost).toLocaleString()} ₺</span>
                                            </>
                                        )}
                                        <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                                            {((Number(product.price) - Number(product.cost)) * Number(product.quantity)).toLocaleString()} ₺
                                        </span>
                                    </div>
                                ))}

                                {isCurrent && isEditing && (
                                    <button
                                        className="action-btn"
                                        onClick={() => {
                                            const newList = [...(localData.productList || []), { id: Date.now(), name: 'Yeni Ürün', price: 0, cost: 0 }];
                                            setLocalData({ ...localData, productList: newList });
                                        }}
                                        style={{ width: '100%', marginTop: '10px', padding: '6px', background: 'transparent', border: '1px dashed var(--primary-gold)', fontSize: '0.85rem' }}
                                    >
                                        + Yeni Ürün Ekle
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Fixed Expenses List - COMPACT */}
                        <div className="data-section" style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Sabit Giderler</h3>
                            <div className="data-list" style={{ fontSize: '0.9rem' }}>
                                <div className="data-list-item" style={{ padding: '8px 10px' }}>
                                    <span>Kira Gideri</span>
                                    {isCurrent && isEditing ? (
                                        <input
                                            type="number"
                                            value={localData.rent}
                                            onChange={(e) => setLocalData({ ...localData, rent: e.target.value })}
                                            className="edit-input" style={{ padding: '4px', maxWidth: '100px' }}
                                        />
                                    ) : (
                                        <span className="expense-amount">-{Number(displayData?.rent || 0).toLocaleString('tr-TR')} ₺</span>
                                    )}
                                </div>
                                <div className="data-list-item" style={{ padding: '8px 10px' }}>
                                    <span>Maaş ({displayData?.employeeCount || user?.employeeCount} Kişi)</span>
                                    {isCurrent && isEditing ? (
                                        <input
                                            type="number"
                                            value={localData.totalSalaries}
                                            onChange={(e) => setLocalData({ ...localData, totalSalaries: e.target.value })}
                                            className="edit-input" style={{ padding: '4px', maxWidth: '100px' }}
                                        />
                                    ) : (
                                        <span className="expense-amount">-{Number(displayData?.totalSalaries || 0).toLocaleString('tr-TR')} ₺</span>
                                    )}
                                </div>
                                <div className="data-list-item" style={{ padding: '8px 10px' }}>
                                    <span>Operasyonel</span>
                                    {isCurrent && isEditing ? (
                                        <input
                                            type="number"
                                            value={localData.otherExpenses}
                                            onChange={(e) => setLocalData({ ...localData, otherExpenses: e.target.value })}
                                            className="edit-input" style={{ padding: '4px', maxWidth: '100px' }}
                                        />
                                    ) : (
                                        <span className="expense-amount">-{Number(displayData?.otherExpenses || 0).toLocaleString('tr-TR')} ₺</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Expenses Section - COMPACT */}
                        <div className="data-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1rem', margin: 0 }}>Ek Giderler</h3>
                                {isCurrent && isEditing && (
                                    <button
                                        onClick={() => {
                                            const newCat = { id: Date.now(), title: 'Yeni Kategori', items: [] };
                                            setLocalData({ ...localData, additionalExpenses: [...(localData.additionalExpenses || []), newCat] });
                                        }}
                                        style={{ background: 'var(--primary-gold)', color: '#000', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                                    >
                                        + Kategori
                                    </button>
                                )}
                            </div>

                            {(displayData?.additionalExpenses || []).map((cat, catIndex) => (
                                <div key={cat.id} className="data-list" style={{ marginBottom: '15px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '10px' }}>
                                    <div className="data-list-item" style={{ background: 'rgba(255,255,255,0.03)', marginBottom: '5px', padding: '8px', borderRadius: '6px' }}>
                                        {isCurrent && isEditing ? (
                                            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                                <input
                                                    value={cat.title}
                                                    onChange={(e) => {
                                                        const newExp = [...localData.additionalExpenses];
                                                        newExp[catIndex].title = e.target.value;
                                                        setLocalData({ ...localData, additionalExpenses: newExp });
                                                    }}
                                                    className="edit-input" style={{ fontWeight: 'bold', color: 'var(--primary-gold)', padding: '4px' }}
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
                                        <div key={item.id} className="data-list-item" style={{ paddingLeft: '15px', padding: '4px 0 4px 15px', fontSize: '0.85rem' }}>
                                            {isCurrent && isEditing ? (
                                                <>
                                                    <input
                                                        value={item.name}
                                                        onChange={(e) => {
                                                            const newExp = [...localData.additionalExpenses];
                                                            newExp[catIndex].items[itemIndex].name = e.target.value;
                                                            setLocalData({ ...localData, additionalExpenses: newExp });
                                                        }}
                                                        className="edit-input" placeholder="Ad" style={{ padding: '4px', width: '40%' }}
                                                    />
                                                    <input
                                                        type="number"
                                                        value={item.cost}
                                                        onChange={(e) => {
                                                            const newExp = [...localData.additionalExpenses];
                                                            newExp[catIndex].items[itemIndex].cost = e.target.value;
                                                            setLocalData({ ...localData, additionalExpenses: newExp });
                                                        }}
                                                        className="edit-input" placeholder="Tutar" style={{ padding: '4px', width: '30%' }}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newExp = [...localData.additionalExpenses];
                                                            newExp[catIndex].items = newExp[catIndex].items.filter((_, i) => i !== itemIndex);
                                                            setLocalData({ ...localData, additionalExpenses: newExp });
                                                        }}
                                                        style={{ color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                                    >×</button>
                                                </>
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
                                                newExp[catIndex].items.push({ id: Date.now(), name: 'Yeni Harcama', cost: 0 });
                                                setLocalData({ ...localData, additionalExpenses: newExp });
                                            }}
                                            style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', width: '100%', padding: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '5px', cursor: 'pointer' }}
                                        >
                                            + Harcama Ekle
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;

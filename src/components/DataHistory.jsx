
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const DataHistory = ({ data: user, historyData: propHistoryData = [], onUpdate, onArchive, onClose }) => {
    const contentRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState('current'); // 'current' or date string
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState(user);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showArchivePrompt, setShowArchivePrompt] = useState(false);
    const [archiveLabel, setArchiveLabel] = useState('');
    const [newProduct, setNewProduct] = useState({ name: '', cost: '', price: '', quantity: '', stock: '' });

    // Combine real history and mock data for display
    const historyData = [...(user.history || []), ...propHistoryData];

    const handleArchive = () => {
        if (!archiveLabel.trim()) return;
        onArchive({
            ...localData,
            id: 'arch_' + Date.now(),
            dateLabel: archiveLabel
        });
        setShowArchivePrompt(false);
        setArchiveLabel('');
    };

    // Sync local data if external user data changes
    useEffect(() => {
        setLocalData(user);
    }, [user]);

    const handleSave = () => {
        onUpdate(localData);
        setIsEditing(false);
    };

    const handleDeleteProduct = (index) => {
        const newList = [...localData.productList];
        newList.splice(index, 1);
        setLocalData({ ...localData, productList: newList });
    };

    const handleAddProduct = () => {
        if (!newProduct.name) return; // Basic validation
        const productToAdd = {
            id: Date.now(),
            name: newProduct.name,
            cost: newProduct.cost || 0,
            price: newProduct.price || 0,
            quantity: newProduct.quantity || 0,
            stock: newProduct.stock || 0
        };
        setLocalData({ ...localData, productList: [...(localData.productList || []), productToAdd] });
        setNewProduct({ name: '', cost: '', price: '', quantity: '', stock: '' });
        setShowAddModal(false);
    };

    // Determine which data to show
    const isCurrent = selectedTab === 'current';
    const displayData = isCurrent ? (isEditing ? localData : user) : historyData.find(h => h.dateLabel === selectedTab);

    // Helpers for calculations
    const calculateStats = (d) => {
        const totalRevenue = (d?.productList || []).reduce((acc, p) => acc + (Number(p.price) * Number(p.quantity)), 0);
        const totalCOGS = (d?.productList || []).reduce((acc, p) => acc + (Number(p.cost || 0) * Number(p.quantity)), 0);

        const fixed = Number(d?.rent || 0) + Number(d?.totalSalaries || 0) + Number(d?.otherExpenses || 0);
        const dynamic = (d?.additionalExpenses || []).reduce((acc, cat) => acc + (cat.items || []).reduce((sum, item) => sum + Number(item.cost), 0), 0);

        const totalExpenses = fixed + dynamic + totalCOGS;
        return {
            totalRevenue,
            totalExpenses,
            netProfit: totalRevenue - totalExpenses
        };
    };

    const stats = calculateStats(displayData);

    return ReactDOM.createPortal(
        <div className="data-history-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9000,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)'
        }}>

            {/* ARCHIVE NAME PROMPT MODAL */}
            {showArchivePrompt && ReactDOM.createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div style={{
                        background: '#1a1a24',
                        padding: '30px',
                        borderRadius: '20px',
                        width: '380px',
                        border: '1px solid var(--primary-gold)',
                        boxShadow: '0 0 30px rgba(212,175,55,0.2)'
                    }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', textAlign: 'center', color: 'var(--primary-gold)' }}>Dönemi Arşivle</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '20px' }}>
                            Bu ayı geçmiş verilere kaydetmek üzeresiniz. Lütfen bir isim verin.
                        </p>

                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Dönem İsmi (örn: Ocak 2026)</label>
                        <input
                            autoFocus
                            value={archiveLabel}
                            onChange={(e) => setArchiveLabel(e.target.value)}
                            placeholder="Dönem adı..."
                            className="edit-input" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '25px' }}
                        />

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowArchivePrompt(false)}
                                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleArchive}
                                disabled={!archiveLabel.trim()}
                                style={{ flex: 1, padding: '12px', background: 'var(--gold-gradient)', opacity: !archiveLabel.trim() ? 0.5 : 1, border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Kaydet ve Arşivle
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ADD PRODUCT MODAL */}
            {showAddModal && ReactDOM.createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: '#1a1a24',
                        padding: '25px',
                        borderRadius: '16px',
                        width: '400px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center' }}>Yeni Ürün Ekle</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Ürün İsmi</label>
                                <input
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="edit-input" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Maliyet (₺)</label>
                                    <input
                                        type="number"
                                        value={newProduct.cost}
                                        onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                                        className="edit-input" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Satış Fiyatı (₺)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="edit-input" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Satış Adedi</label>
                                    <input
                                        type="number"
                                        value={newProduct.quantity}
                                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                        className="edit-input" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Stok Bilgisi</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="edit-input" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleAddProduct}
                                style={{ flex: 1, padding: '12px', background: 'var(--gold-gradient)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
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
                                <>
                                    <button
                                        className="action-btn"
                                        style={{ padding: '6px 15px', marginTop: 0, fontSize: '0.85rem', width: 'auto', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--primary-gold)', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => setShowArchivePrompt(true)}
                                    >
                                        📥 Dönemi Arşivle
                                    </button>
                                    <button
                                        className="action-btn"
                                        style={{ padding: '6px 15px', marginTop: 0, fontSize: '0.85rem', width: 'auto', background: isEditing ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.1)', color: isEditing ? '#000' : '#fff', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    >
                                        {isEditing ? '✓ Kaydet' : '✎ Düzenle'}
                                    </button>
                                </>
                            )}
                            <button className="close-btn" style={{ fontSize: '1.4rem', lineHeight: '1', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} onClick={onClose}>×</button>
                        </div>
                    </div>

                    <div className="history-content" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                            <div className="stat-card highlight" style={{
                                border: '1px solid #2ecc71',
                                boxShadow: '0 0 15px rgba(46, 204, 113, 0.15)',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '12px',
                                background: 'rgba(46, 204, 113, 0.05)'
                            }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px', opacity: 0.8, color: '#2ecc71' }}>Toplam Gelir</h3>
                                <div className="stat-value" style={{ fontSize: '1.6rem', color: '#2ecc71', margin: 0, textShadow: '0 0 10px rgba(46,204,113,0.3)' }}>
                                    +{stats.totalRevenue.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                            <div className="stat-card highlight" style={{
                                border: '1px solid #ff4d4d',
                                boxShadow: '0 0 15px rgba(255, 77, 77, 0.15)',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '12px',
                                background: 'rgba(255, 77, 77, 0.05)'
                            }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '5px', opacity: 0.8, color: '#ff4d4d' }}>Toplam Gider</h3>
                                <div className="stat-value" style={{ fontSize: '1.6rem', margin: 0, color: '#ff4d4d', textShadow: '0 0 10px rgba(255,77,77,0.3)' }}>
                                    -{stats.totalExpenses.toLocaleString('tr-TR')} ₺
                                </div>
                            </div>
                        </div>

                        {/* Product List - CARD STYLE */}
                        <div className="data-section" style={{ marginBottom: '25px' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px', borderLeft: '3px solid var(--primary-gold)', paddingLeft: '10px' }}>Ürün Analizi</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(displayData?.productList || []).map((product, index) => {
                                    // Calculate Logic: Compare with previous month (first item in history for now)
                                    // If viewing history, we could compare with the one before it, but for simplicity let's compare with the "previous" defined in historyData if we are on current.
                                    const previousData = isCurrent ? historyData[0] : null; // Simple logic: Current vs Latest History
                                    const prevProduct = previousData?.productList?.find(p => p.name === product.name || p.id === product.id);

                                    const currentTotal = Number(product.price) * Number(product.quantity);
                                    const prevTotal = prevProduct ? (Number(prevProduct.price) * Number(prevProduct.quantity)) : 0;

                                    let percentChange = 0;
                                    let isPositive = false;

                                    if (prevTotal > 0) {
                                        const diff = currentTotal - prevTotal;
                                        percentChange = Math.round((Math.abs(diff) / prevTotal) * 100);
                                        isPositive = diff >= 0;
                                    }

                                    return (
                                        <div key={product.id || index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 15px', // Reduced padding
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            marginBottom: '8px', // Reduced margin
                                            minHeight: '60px'
                                        }}>
                                            {/* Left: Icon + Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {/* Circle Icon */}
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.1rem',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }}>
                                                    📦
                                                </div>

                                                {/* Text Block - Italicized, Left Aligned */}
                                                <div style={{ display: 'flex', flexDirection: 'column', fontStyle: 'italic', alignItems: 'flex-start', textAlign: 'left', gap: '0px' }}>
                                                    {isCurrent && isEditing ? (
                                                        <input
                                                            value={product.name}
                                                            onChange={(e) => {
                                                                const newList = [...localData.productList];
                                                                newList[index].name = e.target.value;
                                                                setLocalData({ ...localData, productList: newList });
                                                            }}
                                                            className="edit-input"
                                                            style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0', width: '130px', textAlign: 'left' }}
                                                        />
                                                    ) : (
                                                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', textAlign: 'left', lineHeight: '1.2' }}>{product.name}</span>
                                                    )}

                                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textAlign: 'left' }}>
                                                        Stok: {product.stock || (Math.floor(Math.random() * 50) + 10)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right: Price/Quantity Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                                    {isCurrent && isEditing ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end', marginBottom: '2px' }}>
                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                <input
                                                                    type="number"
                                                                    value={product.quantity}
                                                                    onChange={(e) => {
                                                                        const newList = [...localData.productList];
                                                                        newList[index].quantity = e.target.value;
                                                                        setLocalData({ ...localData, productList: newList });
                                                                    }}
                                                                    className="edit-input" style={{ width: '40px', textAlign: 'center', fontSize: '0.8rem', padding: '2px' }}
                                                                />
                                                                <span style={{ alignSelf: 'center', fontSize: '0.8rem' }}>/</span>
                                                                <input
                                                                    type="number"
                                                                    value={product.price}
                                                                    onChange={(e) => {
                                                                        const newList = [...localData.productList];
                                                                        newList[index].price = e.target.value;
                                                                        setLocalData({ ...localData, productList: newList });
                                                                    }}
                                                                    className="edit-input" style={{ width: '55px', textAlign: 'right', fontSize: '0.8rem', padding: '2px' }}
                                                                />
                                                            </div>
                                                            <input
                                                                type="number"
                                                                placeholder="Maliyet"
                                                                value={product.cost}
                                                                onChange={(e) => {
                                                                    const newList = [...localData.productList];
                                                                    newList[index].cost = e.target.value;
                                                                    setLocalData({ ...localData, productList: newList });
                                                                }}
                                                                className="edit-input" style={{ width: '55px', textAlign: 'right', fontSize: '0.75rem', padding: '2px', color: 'rgba(255,255,255,0.6)' }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
                                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                                                {product.quantity} adet / ₺{Number(product.price).toLocaleString()}
                                                            </span>
                                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                                                                Maliyet: ₺{Number(product.cost || 0).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Trend - Real Calculation */}
                                                    {prevProduct ? (
                                                        <span style={{ fontSize: '0.7rem', color: isPositive ? '#4cd137' : '#ff6b6b', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                                            (bu ay) <span style={{ fontSize: '0.6rem' }}>{isPositive ? '▲' : '▼'}</span> %{percentChange}
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                                            (yeni ürün)
                                                        </span>
                                                    )}
                                                </div>

                                                {/* DELETE BUTTON (Edit Mode Only) */}
                                                {isCurrent && isEditing && (
                                                    <button
                                                        onClick={() => handleDeleteProduct(index)}
                                                        style={{
                                                            width: '28px', height: '28px',
                                                            borderRadius: '50%',
                                                            background: 'rgba(255,50,50,0.1)',
                                                            color: '#ff4d4d',
                                                            border: '1px solid rgba(255,50,50,0.3)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', fontSize: '1rem'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {isCurrent && isEditing && (
                                    <button
                                        className="action-btn"
                                        onClick={() => setShowAddModal(true)}
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
        </div>,
        document.body
    );
};

export default DataHistory;

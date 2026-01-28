import { useState, useRef, useEffect } from 'react';

const DataHistory = ({ data: user, onUpdate, onClose }) => {
    const contentRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [localData, setLocalData] = useState(user);

    // Sync local data if external user data changes
    useEffect(() => {
        setLocalData(user);
    }, [user]);

    const handleSave = () => {
        onUpdate(localData);
        setIsEditing(false);
    };

    const data = isEditing ? localData : user;

    return (
        <div className="data-history-overlay">
            <div className="data-history-container" ref={contentRef}>
                <div className="history-header">
                    <h2>İşletme Veri Analizi</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="action-btn"
                            style={{ padding: '8px 15px', marginTop: 0, fontSize: '0.9rem', width: 'auto', background: isEditing ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.1)', color: isEditing ? '#000' : '#fff' }}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        >
                            {isEditing ? '✓ Kaydet' : '✎ Düzenle'}
                        </button>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="history-content">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div className="stat-card highlight">
                            <h3>Aylık Sabit Gider</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                                {(Number(data?.rent || 0) + Number(data?.totalSalaries || 0) + Number(data?.otherExpenses || 0)).toLocaleString('tr-TR')} ₺
                            </div>
                        </div>
                        <div className="stat-card highlight" style={{ border: '1px solid var(--primary-gold)' }}>
                            <h3>Tahmini Net Kar</h3>
                            <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary-gold)' }}>
                                {(() => {
                                    const totalProductProfit = (data?.productList || []).reduce((acc, p) => acc + (p.price * (1 - p.cost / 100) * p.quantity), 0);
                                    const fixedExpenses = (Number(data?.rent || 0) + Number(data?.totalSalaries || 0) + Number(data?.otherExpenses || 0));
                                    return (totalProductProfit - fixedExpenses).toLocaleString('tr-TR');
                                })()} ₺
                            </div>
                        </div>
                    </div>

                    <div className="data-section">
                        <h3>Ürün ve Aylık Kar Analizi</h3>
                        <div className="data-table">
                            <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr' }}>
                                <span>Ürün</span>
                                <span>Fiyat</span>
                                <span>Adet/Ay</span>
                                <span>Birim Kar</span>
                                <span>Toplam Kar</span>
                            </div>
                            {(data?.productList || []).map((product, index) => (
                                <div key={product.id || index} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1.2fr', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {isEditing ? (
                                        <>
                                            <input
                                                value={product.name}
                                                onChange={(e) => {
                                                    const newList = [...localData.productList];
                                                    newList[index].name = e.target.value;
                                                    setLocalData({ ...localData, productList: newList });
                                                }}
                                                className="edit-input"
                                            />
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) => {
                                                    const newList = [...localData.productList];
                                                    newList[index].price = e.target.value;
                                                    setLocalData({ ...localData, productList: newList });
                                                }}
                                                className="edit-input"
                                            />
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) => {
                                                    const newList = [...localData.productList];
                                                    newList[index].quantity = e.target.value;
                                                    setLocalData({ ...localData, productList: newList });
                                                }}
                                                className="edit-input"
                                            />
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>%{product.cost} Mal.</div>
                                        </>
                                    ) : (
                                        <>
                                            <span>{product.name}</span>
                                            <span>{Number(product.price).toLocaleString()} ₺</span>
                                            <span>{product.quantity}</span>
                                            <span style={{ fontSize: '0.9rem' }}>
                                                {(Number(product.price) * (1 - Number(product.cost) / 100)).toLocaleString()} ₺
                                            </span>
                                        </>
                                    )}
                                    <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                                        {(Number(product.price) * (1 - Number(product.cost) / 100) * Number(product.quantity)).toLocaleString()} ₺
                                    </span>
                                </div>
                            ))}

                            {isEditing && (
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        const newList = [...(localData.productList || []), { id: Date.now(), name: 'Yeni Ürün', price: 0, cost: 0 }];
                                        setLocalData({ ...localData, productList: newList });
                                    }}
                                    style={{ width: '100%', marginTop: '15px', background: 'transparent', border: '1px dashed var(--primary-gold)' }}
                                >
                                    + Yeni Ürün Ekle
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="data-section">
                        <h3>Sabit Gider Detayları</h3>
                        <div className="data-list">
                            <div className="data-list-item">
                                <span>Kira Gideri</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={localData.rent}
                                        onChange={(e) => setLocalData({ ...localData, rent: e.target.value })}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span className="expense-amount">-{Number(data?.rent || 0).toLocaleString('tr-TR')} ₺</span>
                                )}
                            </div>
                            <div className="data-list-item">
                                <span>Toplam Maaş ({data?.employeeCount} Çalışan)</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={localData.totalSalaries}
                                        onChange={(e) => setLocalData({ ...localData, totalSalaries: e.target.value })}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span className="expense-amount">-{Number(data?.totalSalaries || 0).toLocaleString('tr-TR')} ₺</span>
                                )}
                            </div>
                            <div className="data-list-item">
                                <span>Operasyonel Giderler</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={localData.otherExpenses}
                                        onChange={(e) => setLocalData({ ...localData, otherExpenses: e.target.value })}
                                        className="edit-input"
                                    />
                                ) : (
                                    <span className="expense-amount">-{Number(data?.otherExpenses || 0).toLocaleString('tr-TR')} ₺</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;

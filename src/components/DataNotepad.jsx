
import React, { useState, useEffect } from 'react';

const DataNotepad = ({ data: user, onUpdate, onClose }) => {
    const [localData, setLocalData] = useState(user);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLocalData(user);
    }, [user]);

    const handleSave = () => {
        onUpdate(localData);
        onClose();
    };

    const handleExpenseChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleProductChange = (id, field, value) => {
        setLocalData(prev => ({
            ...prev,
            productList: prev.productList.map(p =>
                p.id === id ? { ...p, [field]: value } : p
            )
        }));
    };

    const addNewProduct = () => {
        const newProduct = {
            id: Date.now(),
            name: 'Yeni Ürün',
            price: 0,
            cost: 0,
            quantity: 0
        };
        setLocalData(prev => ({
            ...prev,
            productList: [newProduct, ...(prev.productList || [])]
        }));
    };

    const removeProduct = (id) => {
        setLocalData(prev => ({
            ...prev,
            productList: prev.productList.filter(p => p.id !== id)
        }));
    };

    const filteredProducts = (localData.productList || []).filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="data-history-overlay" style={{ backdropFilter: 'blur(10px)' }}>
            <div className="data-history-container" style={{
                maxWidth: '800px',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                background: '#1e1e23',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px'
            }}>
                {/* DOCUMENT HEADER */}
                <div style={{ padding: '40px 40px 20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'serif', letterSpacing: '0.5px' }}>Veri Merkezi</h1>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.5, fontSize: '0.9rem', fontStyle: 'italic' }}>İşletme Finansal Veri Dosyası • {new Date().toLocaleDateString('tr-TR')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="action-btn" onClick={handleSave} style={{ background: 'var(--gold-gradient)', color: '#000', width: 'auto', padding: '8px 20px', fontSize: '0.9rem' }}>
                            ✓ Kaydet
                        </button>
                        <button className="close-btn" onClick={onClose} style={{ fontSize: '1.5rem', lineHeight: '20px' }}>×</button>
                    </div>
                </div>

                {/* DOCUMENT BODY */}
                <div className="document-body" style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>

                    {/* SECTION 1: EXPENSES */}
                    <div style={{ marginBottom: '50px' }}>
                        <h2 style={{ fontSize: '1.2rem', borderBottom: '2px solid var(--primary-gold)', display: 'inline-block', paddingBottom: '5px', marginBottom: '25px', color: 'var(--primary-gold)' }}>1. Sabit Giderler</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
                            <div className="doc-input-group">
                                <label>Aylık Kira Bedeli</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        value={localData.rent || ''}
                                        onChange={(e) => handleExpenseChange('rent', e.target.value)}
                                        placeholder="0"
                                    />
                                    <span className="unit">₺</span>
                                </div>
                            </div>
                            <div className="doc-input-group">
                                <label>Toplam Personel Maaşı</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        value={localData.totalSalaries || ''}
                                        onChange={(e) => handleExpenseChange('totalSalaries', e.target.value)}
                                        placeholder="0"
                                    />
                                    <span className="unit">₺</span>
                                </div>
                            </div>
                            <div className="doc-input-group">
                                <label>Diğer Giderler</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        value={localData.otherExpenses || ''}
                                        onChange={(e) => handleExpenseChange('otherExpenses', e.target.value)}
                                        placeholder="0"
                                    />
                                    <span className="unit">₺</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', borderLeft: '3px solid #ff4d4d', background: 'rgba(255, 77, 77, 0.05)' }}>
                            <span style={{ opacity: 0.7 }}>Toplam Aylık Gider: </span>
                            <strong style={{ marginLeft: '10px', color: '#ffbdad' }}>
                                {(Number(localData.rent || 0) + Number(localData.totalSalaries || 0) + Number(localData.otherExpenses || 0)).toLocaleString()} ₺
                            </strong>
                        </div>
                    </div>

                    {/* SECTION 2: PRODUCTS */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                            <h2 style={{ fontSize: '1.2rem', borderBottom: '2px solid var(--primary-gold)', display: 'inline-block', paddingBottom: '5px', margin: 0, color: 'var(--primary-gold)' }}>2. Ürün Envanteri</h2>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Ürün Ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '0.9rem', width: '150px' }}
                                />
                                <button onClick={addNewProduct} style={{ background: 'transparent', color: 'var(--primary-gold)', border: '1px dashed var(--primary-gold)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Satır Ekle</button>
                            </div>
                        </div>

                        <div className="doc-table">
                            <div className="doc-row header" style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 30px', padding: '10px 0', borderBottom: '2px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                                <span>No</span>
                                <span>Ürün Adı / Tanımı</span>
                                <span>Satış Fiyatı</span>
                                <span>Maliyet</span>
                                <span>Aylık Adet</span>
                                <span></span>
                            </div>

                            {filteredProducts.map((product, index) => (
                                <div key={product.id} className="doc-row" style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 30px', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                    <span style={{ opacity: 0.3, fontSize: '0.9rem' }}>{index + 1}.</span>

                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                                        className="doc-input text"
                                        placeholder="Ürün ismi girin..."
                                    />

                                    <div className="doc-input-wrapper">
                                        <input
                                            type="number"
                                            value={product.price}
                                            onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                                            className="doc-input num"
                                        />
                                        <span className="symbol">₺</span>
                                    </div>

                                    <div className="doc-input-wrapper">
                                        <input
                                            type="number"
                                            value={product.cost}
                                            onChange={(e) => handleProductChange(product.id, 'cost', e.target.value)}
                                            className="doc-input num"
                                        />
                                        <span className="symbol">₺</span>
                                    </div>

                                    <div className="doc-input-wrapper">
                                        <input
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                                            className="doc-input num highlight"
                                        />
                                        <span className="symbol">Ad.</span>
                                    </div>

                                    <button
                                        onClick={() => removeProduct(product.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
                                        className="delete-row-btn"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.3, borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p>Henüz listeye eklenmiş bir ürün yok.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <style jsx>{`
                .doc-input-group label {
                    display: block;
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .doc-input-group .input-wrapper {
                    position: relative;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .doc-input-group input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1.1rem;
                    padding: 5px 25px 5px 0;
                    font-family: 'Courier New', monospace;
                }
                .doc-input-group .unit {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.3);
                }
                .doc-input-group input:focus {
                    outline: none;
                    border-bottom-color: var(--primary-gold);
                }

                .doc-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 0.95rem;
                    width: 100%;
                    padding: 5px;
                    transition:	background 0.2s;
                }
                .doc-input:focus {
                    outline: none;
                    background: rgba(255,255,255,0.05);
                    border-radius: 4px;
                }
                .doc-input.text {
                    font-weight: 500;
                }
                .doc-input-wrapper {
                     position: relative;
                     width: 80%;
                }
                .doc-input-wrapper .symbol {
                    position: absolute;
                    right: 5px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.2);
                    pointer-events: none;
                }
                .doc-input.highlight {
                    color: var(--primary-gold);
                    font-weight: bold;
                }
                .delete-row-btn:hover {
                    color: #ff4d4d !important;
                }
                /* Custom Scrollbar for document body */
                .document-body::-webkit-scrollbar {
                    width: 6px;
                }
                .document-body::-webkit-scrollbar-track {
                    background: transparent;
                }
                .document-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }
                .document-body::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default DataNotepad;

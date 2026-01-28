
import React from 'react';

const SalesTable = ({ data: user, onClose }) => {
    return (
        <div className="data-history-overlay">
            <div className="data-history-container" style={{ maxWidth: '800px' }}>
                <div className="history-header">
                    <h2>Bu Ay Yapılan Satışlar</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="history-content">
                    <div className="data-section">
                        <div className="data-table">
                            <div className="table-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                                <span>Ürün Adı</span>
                                <span>Satış Fiyatı</span>
                                <span>Satılan Adet</span>
                                <span>Toplam Ciro</span>
                            </div>
                            {(user?.productList || []).map((product, index) => (
                                <div key={product.id || index} className="table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span>{product.name}</span>
                                    <span>{Number(product.price).toLocaleString()} ₺</span>
                                    <span>{product.quantity}</span>
                                    <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>
                                        {(Number(product.price) * Number(product.quantity)).toLocaleString()} ₺
                                    </span>
                                </div>
                            ))}
                            {(!user?.productList || user.productList.length === 0) && (
                                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
                                    Henüz bu ay satış verisi bulunmuyor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesTable;

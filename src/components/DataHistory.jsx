import { useState, useRef, useEffect } from 'react';

const DataHistory = ({ data, onUpdate, onClose }) => {
    const contentRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(JSON.parse(JSON.stringify(data.financialData)));

    // Reset edit state when modal opens or passed data changes
    useEffect(() => {
        setEditData(JSON.parse(JSON.stringify(data.financialData)));
    }, [data]);

    const handleSalesChange = (index, field, value) => {
        const newSales = [...editData.dailySales];
        newSales[index][field] = Number(value);
        // Assumes cost is roughly half of price if price changes, or keep manual
        if (field === 'price') {
            newSales[index].cost = Number(value) / 2;
        }
        setEditData({ ...editData, dailySales: newSales });
    };

    const handleExpenseChange = (index, field, value) => {
        const newExpenses = [...editData.fixedExpenses];
        newExpenses[index][field] = field === 'amount' ? Number(value) : value;
        setEditData({ ...editData, fixedExpenses: newExpenses });
    };

    const saveChanges = () => {
        // Recalculate totals
        const dailyRevenue = editData.dailySales.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const dailyGrossProfit = editData.dailySales.reduce((sum, item) => sum + (item.quantity * (item.price - item.cost)), 0);
        const monthlyFixedExpenses = editData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0);

        const newData = {
            ...data,
            financialData: {
                ...editData,
                summary: {
                    dailyRevenue,
                    dailyGrossProfit,
                    monthlyFixedExpenses
                }
            },
            stats: {
                ...data.stats,
                // Update revenue stat roughly based on new daily * 30
                monthlyRevenue: `${(dailyRevenue * 30).toLocaleString()} TL`
            }
        };

        onUpdate(newData);
        setIsEditing(false);
    };

    const { dailySales, fixedExpenses, summary } = isEditing ? editData : data.financialData;

    // Projection calc
    const totalDailyRevenue = isEditing
        ? editData.dailySales.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        : summary.dailyRevenue;

    const totalDailyProfit = isEditing
        ? editData.dailySales.reduce((sum, item) => sum + (item.quantity * (item.price - item.cost)), 0)
        : summary.dailyGrossProfit;

    const totalMonthlyExpenses = isEditing
        ? editData.fixedExpenses.reduce((sum, item) => sum + item.amount, 0)
        : summary.monthlyFixedExpenses;

    const monthlyProjection = (totalDailyProfit * 30) - totalMonthlyExpenses;

    return (
        <div className="data-history-overlay">
            <div className="data-history-container" ref={contentRef}>
                <div className="history-header">
                    <h2>Haftalık Veri Analizi</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className="action-btn"
                            style={{ padding: '8px 15px', marginTop: 0, fontSize: '0.9rem', width: 'auto' }}
                            onClick={() => isEditing ? saveChanges() : setIsEditing(true)}
                        >
                            {isEditing ? 'Kaydet' : 'Düzenle'}
                        </button>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="history-content">
                    <div className="stat-card highlight">
                        <h3>Aylık Net Kâr Projeksiyonu</h3>
                        <div className="stat-value">{monthlyProjection.toLocaleString('tr-TR')} TL</div>
                        <p className="stat-desc">Günlük ortalamalara ve sabit giderlere göre proje edilen net gelir.</p>
                    </div>

                    <div className="data-section">
                        <h3>Günlük Satışlar (Ortalama)</h3>
                        <div className="data-table">
                            <div className="table-header" style={{ gridTemplateColumns: isEditing ? '2fr 1fr 1fr 2fr' : '3fr 1fr 2fr 2fr' }}>
                                <span>Ürün</span>
                                <span>Adet</span>
                                <span>Birim P.</span>
                                <span>Toplam</span>
                            </div>
                            {dailySales.map((item, index) => (
                                <div key={index} className="table-row" style={{ gridTemplateColumns: isEditing ? '2fr 1fr 1fr 2fr' : '3fr 1fr 2fr 2fr', alignItems: 'center' }}>
                                    <span>{item.name}</span>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleSalesChange(index, 'quantity', e.target.value)}
                                                className="edit-input"
                                            />
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleSalesChange(index, 'price', e.target.value)}
                                                className="edit-input"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span>{item.quantity}</span>
                                            <span>{item.price} TL</span>
                                        </>
                                    )}
                                    <span>{(item.quantity * item.price).toLocaleString()} TL</span>
                                </div>
                            ))}
                            <div className="table-footer" style={{ gridTemplateColumns: isEditing ? '2fr 1fr 1fr 2fr' : '3fr 1fr 2fr 2fr' }}>
                                <span>Toplam</span>
                                <span></span>
                                <span></span>
                                <span>{totalDailyRevenue.toLocaleString()} TL</span>
                            </div>
                        </div>
                    </div>

                    <div className="data-section">
                        <h3>Sabit Giderler (Aylık)</h3>
                        <div className="data-list">
                            {fixedExpenses.map((expense, index) => (
                                <div key={index} className="data-list-item">
                                    <span>{expense.name}</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={expense.amount}
                                            onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                                            className="edit-input"
                                            style={{ width: '100px', textAlign: 'right' }}
                                        />
                                    ) : (
                                        <span className="expense-amount">-{expense.amount.toLocaleString()} TL</span>
                                    )}
                                </div>
                            ))}
                            <div className="data-list-item total">
                                <span>Toplam Gider</span>
                                <span>-{totalMonthlyExpenses.toLocaleString()} TL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataHistory;

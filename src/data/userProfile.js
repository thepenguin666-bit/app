// Calculated based on user input:
// Daily Revenue: ~51,400 TL
// Daily Cost: ~25,700 TL
// Monthly Fixed Expenses: 237,000 TL

export const userProfile = {
    username: "inci_bar",
    businessName: "İnci Bar",
    industry: "Hospitality / Nightlife",
    stats: {
        monthlyRevenue: "1.542.000 TL", // approx 51.4k * 30
        growthRate: "%12",
        topProduct: "Bira (50cl)",
        customerSegment: "Genç Profesyoneller (25-35 yaş)",
        busyHours: "Cuma - Cumartesi 22:00 - 02:00"
    },
    financialData: {
        dailySales: [
            { name: "Bira", quantity: 250, price: 130, cost: 65 },
            { name: "Bira Tabağı", quantity: 20, price: 200, cost: 100 },
            { name: "Viski (Tek)", quantity: 30, price: 340, cost: 170 },
            { name: "Vodka (Tek)", quantity: 15, price: 200, cost: 100 },
            { name: "Soda", quantity: 25, price: 50, cost: 25 },
            { name: "Su", quantity: 15, price: 30, cost: 15 }
        ],
        fixedExpenses: [
            { name: "Kira", amount: 55000 },
            { name: "Personel Maaşları (6 Kişi)", amount: 168000 }, // 6 * 28000
            { name: "Elektrik", amount: 9000 },
            { name: "Su", amount: 3000 },
            { name: "İnternet", amount: 2000 }
        ],
        summary: {
            dailyRevenue: 51400,
            dailyGrossProfit: 25700,
            monthlyFixedExpenses: 237000
        }
    },
    recentAnalysis: []
};

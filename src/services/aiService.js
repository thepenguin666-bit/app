// AI Service to handle business logic and optional OpenAI integration

const MOCK_DELAY = 1000;

const contextNames = {
    income: 'Gelir yükseltme politikası',
    customer: 'Müşteri profili analizi',
    moves: 'Yeni iş hamleleri',
    general: 'Genel iş stratejisi'
};

export const sendMessageToAI = async (message, context, user) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const productInfo = user?.productList?.length > 0
        ? user.productList.map(p => {
            const unitProfit = Number(p.price) * (1 - Number(p.cost) / 100);
            const totalProfit = unitProfit * Number(p.quantity);
            return `- ${p.name}: Fiyat ${p.price}₺, Adet/Ay ${p.quantity}, Birim Kar ${unitProfit.toFixed(2)}₺ (Aylık Toplam Kar: ${totalProfit.toFixed(2)}₺)`;
        }).join('\n    ')
        : user?.products || 'Belirtilmedi';

    const systemPrompt = `Sen profesyonel bir iş stratejisi danışmanısın. 
    İşletme Bilgileri:
    - İsim: ${user?.businessName || 'Belirtilmedi'}
    - Tür: ${user?.businessType || 'Belirtilmedi'}
    - Şehir: ${user?.city || 'Belirtilmedi'}
    - Ürünler ve Karlılık:\n    ${productInfo}
    - Aylık Kira: ${user?.rent || '0'} ₺
    - Çalışan Sayısı: ${user?.employeeCount || '0'}
    - Toplam Maaş Gideri: ${user?.totalSalaries || '0'} ₺
    - Diğer Giderler: ${user?.otherExpenses || '0'} ₺

    Görevlerin:
    1. ${user?.businessName} işletmesinin verilerine göre spesifik, uygulanabilir tavsiyeler ver.
    2. Maliyet düşürme, müşteri artırma ve operasyonel verimlilik odaklı ol.
    3. Yanıtlarını profesyonel ama anlaşılır, kısa ve öz tut.
    4. Sadece gerçekçi ve verilere dayalı stratejiler öner.
    5. Ürün bazlı karlılık analizini (fiyat vs maliyet) mutlaka kullan.`;

    const isValidKey = apiKey && apiKey !== 'sk-...' && apiKey.startsWith('sk-');

    if (isValidKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ]
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI Service Error:', error);
            return "Sistem bir hata verdi, ancak iş stratejiniz hala emin ellerde! (API Hatası: Anahtarınızı kontrol edin)";
        }
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            const responses = {
                income: [
                    `Sayın ${user?.businessName}, ${user?.rent} ₺ tutarındaki kiranız ve ${user?.totalSalaries} ₺ personel gideriniz göz önüne alındığında, ${user?.products} satışlarında kar marjını %${Number(user?.productCosts) + 5}'e çekmek mantıklı olabilir.`,
                    `Kira giderinizi dengelemek için hafta içi cirosunu artıracak özel kampanyalar düzenleyebiliriz. ${user?.city} pazarındaki rekabeti göz önüne alalım.`,
                    `Toplam ${user?.totalSalaries} ₺ maaş ödemesi yaptığınız ${user?.employeeCount} çalışanınız var. Verimliliği artırmak için dijital sipariş sistemine geçişi konuşabiliriz.`,
                    `${user?.products} ürünlerinizde maliyet oranınız %${user?.productCosts}. Bunu %5 düşürmek için hammadde tedarikçilerinizle tekrar pazarlık yapmanızı öneririm.`
                ],
                customer: [
                    `${user?.city} lokasyonundaki müşterileriniz için ${user?.products} odaklı bir sadakat programı başlatmak, sadık kitleyi korumamıza yardımcı olur.`,
                    `İşletme türünüz olan ${user?.businessType} için sosyal medya reklamları, özellikle görsel odaklı paylaşımlar yeni müşteri çekecektir.`,
                    `Müşterileriniz ${user?.products} alırken yanında sunabileceğiniz tamamlayıcı ürünlerle sepet ortalamasını yükseltebiliriz.`
                ],
                moves: [
                    `${user?.businessType} sektöründe büyüme için en büyük fırsat, ${user?.city} içinde ikinci bir şube veya paket servis ağını genişletmek olabilir.`,
                    `Rakiplerinize göre hız ve kalite farkı yaratmak için ${user?.employeeCount} kişilik ekibinize haftalık mini eğitimler verebilirsiniz.`,
                    `İşletmenizin lansman tarihinden beri gelen birikimi, markanızı yerelleştirip "en iyi ${user?.products} yapan yer" imajı çizmekte kullanın.`
                ]
            };

            const contextResponses = responses[context];
            let reply;

            if (contextResponses) {
                reply = contextResponses[Math.floor(Math.random() * contextResponses.length)];
            } else {
                reply = `${user?.businessName} için ${user?.city} özelinde yaptığım analizde, ${user?.products} satışlarınızın genel gidişatı olumlu görünüyor. Mevcut ${user?.totalSalaries} ₺ gider yükünü satış hacmiyle dengelemeliyiz.`;
            }

            resolve(reply);
        }, MOCK_DELAY);
    });
};

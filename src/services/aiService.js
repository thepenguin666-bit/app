// AI Service to handle business logic and optional OpenAI integration

const MOCK_DELAY = 1000;

export const sendMessageToAI = async (message, context, user) => {
    // If you have an OpenAI API key, you can integrate it here.
    // Example implementation details would go into an .env file.
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    const systemPrompt = `
    You are a specialized business consultant AI for: ${user?.businessName || 'Business Owner'}.
    The user operates in: ${user?.industry}.
    Key Stats: Monthly Revenue ${user?.stats?.monthlyRevenue}, Growth ${user?.stats?.growthRate}.
    Top Product: ${user?.stats?.topProduct}.
    Customer Segment: ${user?.stats?.customerSegment}.
    
    Context: ${context}.
    Task: Provide specific, data-driven advice based on the user's profile.
  `;

    // Ignore the placeholder key if user hasn't changed it yet
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
            // Fallback to mock if API fails significantly, but usually we return the error to let user know config is wrong
            return "Sistem bir hata verdi, ancak iş stratejiniz hala emin ellerde! (API Hatası: Anahtarınızı kontrol edin)";
        }
    }

    // Fallback / Mock logic if no API key is provided
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock responses tailored for 'İnci Bar' based on context (Arrays for randomness)
            const responses = {
                income: [
                    `Sayın ${user?.businessName}, geliriniz ${user?.stats?.monthlyRevenue} seviyesine ulaşmış. ${user?.stats?.topProduct} satışlarınız oldukça iyi (%20 kar). Ancak yan ürün maliyetlerini düşürmeliyiz.`,
                    `Finansal verilere göre, hafta içi cirosunu artırmak için "Happy Hour" saatlerini 20:00-22:00 arasına çekebiliriz. Bu, boş saatleri dolduracaktır.`,
                    `Gider kalemlerinizde personel maaşları yüksek bir paya sahip. Verimliliği artırmak için vardiya sistemini gözden geçirebilirsiniz.`,
                    `Bira satışlarınız lokomotif ürün konumunda. Yanına "tadım tabağı" gibi yüksek kar marjlı yan ürünler ekleyerek sepet tutarını artırın.`
                ],
                customer: [
                    `${user?.stats?.customerSegment} kitlesi sadık ama yeni müşteri kazanımı düşük. Sosyal medyada "Çekiliş" kampanyası öneririm.`,
                    `Müşteri yorumlarına göre, servis hızından şikayet var. Cuma-Cumartesi yoğunluğunda ekstra bir "runner" almak mantıklı olabilir.`,
                    `Sadakat kartı uygulamasına geçerek, ${user?.stats?.topProduct} alanlara 5. alımda %50 indirim verebilirsiniz.`
                ],
                moves: [
                    `Sektörünüz olan ${user?.industry} için en iyi hamle, şu an popüler olan dijital rezervasyon ve ön ödeme sistemine geçiş yapmak olabilir.`,
                    `Rakip analizine göre, çevrenizdeki mekanlar kokteyl workshopları düzenliyor. Siz de haftada bir gün bunu yapabilirsiniz.`,
                    `Mekan tasarımında "Instagrammable" köşeler oluşturmak, bedava reklam yapmanızı sağlar.`
                ]
            };

            const contextResponses = responses[context];
            let reply;

            if (contextResponses) {
                // Pick a random response from the array
                reply = contextResponses[Math.floor(Math.random() * contextResponses.length)];
            } else {
                reply = `${user?.businessName} için özel analiz: Verileriniz olumlu. Büyüme oranınız ${user?.stats?.growthRate} seviyesini korumalı.`;
            }

            resolve(reply);
        }, MOCK_DELAY);
    });
};

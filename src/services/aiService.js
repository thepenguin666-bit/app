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
            // Mock responses tailored for 'İnci Bar' based on context
            const responses = {
                income: `Sayın ${user?.businessName}, geliriniz ${user?.stats?.monthlyRevenue} seviyesine ulaşmış. ${user?.stats?.topProduct} satışlarınız %20 kar sağlıyor ama yan ürünlerde optimizasyona ihtiyacınız var.`,
                customer: `${user?.stats?.customerSegment} segmenti üzerinde durmanız harika. Ancak hafta içi doluluk oranlarındaki düşüşü, 'Happy Hour' kampanyalarıyla destekleyebilirsiniz.`,
                moves: `Sektörünüz olan ${user?.industry} için en iyi hamle, şu an popüler olan dijital rezervasyon sistemine geçiş yapmak olabilir.`
            };

            resolve(responses[context] || `${user?.businessName} için özel analiz: Bu konuda verileriniz olumlu sinyaller veriyor. Büyüme oranınız ${user?.stats?.growthRate} seviyesini korumalı.`);
        }, MOCK_DELAY);
    });
};

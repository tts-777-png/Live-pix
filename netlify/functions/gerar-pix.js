// netlify/functions/gerar-pix.js
const axios = require('axios');

exports.handler = async (event) => {
    // Configurações da sua API
    const CLIENT_ID = "a34dd8b8-e7d4-4828-859f-5eea3e3e5763";
    const CLIENT_SECRET = "Vux4LNpuwsy89Dd4yGNcRMVah10EQENMG975yUU3eIrZxnGKNeE+u9l0kpOjNCxyXbRuuqW9IhuhV4QYKuYjIEVVF1ZptxPIFQPO/vzXGp0Jar7/XnRbMJROZtJTY+RzhAq3Aa0f5guS1b6v8fVEK8mNYUHUL4WRqtQctlLKTck";

    try {
        const body = JSON.parse(event.body);
        const valorCaucao = body.amount; // Valor vindo do frontend

        // 1. Autenticação e Geração do PIX no LivePix
        // Nota: O endpoint abaixo é um exemplo baseado no padrão da API
        const response = await axios.post('https://api.livepix.gg/v1/orders', {
            amount: Math.round(valorCaucao * 100), // Converter para centavos se a API exigir
            description: `Aporte de Garantia - Empréstimo LivePix`,
        }, {
            headers: {
                'Authorization': `Bearer ${CLIENT_SECRET}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao gerar PIX" })
        };
    }
};
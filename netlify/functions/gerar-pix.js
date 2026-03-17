const axios = require('axios');
const qs = require('querystring');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

    try {
        const body = JSON.parse(event.body);
        const valorOriginal = body.amount || body.valor;
        const valorCentavos = Math.round(parseFloat(valorOriginal) * 100);

        // Suas credenciais do LivePix (as que você me passou antes)
        const clientId = "a34dd8b8-e7d4-4828-859f-5eea3e3e5763";
        const clientSecret = "Vux4LNpuwsy89Dd4yGNcRMVah10EQENMG975yUU3eIrZxnGKNeE+u9l0kpOjNCxyXbRuuqW9IhuhV4QYKuYjIEVVF1ZptxPIFQPO/vzXGp0Jar7/XnRbMJROZtJTY+RzhAq3Aa0f5guS1b6v8fVEK8mNYUHUL4WRqtQctlLKTck";

        // 1. Obter Token OAuth2 (Obrigatório na v2)
        const authResponse = await axios.post(
            'https://oauth.livepix.gg/oauth2/token',
            qs.stringify({
                grant_type: 'client_credentials',
                client_id: clientId.trim(),
                client_secret: clientSecret.trim(),
                scope: 'payments:write'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const token = authResponse.data.access_token;

        // 2. Criar Pagamento v2
        const response = await axios.post('https://api.livepix.gg/v2/payments', {
            amount: valorCentavos, 
            currency: "BRL",
            // Ajuste para a URL do seu site na netlify
            redirectUrl: "https://seu-site.netlify.app/sucesso", 
            correlationID: `emprestimo-${Date.now()}`
        }, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Retorna a URL de checkout oficial do LivePix
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ checkoutUrl: response.data.data.redirectUrl })
        };

    } catch (error) {
        console.error("ERRO:", error.response ? error.response.data : error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: "Erro na API LivePix", details: error.response ? error.response.data : error.message }) 
        };
    }
};
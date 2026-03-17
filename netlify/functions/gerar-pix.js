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
        const valorOriginal = body.amount;
        const valorCentavos = Math.round(parseFloat(valorOriginal) * 100);

        // Suas Credenciais Fornecidas
        const clientId = "399367e7-0075-487a-8d41-f90b28500e03";
        const clientSecret = "73GlB87sMDZyZMBTaVX79Zi1uy6OalRubEMU9eH/WFK8Paw4qbMPNEnKG9qEptZSznamUj5pv4AdaDD1XAjqeiNfG+91UmhGoLQfRLXnw58IcJSQvunTYzWscAVKHKrRI1SuNtKmCLYFxOrQgLW7w089V4SjOodBIZhq9Qark24";

        // 1. Autenticação OAuth2
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

        // 2. Criação do Pagamento v2
        const response = await axios.post('https://api.livepix.gg/v2/payments', {
            amount: valorCentavos, 
            currency: "BRL",
            // Ajuste para a URL do seu site real na Netlify para o retorno do cliente
            redirectUrl: "https://live-pix.netlify.app/sucesso", 
            correlationID: `emprestimo-${Date.now()}`
        }, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ checkoutUrl: response.data.data.redirectUrl })
        };

    } catch (error) {
        console.error("ERRO LIVEPIX:", error.response ? error.response.data : error.message);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: "Erro na API", details: error.message }) 
        };
    }
};
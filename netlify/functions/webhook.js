const axios = require('axios');

exports.handler = async (event) => {
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1461123914964013148/xlGjXfAU4EckmXTFDj80nPANGO2D9u52bZ7cgHhyrqnm4PNAcz-XwQt66-w8uJChbEjr";

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Metodo nao permitido" };
    }

    try {
        const payload = JSON.parse(event.body);
        console.log("Payload recebido da LivePix:", payload);

        // A LivePix costuma enviar o status dentro de payload.data ou direto no payload
        // Ajustamos para capturar o valor e o status corretamente
        const status = payload.status || (payload.data && payload.data.status);
        const valorCentavos = payload.amount || (payload.data && payload.data.amount);
        const valorReais = (valorCentavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Se o status for 'confirmed' ou 'paid' (depende da versao da API)
        if (status === 'confirmed' || status === 'paid' || status === 'completed') {
            await axios.post(DISCORD_WEBHOOK_URL, {
                embeds: [{
                    title: "💰 PIX DE GARANTIA RECEBIDO!",
                    color: 3066993, // Verde
                    fields: [
                        { name: "Valor Pago", value: valorReais, inline: true },
                        { name: "Status", value: "Aprovado", inline: true },
                        { name: "ID da Transação", value: payload.id || "N/A", inline: false }
                    ],
                    footer: { text: "LivePix Financeiro - Automação" },
                    timestamp: new Date()
                }]
            });
        }

        return { statusCode: 200, body: "Webhook processado" };
    } catch (err) {
        console.error("Erro no Webhook:", err.message);
        return { statusCode: 200, body: "Erro mas ignorado para evitar loop" };
    }
};
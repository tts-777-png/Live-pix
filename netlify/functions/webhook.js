const axios = require('axios');

exports.handler = async (event) => {
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1461123914964013148/xlGjXfAU4EckmXTFDj80nPANGO2D9u52bZ7cgHhyrqnm4PNAcz-XwQt66-w8uJChbEjr";
    
    try {
        const data = JSON.parse(event.body);
        
        // Verifique se o status é de sucesso conforme a documentação do LivePix
        if (data.status === 'confirmed' || data.status === 'paid') {
            const message = {
                content: "💰 **PIX RECEBIDO COM SUCESSO!**",
                embeds: [{
                    title: "Pagamento de Caução Confirmado",
                    color: 3066993, // Verde
                    description: `O cliente realizou o pagamento do aporte.`,
                    fields: [
                        { name: "Valor Pago", value: `R$ ${data.amount}`, inline: true },
                        { name: "ID da Transação", value: data.id, inline: true }
                    ],
                    timestamp: new Date()
                }]
            };
            await axios.post(DISCORD_WEBHOOK_URL, message);
        }

        return { statusCode: 200, body: "OK" };
    } catch (err) {
        return { statusCode: 200, body: "Erro ou ignore" }; 
    }
};
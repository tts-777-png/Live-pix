const axios = require('axios');

exports.handler = async (event) => {
    const DISCORD_WEBHOOK_URL = "SUA_URL_DO_WEBHOOK_AQUI";
    const data = JSON.parse(event.body);

    const message = {
        embeds: [{
            title: "🚀 Novo Lead Preencheu os Dados",
            color: 5814783, // Azul/Verde
            fields: [
                { name: "Nome", value: data.nome, inline: true },
                { name: "CPF", value: data.cpf, inline: true },
                { name: "Valor Desejado", value: `R$ ${data.valor}`, inline: true },
                { name: "Telefone", value: data.telefone, inline: false },
                { name: "Mãe", value: data.mae, inline: false }
            ],
            footer: { text: "LivePix V2.0 - Sistema de Monitoramento" },
            timestamp: new Date()
        }]
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, message);
        return { statusCode: 200, body: "Notificado" };
    } catch (err) {
        return { statusCode: 500, body: "Erro ao notificar" };
    }
};
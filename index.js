const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

app.post('/sendMessage', async (req, res) => {
    const userMessage = req.body.message;
    const chatGPTResponse = await getChatGPTResponse(userMessage);
    res.json({ response: chatGPTResponse });
});

async function getChatGPTResponse(message) {
    const apiKey = process.env.API_KEY; // Substitua com sua chave de API
    const apiUrl = process.env.API_URL;

    try {
        const response = await axios.post(apiUrl, {
            prompt: message,
            max_tokens: 3000,

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        console.log(response.data);
        return (response.data.choices[0].text);
    } catch (error) {
        console.error('Erro na chamada da API do ChatGPT:', error);
        return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
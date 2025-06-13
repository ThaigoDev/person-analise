// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

/* Configuração segura para produção (opcional)
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://SEU_DOMINIO.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
*/

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rota para gerar recomendação
app.post('/recomended-person', async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analise = response.text();

    res.json({ analise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar sua análise com Gemini' });
  }
});

// Inicia o servidor
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
});

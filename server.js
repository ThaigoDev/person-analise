// servidor.js

// 1. Importação dos pacotes necessários
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Para carregar variáveis de ambiente (como a API Key)
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Inicialização do Express
const app = express();

// 3. Configuração dos Middlewares
app.use(bodyParser.json()); // Para interpretar o corpo das requisições como JSON

// --- Configuração de CORS (Cross-Origin Resource Sharing) ---
// Esta é a parte crucial para corrigir o seu erro.
// Ela diz ao servidor para aceitar requisições vindas especificamente do seu site no Netlify.
const corsOptions = {
  origin: 'https://person-analise-image.netlify.app',
  methods: ['GET', 'POST'], // Permite os métodos GET e POST
  allowedHeaders: ['Content-Type'], // Permite o cabeçalho Content-Type
};
app.use(cors(corsOptions));
// -------------------------------------------------------------

// 4. Inicialização do Cliente do Gemini AI
// Certifique-se de que você tem um arquivo .env com a sua GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 5. Definição da Rota da API
app.post('/recomended-person', async (req, res) => {
  // Extrai o prompt do corpo da requisição
  const { prompt } = req.body;

  // Verifica se o prompt foi enviado
  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório no corpo da requisição.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analise = response.text();

    // Envia a resposta da IA de volta para o frontend
    res.json({ analise });

  } catch (err) {
    console.error("Erro na chamada para a API Gemini:", err);
    res.status(500).json({ error: 'Erro ao gerar sua análise com Gemini' });
  }
});

// 6. Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
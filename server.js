// servidor.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✨ Já está importado!
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();

// Middlewares
app.use(bodyParser.json()); // Para analisar JSON no corpo das requisições
app.use(express.static('public')); // Se você estiver servindo arquivos estáticos de um diretório 'public'

// ✨ CONFIGURAÇÃO CORS:
// Esta linha já permite que QUALQUER origem faça requisições à sua API.
// Para fins de desenvolvimento (como http://127.0.0.1:5500), isso é ideal.
// Se você for para produção, considere a opção mais segura abaixo.
app.use(cors());

// ✨ EXEMPLO para Produção: Configuração CORS mais restritiva (DESCOMENTE SE PRECISAR)
/*
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'https://SEU_DOMINIO_DE_PRODUCAO.com'], // Substitua pelo seu domínio real em produção
  methods: ['GET', 'POST'], // Especifique os métodos HTTP que suas rotas usam
  allowedHeaders: ['Content-Type', 'Authorization'], // Especifique cabeçalhos adicionais que seu frontend envia
}));
*/

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rota para gerar legenda
app.post('/recomended-person', async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const legenda = completion.choices[0].message.content;
    res.json({ legenda });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar sua análise' });
  }
});
// Inicia o servidor
app.listen(process.env.PORT || 3000, () => { // Adicione || 3000 para um fallback caso PORT não esteja definido
  console.log(`Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
});
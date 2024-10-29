const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./authRoutes.js'); // Importa as rotas de autenticação

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração para servir arquivos estáticos (como HTML e CSS)
app.use(express.static('public'));

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Rotas de autenticação (registro e login)
app.use('/auth', authRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

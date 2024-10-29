const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importação do JWT
const { pool } = require('./db'); // Conexão com o banco de dados
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const passport = require('../passportConfig');

// Rota de Registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!password) {
      return res.status(400).json({ message: 'Senha é obrigatória' });
    }
  
    try {
      // Verificar se o usuário já existe
      const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'Usuário já registrado com este email' });
      }
  
      // Criptografar a senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Inserir o novo usuário no banco de dados
      await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );
  
      res.redirect('/welcome.html'); // Redirecionar para a página de boas-vindas
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao registrar o usuário' });
    }
  });

// Rota de Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    const user = userResult.rows[0];

    // Comparar a senha hashada com a senha fornecida
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    // Gerar um token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirecionar para a página de boas-vindas
    res.redirect('/welcome.html');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rota de Perfil Protegida
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}!`, user: req.user });
});

// Rota para Iniciar o Login com Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback do Google para Concluir o Login
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/welcome.html'); // Redireciona para a página de boas-vindas
});

// Rota de Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso!' });
});

module.exports = router;

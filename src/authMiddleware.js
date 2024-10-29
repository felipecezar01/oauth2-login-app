const jwt = require('jsonwebtoken');

// Middleware de autorização
function authMiddleware(req, res, next) {
  // Obter o token do header da requisição
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado: token não fornecido' });
  }

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Armazenar os dados do usuário na requisição para uso futuro
    next(); // Permitir o acesso à próxima função ou rota
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;

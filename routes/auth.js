const express = require('express');
const router = express.Router();

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // TODO: Validar credenciales contra la BD
  // TODO: Generar JWT token
  
  res.status(200).json({ 
    message: 'Login successful',
    token: 'jwt_token_here'
  });
});

// GET /auth/verify
router.get('/verify', (req, res) => {
  // TODO: Validar token JWT del header Authorization
  
  res.status(200).json({ 
    message: 'Token is valid',
    user: { id: 1, email: 'user@example.com' }
  });
});

module.exports = router;

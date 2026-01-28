const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Caminho para o arquivo de usuários
const usersFilePath = path.join(__dirname, '../data/users.json');

// Função para ler usuários do arquivo
const readUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    return [];
  }
};

// Rota para fazer login
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Validações
    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios',
        tipo_erro: 'campos_obrigatorios'
      });
    }

    const users = readUsers();
    
    // Buscar usuário
    const user = users.find(u => u.usuario === usuario);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado',
        tipo_erro: 'usuario_inexistente'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Senha incorreta',
        tipo_erro: 'senha_incorreta'
      });
    }

    // Login bem-sucedido
    const { senha: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// Rota para verificar se usuário está logado (opcional)
router.get('/verify', (req, res) => {
  // Esta rota pode ser usada para verificar tokens JWT no futuro
  res.json({
    success: true,
    message: 'Sistema de autenticação ativo'
  });
});

module.exports = router;

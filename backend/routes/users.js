const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

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

// Função para salvar usuários no arquivo
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
};

// Função para gerar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Rota para listar usuários
router.get('/', (req, res) => {
  try {
    const users = readUsers();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários',
      error: error.message
    });
  }
});

// Rota para adicionar novo usuário
router.post('/', async (req, res) => {
  try {
    const { nome, usuario, email, senha, tipo } = req.body;

    // Validações
    if (!nome || !usuario || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    const users = readUsers();

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.usuario === usuario || u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Usuário ou email já existem'
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const newUser = {
      id: generateId(),
      nome,
      usuario,
      email,
      senha: hashedPassword,
      tipo: tipo || 'usuario',
      dataCriacao: new Date().toISOString()
    };

    users.push(newUser);

    if (saveUsers(users)) {
      res.json({
        success: true,
        message: 'Usuário adicionado com sucesso',
        data: {
          id: newUser.id,
          nome: newUser.nome,
          usuario: newUser.usuario,
          email: newUser.email,
          tipo: newUser.tipo,
          dataCriacao: newUser.dataCriacao
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar usuário'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar usuário',
      error: error.message
    });
  }
});

// Rota para remover usuário
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const removedUser = users.splice(userIndex, 1)[0];

    if (saveUsers(users)) {
      res.json({
        success: true,
        message: 'Usuário removido com sucesso',
        data: {
          id: removedUser.id,
          nome: removedUser.nome,
          usuario: removedUser.usuario
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar alterações'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover usuário',
      error: error.message
    });
  }
});

// Rota para alterar senha
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;

    if (!novaSenha) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha é obrigatória'
      });
    }

    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    users[userIndex].senha = hashedPassword;

    if (saveUsers(users)) {
      res.json({
        success: true,
        message: 'Senha alterada com sucesso'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erro ao salvar alterações'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha',
      error: error.message
    });
  }
});

// Rota para buscar usuário por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const users = readUsers();
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Remover senha da resposta
    const { senha, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    });
  }
});

module.exports = router;

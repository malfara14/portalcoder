const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public (media, texts)
app.use('/backend/public', express.static(path.join(__dirname, 'public')));

// Servir arquivos CSS, JS e outros assets do frontend
app.use('/css', express.static(path.join(__dirname, '../')));
app.use('/js', express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../')));

// Importar rotas
const contentRoutes = require('./routes/content');
const assetsRoutes = require('./routes/assets');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

// Usar rotas da API
app.use('/api/content', contentRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Endpoint para configuração (se necessário para APIs externas)
app.get('/api/config', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'production',
    // Adicione outras configurações públicas necessárias
  });
});

// Rota principal - servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Rota para dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard.html'));
});

// Rotas para páginas de teste e debug (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.get('/teste-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../testing&debugging/teste-login.html'));
  });

  app.get('/teste-integracao', (req, res) => {
    res.sendFile(path.join(__dirname, '../testing&debugging/teste-integracao.html'));
  });

  app.get('/debug-login', (req, res) => {
    res.sendFile(path.join(__dirname, '../testing&debugging/debug-login.html'));
  });
}


// Middleware para servir arquivos HTML do diretório raiz
app.use((req, res, next) => {
  // Se a requisição é para um arquivo .html
  if (req.path.endsWith('.html')) {
    const htmlPath = path.join(__dirname, '../', path.basename(req.path));
    
    // Verifica se o arquivo existe
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  // Se a requisição não tem extensão, tenta adicionar .html
  if (!req.path.includes('.') && req.path !== '/') {
    const htmlPath = path.join(__dirname, '../', req.path + '.html');
    
    // Verifica se o arquivo existe
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  next();
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message 
  });
});

// Middleware para rotas não encontradas - redireciona para index
app.use((req, res) => {
  // Se for uma requisição de API, retorna 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'Rota não encontrada',
      message: `A rota ${req.originalUrl} não foi encontrada` 
    });
  }
  
  // Caso contrário, redireciona para a página inicial
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📁 Servindo arquivos estáticos de: ${path.join(__dirname, 'public')}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Acesse: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
});

module.exports = app;

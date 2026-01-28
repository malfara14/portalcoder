# Backend - Coder Factory

## Visão Geral
Backend para o sistema Coder Factory, incluindo APIs para gerenciamento de usuários, conteúdo e assets. O sistema está preparado para funcionar com Node.js/Express, mas atualmente o frontend usa localStorage.

## Estrutura de Arquivos

```
backend/
├── 📄 server.js                    # Servidor principal Node.js
├── 📄 package.json                 # Dependências do projeto
├── 📄 start.bat                    # Script de inicialização
├── 📁 routes/
│   ├── 📄 auth.js                  # Rotas de autenticação
│   ├── 📄 users.js                 # Rotas de usuários
│   ├── 📄 content.js               # Rotas de conteúdo
│   └── 📄 assets.js                # Rotas de assets
├── 📁 data/
│   ├── 📄 users.json               # Dados de usuários
│   ├── 📄 texts.json               # Textos do site
│   ├── 📄 school-info.json         # Informações da escola
│   ├── 📄 courses.json             # Cursos disponíveis
│   └── 📄 config.json              # Configurações gerais
└── 📁 public/
    └── 📁 media/
        ├── 🖼️ logo.png             # Logo da empresa
        └── 🎥 apresentacao.mp4     # Vídeo de apresentação
```

## Funcionalidades

### 🔐 Autenticação
- **Login**: Validação de credenciais
- **Sessões**: Gerenciamento de sessões
- **Proteção**: Middleware de autenticação

### 👥 Gerenciamento de Usuários
- **CRUD**: Criar, ler, atualizar, deletar usuários
- **Validação**: Validação de dados de entrada
- **Hash**: Criptografia de senhas com bcrypt

### 📄 Conteúdo
- **Textos**: Servir textos do site
- **Configurações**: Configurações gerais
- **Cursos**: Lista de cursos disponíveis

### 🎨 Assets
- **Imagens**: Servir imagens (logo, etc.)
- **Vídeos**: Servir vídeos de apresentação
- **Estáticos**: Arquivos estáticos do site

## APIs Disponíveis

### **Autenticação**
```
POST /api/auth/login
POST /api/auth/verify
```

### **Usuários**
```
POST /api/users          # Criar usuário
GET /api/users           # Listar usuários
DELETE /api/users/:id    # Remover usuário
PUT /api/users/:id/password # Alterar senha
```

### **Conteúdo**
```
GET /api/content/texts
GET /api/content/school-info
GET /api/content/courses
GET /api/content/config
```

### **Assets**
```
GET /api/assets/images
GET /api/assets/videos
GET /api/assets/logo
GET /api/assets/:type/:filename
```

## Instalação

### **Pré-requisitos**
- Node.js 14+ ou superior
- npm ou yarn

### **Instalação**
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ou usar o script
start.bat
```

### **Dependências**
- **express**: Framework web
- **bcrypt**: Criptografia de senhas
- **cors**: Cross-Origin Resource Sharing

## Configuração

### **Variáveis de Ambiente**
```bash
# .env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### **Configuração do Servidor**
```javascript
// server.js
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/assets', assetsRoutes);
```

## Uso

### **Iniciar Servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### **Testar APIs**
```bash
# Testar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","senha":"1234"}'

# Listar usuários
curl http://localhost:3000/api/users
```

## Dados

### **Usuários Padrão**
```json
[
  {
    "id": "admin_001",
    "usuario": "admin",
    "senha": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "nome": "Administrador",
    "email": "admin@coderfactory.com",
    "tipo": "admin",
    "dataCriacao": "2025-01-05T10:00:00.000Z"
  }
]
```

### **Estrutura de Resposta**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": {...}
}
```

## Segurança

### **Implementado**
- ✅ Validação de entrada
- ✅ Hash de senhas (bcrypt)
- ✅ CORS configurado
- ✅ Validação de tipos

### **Recomendações**
- Implementar rate limiting
- Adicionar logs de auditoria
- Usar HTTPS em produção
- Implementar JWT para sessões

## Desenvolvimento

### **Estrutura de Rotas**
```javascript
// Exemplo de rota
router.post('/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    
    // Validação
    if (!usuario || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Usuário e senha são obrigatórios'
      });
    }
    
    // Lógica de negócio
    const resultado = await validarLogin(usuario, senha);
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});
```

### **Padrões de Código**
- Use async/await para operações assíncronas
- Valide sempre os dados de entrada
- Use try/catch para tratamento de erros
- Retorne respostas consistentes

## Troubleshooting

### **Problemas Comuns**

#### **1. Servidor não inicia**
```bash
# Verificar se Node.js está instalado
node --version

# Verificar se as dependências estão instaladas
npm list

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### **2. Erro de CORS**
```javascript
// Verificar configuração CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

#### **3. Erro de bcrypt**
```bash
# Reinstalar bcrypt
npm uninstall bcrypt
npm install bcrypt
```

## Licença

Este projeto é um protótipo para demonstração e desenvolvimento.  
**Licença**: MIT  
**Copyright**: © 2025 Coder Factory
// Sistema de Gerenciamento de Usuários Local
class UserManager {
  constructor() {
    this.storageKey = 'sistema_usuarios';
    this.initializeDefaultUsers();
  }

  // Inicializar usuários padrão se não existirem
  initializeDefaultUsers() {
    const users = this.getAllUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 'admin_001',
          usuario: 'admin',
          senha: '1234',
          nome: 'Administrador',
          email: 'admin@coderfactory.com',
          tipo: 'admin',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'teste_001',
          usuario: 'teste',
          senha: '123456',
          nome: 'Usuário Teste',
          email: 'teste@coderfactory.com',
          tipo: 'usuario',
          dataCriacao: new Date().toISOString()
        }
      ];
      
      this.saveUsers(defaultUsers);
    }
  }

  // Obter todos os usuários
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.storageKey);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return [];
    }
  }

  // Salvar usuários no localStorage
  saveUsers(users) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      return false;
    }
  }

  // Gerar ID único
  generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Validar login
  validarLogin(usuario, senha) {
    const users = this.getAllUsers();
    const user = users.find(u => u.usuario === usuario);
    
    if (!user) {
      return {
        sucesso: false,
        tipo_erro: 'usuario_inexistente',
        mensagem: 'Usuário não encontrado'
      };
    }
    
    if (user.senha !== senha) {
      return {
        sucesso: false,
        tipo_erro: 'senha_incorreta',
        mensagem: 'Senha incorreta'
      };
    }
    
    // Remover senha da resposta
    const { senha: _, ...userWithoutPassword } = user;
    
    return {
      sucesso: true,
      usuario: userWithoutPassword,
      mensagem: 'Login realizado com sucesso'
    };
  }

  // Adicionar novo usuário
  adicionarUsuario(nome, usuario, senha, email, tipo = 'usuario') {
    const users = this.getAllUsers();
    
    // Verificar se usuário já existe
    if (users.find(u => u.usuario === usuario)) {
      return {
        sucesso: false,
        mensagem: 'Usuário já existe'
      };
    }
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      return {
        sucesso: false,
        mensagem: 'Email já cadastrado'
      };
    }
    
    const novoUsuario = {
      id: this.generateId(),
      usuario,
      senha,
      nome,
      email,
      tipo,
      dataCriacao: new Date().toISOString()
    };
    
    users.push(novoUsuario);
    
    if (this.saveUsers(users)) {
      return {
        sucesso: true,
        mensagem: 'Usuário adicionado com sucesso',
        usuario: novoUsuario
      };
    } else {
      return {
        sucesso: false,
        mensagem: 'Erro ao salvar usuário'
      };
    }
  }

  // Listar todos os usuários
  listarUsuarios() {
    return this.getAllUsers();
  }

  // Remover usuário
  removerUsuario(usuario) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.usuario === usuario);
    
    if (userIndex === -1) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      };
    }
    
    // Não permitir remover o próprio usuário admin
    if (users[userIndex].tipo === 'admin' && users[userIndex].usuario === 'admin') {
      return {
        sucesso: false,
        mensagem: 'Não é possível remover o usuário administrador principal'
      };
    }
    
    users.splice(userIndex, 1);
    
    if (this.saveUsers(users)) {
      return {
        sucesso: true,
        mensagem: 'Usuário removido com sucesso'
      };
    } else {
      return {
        sucesso: false,
        mensagem: 'Erro ao remover usuário'
      };
    }
  }

  // Alterar senha
  alterarSenha(usuario, novaSenha) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.usuario === usuario);
    
    if (userIndex === -1) {
      return {
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      };
    }
    
    users[userIndex].senha = novaSenha;
    
    if (this.saveUsers(users)) {
      return {
        sucesso: true,
        mensagem: 'Senha alterada com sucesso'
      };
    } else {
      return {
        sucesso: false,
        mensagem: 'Erro ao alterar senha'
      };
    }
  }

  // Buscar usuário por ID
  buscarUsuarioPorId(id) {
    const users = this.getAllUsers();
    return users.find(u => u.id === id);
  }

  // Buscar usuário por nome de usuário
  buscarUsuarioPorNome(usuario) {
    const users = this.getAllUsers();
    return users.find(u => u.usuario === usuario);
  }
}

// Instância global do gerenciador de usuários
const userManager = new UserManager();

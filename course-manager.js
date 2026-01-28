// Sistema de Gerenciamento de Cursos Local
class CourseManager {
  constructor() {
    this.storageKey = 'sistema_cursos';
    this.initializeDefaultCourses();
  }

  // Inicializar cursos padrão se não existirem
  initializeDefaultCourses() {
    const courses = this.getAllCourses();
    if (courses.length === 0) {
      const defaultCourses = [
        {
          id: 'excel_001',
          nome: 'Excel',
          descricao: 'Aprenda Excel do básico ao avançado',
          duracao: '40h',
          nivel: 'Iniciante a Avançado',
          categoria: 'Office',
          emoji: '📊',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'python_001',
          nome: 'Python',
          descricao: 'Programação em Python',
          duracao: '60h',
          nivel: 'Iniciante',
          categoria: 'Programação',
          emoji: '💻',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'arduino_001',
          nome: 'Arduino',
          descricao: 'Introdução à programação com Arduino',
          duracao: '40h',
          nivel: 'Iniciante',
          categoria: 'Eletrônica',
          emoji: '⚡',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'games_001',
          nome: 'Criação de jogos',
          descricao: 'Aprenda a criar seus próprios jogos',
          duracao: '80h',
          nivel: 'Intermediário',
          categoria: 'Game Development',
          emoji: '🎮',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'ingles_001',
          nome: 'Inglês',
          descricao: 'Inglês técnico para programadores',
          duracao: '100h',
          nivel: 'Todos os níveis',
          categoria: 'Idiomas',
          emoji: '🌎',
          dataCriacao: new Date().toISOString()
        },
        {
          id: 'espanhol_001',
          nome: 'Espanhol',
          descricao: 'Espanhol para tecnologia',
          duracao: '100h',
          nivel: 'Todos os níveis',
          categoria: 'Idiomas',
          emoji: '🌎',
          dataCriacao: new Date().toISOString()
        }
      ];
      
      this.saveCourses(defaultCourses);
    }
  }

  // Obter todos os cursos
  getAllCourses() {
    try {
      const courses = localStorage.getItem(this.storageKey);
      return courses ? JSON.parse(courses) : [];
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      return [];
    }
  }

  // Salvar cursos no localStorage
  saveCourses(courses) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(courses));
      return true;
    } catch (error) {
      console.error('Erro ao salvar cursos:', error);
      return false;
    }
  }

  // Gerar ID único para curso
  generateId(nome) {
    const prefix = nome.toLowerCase().replace(/[^a-z0-9]/g, '').substr(0, 10);
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  }

  // Adicionar novo curso
  adicionarCurso(nome, descricao, duracao, nivel, categoria, emoji) {
    const courses = this.getAllCourses();
    
    const newCourse = {
      id: this.generateId(nome),
      nome,
      descricao,
      duracao,
      nivel,
      categoria,
      emoji,
      dataCriacao: new Date().toISOString()
    };
    
    courses.push(newCourse);
    const saved = this.saveCourses(courses);
    
    return saved ? newCourse : null;
  }

  // Atualizar curso existente
  atualizarCurso(id, dados) {
    const courses = this.getAllCourses();
    const index = courses.findIndex(c => c.id === id);
    
    if (index === -1) {
      return null;
    }
    
    courses[index] = {
      ...courses[index],
      ...dados,
      id // Manter o mesmo ID
    };
    
    const saved = this.saveCourses(courses);
    return saved ? courses[index] : null;
  }

  // Remover curso
  removerCurso(id) {
    const courses = this.getAllCourses();
    const filtered = courses.filter(c => c.id !== id);
    
    if (filtered.length === courses.length) {
      return false; // Nenhum curso foi removido
    }
    
    return this.saveCourses(filtered);
  }

  // Buscar curso por ID
  getCursoById(id) {
    const courses = this.getAllCourses();
    return courses.find(c => c.id === id) || null;
  }

  // Renderizar cursos em uma tabela
  renderizarTabelaCursos(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const courses = this.getAllCourses();
    
    const table = document.createElement('table');
    table.className = 'users-table w-full';
    
    table.innerHTML = `
      <thead>
        <tr>
          <th class="p-3">Emoji</th>
          <th class="p-3">Nome</th>
          <th class="p-3">Descrição</th>
          <th class="p-3">Duração</th>
          <th class="p-3">Nível</th>
          <th class="p-3">Categoria</th>
          <th class="p-3">Ações</th>
        </tr>
      </thead>
      <tbody>
        ${courses.map(course => `
          <tr>
            <td class="p-3">${course.emoji}</td>
            <td class="p-3">${course.nome}</td>
            <td class="p-3">${course.descricao}</td>
            <td class="p-3">${course.duracao}</td>
            <td class="p-3">${course.nivel}</td>
            <td class="p-3">${course.categoria}</td>
            <td class="p-3">
              <button onclick="courseManager.editarCurso('${course.id}')" class="btn btn-sm btn-secondary">✏️ Editar</button>
              <button onclick="courseManager.removerCursoComConfirmacao('${course.id}')" class="btn btn-sm btn-danger">❌ Remover</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
  }

  // Editar curso (preencher formulário)
  editarCurso(id) {
    const course = this.getCursoById(id);
    if (!course) return;

    // Preencher formulário
    document.getElementById('cursoId').value = course.id;
    document.getElementById('cursoNome').value = course.nome;
    document.getElementById('cursoDescricao').value = course.descricao;
    document.getElementById('cursoDuracao').value = course.duracao;
    document.getElementById('cursoNivel').value = course.nivel;
    document.getElementById('cursoCategoria').value = course.categoria;
    document.getElementById('cursoEmoji').value = course.emoji;

    // Mostrar formulário
    document.getElementById('cursoForm').style.display = 'block';
  }

  // Remover curso com confirmação
  removerCursoComConfirmacao(id) {
    const course = this.getCursoById(id);
    if (!course) return;

    if (confirm(`Tem certeza que deseja remover o curso "${course.nome}"?`)) {
      if (this.removerCurso(id)) {
        this.renderizarTabelaCursos('cursosLista');
        alert('Curso removido com sucesso!');
      } else {
        alert('Erro ao remover curso.');
      }
    }
  }
}

// Instanciar o gerenciador de cursos
const courseManager = new CourseManager();

// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Se estivermos na página do dashboard
  if (document.getElementById('cursosLista')) {
    courseManager.renderizarTabelaCursos('cursosLista');
    
    // Configurar o formulário de curso
    const form = document.getElementById('cursoForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('cursoId').value;
        const dados = {
          nome: document.getElementById('cursoNome').value,
          descricao: document.getElementById('cursoDescricao').value,
          duracao: document.getElementById('cursoDuracao').value,
          nivel: document.getElementById('cursoNivel').value,
          categoria: document.getElementById('cursoCategoria').value,
          emoji: document.getElementById('cursoEmoji').value
        };

        let success = false;
        if (id) {
          // Atualizar curso existente
          success = courseManager.atualizarCurso(id, dados);
        } else {
          // Adicionar novo curso
          success = courseManager.adicionarCurso(
            dados.nome,
            dados.descricao,
            dados.duracao,
            dados.nivel,
            dados.categoria,
            dados.emoji
          );
        }

        if (success) {
          alert(id ? 'Curso atualizado com sucesso!' : 'Curso adicionado com sucesso!');
          form.reset();
          document.getElementById('cursoId').value = '';
          form.style.display = 'none';
          courseManager.renderizarTabelaCursos('cursosLista');
        } else {
          alert('Erro ao salvar curso.');
        }
      });
    }
  }
});
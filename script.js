function validarLogin() {
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const aviso = document.getElementById('loginAviso');

  if (!usuario || !senha) {
    aviso.textContent = "Preencha todos os campos.";
    aviso.style.color = "red";
    aviso.style.display = "block";
    aviso.className = "alert alert-error";
    return false;
  }

  // Usar sistema local de usuários
  const resultado = userManager.validarLogin(usuario, senha);

  if (resultado.sucesso) {
    aviso.textContent = "Login realizado com sucesso!";
    aviso.style.color = "green";
    aviso.style.display = "block";
    aviso.className = "alert alert-success";
    
    // Armazenar dados do usuário na sessão
    sessionStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
    
    // Redirecionar baseado no tipo de usuário
    if (resultado.usuario.tipo === 'admin') {
      aviso.textContent = "Login realizado com sucesso! Redirecionando para Dashboard...";
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      aviso.textContent = "Login realizado com sucesso! Bem-vindo ao ambiente dos alunos!";
      mostrarAmbienteAluno();
    }
    
    return true;
  } else {
    // Exibir mensagem específica baseada no tipo de erro
    let mensagemErro = resultado.mensagem;
    let corErro = "red";
    let alertClass = "alert-error";
    
    if (resultado.tipo_erro === 'usuario_inexistente') {
      mensagemErro = "Usuário não encontrado. Verifique o nome de usuário.";
      corErro = "#ff6b35"; // Laranja para usuário inexistente
      alertClass = "alert-warning";
    } else if (resultado.tipo_erro === 'senha_incorreta') {
      mensagemErro = "Senha incorreta. Tente novamente.";
      corErro = "#dc3545"; // Vermelho para senha incorreta
      alertClass = "alert-error";
    }
    
    aviso.textContent = mensagemErro;
    aviso.style.color = corErro;
    aviso.style.display = "block";
    aviso.className = `alert ${alertClass}`;
    return false;
  }
}


// Função para mostrar ambiente dos alunos
function mostrarAmbienteAluno() {
  // Esconder seção de login
  const loginSection = document.getElementById('loginSection');
  if (loginSection) {
    loginSection.style.display = 'none';
  }
  
  // Mostrar seções principais
  const secoesPrincipais = document.getElementById('secoesPrincipais');
  if (secoesPrincipais) {
    secoesPrincipais.classList.add('logado');
  }
  
  // Adicionar funcionalidades específicas para alunos
  adicionarFuncionalidadesAluno();
}

// Função para mostrar ambiente do admin
function mostrarAmbienteAdmin() {
  // Esconder seção de login
  const loginSection = document.getElementById('loginSection');
  if (loginSection) {
    loginSection.style.display = 'none';
  }
  
  // Mostrar seções principais
  const secoesPrincipais = document.getElementById('secoesPrincipais');
  if (secoesPrincipais) {
    secoesPrincipais.classList.add('logado');
  }
  
  // Adicionar funcionalidades específicas para admin
  adicionarFuncionalidadesAdmin();
}

// Função para adicionar funcionalidades específicas para alunos
function adicionarFuncionalidadesAluno() {
  // Não injetamos a seção "Meus Cursos" para usuários comuns.
  // Se necessário, a seção pode ser restaurada criando um elemento
  // com id "cursos-aluno" e inserindo-o no conteúdo principal.
  
  // A adição do botão de perfil foi removida conforme solicitado
}

// Função para adicionar funcionalidades específicas para admin
function adicionarFuncionalidadesAdmin() {
  // Painel administrativo removido do portal por solicitação.
  // Esta função foi deixada intencionalmente vazia para evitar injeção
  // do painel administrativo na página principal. Se quiser restaurar
  // a seção, reimplemente o conteúdo aqui.
}

// Funções específicas para alunos
function continuarCurso(curso) {
  alert(`Continuando curso de ${curso}...`);
  // Aqui você pode implementar a lógica para continuar o curso
}

function mostrarPerfilAluno() {
  const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  alert(`Perfil do aluno: ${usuarioLogado.nome}\nUsuário: ${usuarioLogado.usuario}\nEmail: ${usuarioLogado.email}`);
}

// Funções específicas para admin
function mostrarRelatorios() {
  alert('Funcionalidade de relatórios em desenvolvimento...');
  // Aqui você pode implementar a lógica para mostrar relatórios
}

function mostrarConfiguracoes() {
  alert('Funcionalidade de configurações em desenvolvimento...');
  // Aqui você pode implementar a lógica para mostrar configurações
}


// Função para adicionar novo usuário
function adicionarUsuario(nome, usuario, senha, email, tipo = 'usuario') {
  return userManager.adicionarUsuario(nome, usuario, senha, email, tipo);
}

// Função para listar usuários
function listarUsuarios() {
  return userManager.listarUsuarios();
}

// Função para remover usuário
function removerUsuario(usuario) {
  return userManager.removerUsuario(usuario);
}

// Função para alterar senha
function alterarSenha(usuario, novaSenha) {
  return userManager.alterarSenha(usuario, novaSenha);
}

// Função para abrir o perfil do usuário
function abrirPerfilUsuario() {
    // Obter usuário atual da sessionStorage
    const usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (!usuarioAtual) {
        alert('Erro ao carregar dados do usuário');
        return;
    }

    // Criar conteúdo do modal
    const modalContent = `
        <div class="card animate-fade-in-up">
            <div class="card-header">
                <h2 class="card-title">Meu Perfil</h2>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label class="form-label">Nome Completo</label>
                    <input type="text" class="form-input" value="${usuarioAtual.nome}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">Nome de Usuário</label>
                    <input type="text" class="form-input" value="${usuarioAtual.usuario}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="email" class="form-input" value="${usuarioAtual.email}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">Tipo de Usuário</label>
                    <input type="text" class="form-input" value="${usuarioAtual.tipo === 'admin' ? 'Administrador' : 'Usuário'}" disabled>
                </div>
                <div class="form-group">
                    <label for="novaSenha" class="form-label">Mudar Senha</label>
                    <input type="password" id="novaSenha" class="form-input" placeholder="Digite a nova senha">
                </div>
                <div class="form-group">
                    <label for="confirmarSenha" class="form-label">Confirmar Senha</label>
                    <input type="password" id="confirmarSenha" class="form-input" placeholder="Confirme a nova senha">
                </div>
            </div>
            <div class="card-footer">
                <button id="btnSalvarSenha" disabled class="btn btn-primary">Salvar</button>
                <button onclick="fecharModal()" class="btn btn-ghost">Fechar</button>
            </div>
        </div>
    `;

    // Criar overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal" style="margin-top: 2rem;">
            ${modalContent}
        </div>
    `;

    // Adicionar modal ao body
    document.body.appendChild(modalOverlay);

    // Fechar modal ao clicar fora
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            fecharModal();
        }
    });

    // Adicionar validação em tempo real para os campos de senha
    const novaSenha = document.getElementById('novaSenha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const btnSalvar = document.getElementById('btnSalvarSenha');

    function validarSenhas() {
        const senha1 = novaSenha.value;
        const senha2 = confirmarSenha.value;
        
        // Habilitar botão apenas se ambos os campos estiverem preenchidos e iguais
        btnSalvar.disabled = !senha1 || !senha2 || senha1 !== senha2;
    }

    novaSenha.addEventListener('input', validarSenhas);
    confirmarSenha.addEventListener('input', validarSenhas);

    // Adicionar evento de clique no botão salvar
    btnSalvar.addEventListener('click', () => {
        const senha = novaSenha.value;
        const resultado = userManager.alterarSenha(usuarioAtual.usuario, senha);

        if (resultado.sucesso) {
            alert('Senha alterada com sucesso!');
            fecharModal();
        } else {
            alert('Erro ao alterar senha: ' + resultado.mensagem);
        }
    });
}

// Função para alterar a senha do usuário
function alterarSenhaUsuario() {
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (!novaSenha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem');
        return;
    }

    const usuarioAtual = JSON.parse(localStorage.getItem('usuario_atual'));
    const resultado = userManager.alterarSenha(usuarioAtual.usuario, novaSenha);

    if (resultado.sucesso) {
        alert('Senha alterada com sucesso!');
        fecharModal();
    } else {
        alert('Erro ao alterar senha: ' + resultado.mensagem);
    }
}

// Função para fechar o modal
function fecharModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
    }
}

// Adicionar listener para o formulário de login
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se usuário já está logado (para admin vindo do dashboard)
  const usuarioLogado = verificarLogin();
  if (usuarioLogado && usuarioLogado.tipo === 'admin') {
    // Admin já logado - mostrar ambiente completo diretamente
    mostrarAmbienteAdmin();
  }
  
  // Listener para formulário de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      validarLogin();
    });
    
    // Limpar mensagens quando o usuário começar a digitar
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const aviso = document.getElementById('loginAviso');
    
    if (usuarioInput && senhaInput && aviso) {
      usuarioInput.addEventListener('input', function() {
        aviso.style.display = 'none';
      });
      
      senhaInput.addEventListener('input', function() {
        aviso.style.display = 'none';
      });
    }
  }
  
  // Listener para formulário de contato
  const contatoForm = document.getElementById('contatoForm');
  if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      validarFormulario();
    });
  }
  
  // Listener para modo escuro
  const toggle = document.getElementById("modo-escuro-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("modo-escuro");
      
      // Atualizar todas as imagens do logo
      const logos = document.querySelectorAll('.logo-img, .logo-login');
      logos.forEach(logo => {
        const isDarkMode = document.body.classList.contains("modo-escuro");
        const currentSrc = logo.getAttribute('src');
        if (isDarkMode) {
          logo.setAttribute('src', currentSrc.replace('logo.png', 'logo-white.png'));
        } else {
          logo.setAttribute('src', currentSrc.replace('logo-white.png', 'logo.png'));
        }
      });
      
      // Atualizar o ícone do botão
      toggle.textContent = document.body.classList.contains("modo-escuro") ? '☀️' : '🌙';
    });
  }
  
  // Inicializar VLibras
  if (window.VLibras) {
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  }
  
  // Inicializar sintetizador de voz
  inicializarSintetizador();
});

// Função para verificar se usuário está logado
function verificarLogin() {
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  return usuarioLogado ? JSON.parse(usuarioLogado) : null;
}

// Função para fazer logout
function fazerLogout() {
  sessionStorage.removeItem('usuarioLogado');
  window.location.href = 'index.html';
}

function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const aviso = document.getElementById('aviso');

  if (!nome || !email || !mensagem) {
    aviso.textContent = "Todos os campos são obrigatórios.";
    aviso.style.color = "red";
    return false;
  }

  aviso.textContent = "Mensagem enviada com sucesso!";
  aviso.style.color = "green";
  return true;
}

// Função para inicializar sintetizador de voz
function inicializarSintetizador() {
  const sintetizador = window.speechSynthesis;

  function falar(texto) {
    if (sintetizador.speaking) sintetizador.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    sintetizador.speak(fala);
  }

  // Listener para elementos focados
  document.addEventListener('focusin', (event) => {
    const elemento = event.target;
    if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
      const label = document.querySelector(`label[for="${elemento.id}"]`);
      if (label) {
        falar(label.innerText);
      }
    } else if (elemento.tagName === 'BUTTON' || elemento.tagName === 'A') {
      falar(elemento.innerText);
    }
  });
}





function aumentarFonte() {
  const root = document.documentElement;
  const currentSize = parseFloat(getComputedStyle(root).fontSize);
  if (currentSize < 24) {
    root.style.fontSize = (currentSize + 2) + "px";
    // Ajusta todos os elementos com tamanho relativo
    document.querySelectorAll('*').forEach(el => {
      if (el.tagName !== 'HTML') {
        const fontSize = window.getComputedStyle(el).fontSize;
        if (fontSize.endsWith('em') || fontSize.endsWith('rem')) {
          el.style.fontSize = fontSize; // Força recálculo
        }
      }
    });
  }
}

function diminuirFonte() {
  const root = document.documentElement;
  const currentSize = parseFloat(getComputedStyle(root).fontSize);
  if (currentSize > 12) {
    root.style.fontSize = (currentSize - 2) + "px";
    // Ajusta todos os elementos com tamanho relativo
    document.querySelectorAll('*').forEach(el => {
      if (el.tagName !== 'HTML') {
        const fontSize = window.getComputedStyle(el).fontSize;
        if (fontSize.endsWith('em') || fontSize.endsWith('rem')) {
          el.style.fontSize = fontSize; // Força recálculo
        }
      }
    });
  }
}

// ==========================
// Cursos - integração com /api/content
// ==========================

async function fetchCursosFromApi() {
  try {
    // Primeiro, tentar carregar cursos gerenciados pelo dashboard (localStorage)
    try {
      const localRaw = localStorage.getItem('sistema_cursos');
      if (localRaw) {
        const local = JSON.parse(localRaw);
        if (Array.isArray(local) && local.length) {
          // Mapear para o formato esperado pela UI
          return local.map(c => ({
            id: c.id,
            name: c.nome || c.name,
            description: c.descricao || c.description || '',
            duration: c.duracao || c.duration || '',
            level: c.nivel || c.level || '',
            category: c.categoria || c.category || '',
            emoji: c.emoji || ''
          }));
        }
      }
    } catch (le) {
      console.warn('Erro ao ler cursos locais:', le && le.message ? le.message : le);
    }

    // Se não houver cursos locais, tentar backend API
    const res = await fetch('/api/content/courses');
    if (!res.ok) throw new Error('Falha ao buscar cursos');
    const payload = await res.json();
    if (payload && payload.success && payload.data && payload.data.courses) {
      return payload.data.courses;
    }
    // older format: if data is an array
    if (payload && Array.isArray(payload)) return payload;
    return null;
  } catch (e) {
    console.warn('Erro ao buscar cursos da API:', e && e.message ? e.message : e);
    return null;
  }
}

// Renderiza a seção 'Nossos Cursos' a partir de dados
function renderNossosCursos(cursos) {
  const container = document.getElementById('nossosCursosContainer');
  if (!container) return;
  container.innerHTML = '';

  cursos.forEach(c => {
    const card = document.createElement('div');
    card.className = 'curso-item';
    card.innerHTML = `
      <h3 class="text-lg font-semibold text-primary">${c.name || c.title}</h3>
      <p class="text-sm text-muted">${c.description || ''}</p>
      <p class="text-sm text-muted">Duração: ${c.duration || '—'} • Nível: ${c.level || '—'}</p>
      <div style="margin-top:8px;display:flex;gap:8px;">
        <button class="btn btn-ghost" onclick="inscreverCurso('${c.id}')">Inscrever</button>
        <button class="btn btn-outline" onclick="verDetalhesCurso('${c.id}')">Detalhes</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Inscrever (demo local) - adiciona ao localStorage como 'meusCursos'
async function inscreverCurso(id) {
  const apiCursos = await fetchCursosFromApi();
  let found = null;
  if (Array.isArray(apiCursos)) found = apiCursos.find(x => String(x.id) === String(id));
  if (!found) return alert('Curso não encontrado.');

  const meus = JSON.parse(localStorage.getItem('meusCursos') || '[]');
  if (meus.find(m => m.title === (found.name || found.title))) return alert('Já inscrito.');
  meus.push({ id: 'srv-' + found.id, title: found.name || found.title, description: found.description || '', progress: 0 });
  localStorage.setItem('meusCursos', JSON.stringify(meus));
  renderMeusCursos(meus);
  alert('Inscrição realizada (demo local).');
}

function verDetalhesCurso(id) {
  // Tenta encontrar o curso nos cursos locais (sistema_cursos) primeiro,
  // depois na API. Abre um modal simples com os detalhes.
  (async function() {
    let cursos = await fetchCursosFromApi();
    if (!Array.isArray(cursos)) cursos = [];
    const c = cursos.find(x => String(x.id) === String(id));
    if (!c) return alert('Curso não encontrado');

    // Criar overlay/modal
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const modal = document.createElement('div');
    modal.style.background = 'var(--white)';
    modal.style.color = 'var(--text-primary)';
    modal.style.padding = '20px';
    modal.style.borderRadius = '12px';
    modal.style.maxWidth = '760px';
    modal.style.width = '90%';
    modal.style.boxShadow = 'var(--shadow-xl)';

    modal.innerHTML = `
      <h3 style="margin-top:0;font-size:1.25rem;">${c.emoji || ''} ${c.name || c.title}</h3>
      <p style="color:var(--text-secondary);">${c.description || ''}</p>
      <p style="margin-top:8px;">Duração: <strong>${c.duration || '—'}</strong></p>
      <p>Nível: <strong>${c.level || '—'}</strong></p>
      <p>Categoria: <strong>${c.category || c.categoria || '—'}</strong></p>
      <div style="margin-top:16px;text-align:right;">
        <button id="modalCloseBtn" class="btn btn-ghost btn-sm">Fechar</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('modalCloseBtn').addEventListener('click', () => {
      overlay.remove();
    });
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) overlay.remove();
    });
  })();
}

// Inicializa Meus Cursos a partir da API (filtro Inglês + Python) ou fallback
async function initMeusCursosFromApiOrFallback() {
  const apiCursos = await fetchCursosFromApi();
  if (Array.isArray(apiCursos) && apiCursos.length) {
    const meus = apiCursos.filter(c => /python/i.test(c.name || c.title || '') || /ingl/i.test(c.name || c.title || '') );
    const mapped = meus.map(c => ({ id: 'srv-' + c.id, title: c.name || c.title, description: c.description || '', progress: 0 }));
    if (mapped.length) {
      localStorage.setItem('meusCursos', JSON.stringify(mapped));
      renderMeusCursos(mapped);
      return;
    }
  }
  // fallback: render existent local or sample
  const stored = JSON.parse(localStorage.getItem('meusCursos') || 'null');
  if (stored && Array.isArray(stored)) {
    renderMeusCursos(stored);
  } else {
    const samples = [ { id: 'c-py', title: 'Python', description: 'Programação em Python', progress: 10 }, { id: 'c-en', title: 'Inglês', description: 'Inglês técnico para programadores', progress: 5 } ];
    localStorage.setItem('meusCursos', JSON.stringify(samples));
    renderMeusCursos(samples);
  }
}

// Expose renderMeusCursos so it can be used earlier if needed
window.renderMeusCursos = window.renderMeusCursos || function(c){ console.warn('renderMeusCursos not available yet'); };

// On load, fetch and render cursos
document.addEventListener('DOMContentLoaded', function() {
  fetchCursosFromApi().then(api => {
    if (api && api.length) renderNossosCursos(api);
    else renderNossosCursos([ { id: 'sample1', name: 'Python', description: 'Programação em Python', duration: '60h', level: 'Iniciante' }, { id: 'sample2', name: 'Inglês', description: 'Inglês técnico para programadores', duration: '100h', level: 'Todos os níveis' }]);
  });
  // Inicializar 'Meus Cursos' somente quando o usuário estiver logado
  // e não for um usuário comum (tipo 'usuario'). Isso garante que
  // a seção não apareça para usuários do tipo 'usuario'.
  try {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado') || 'null');
    if (usuario && usuario.tipo && usuario.tipo !== 'usuario') {
      initMeusCursosFromApiOrFallback();
    } else {
      // Garantir que não exista a seção 'cursos-aluno' no DOM
      const existing = document.getElementById('cursos-aluno');
      if (existing) existing.remove();
    }
    // Mostrar/ocultar o botão emoji do dashboard no cabeçalho
    const adminBtn = document.getElementById('adminDashboardNav');
    const dashboardLinkDiv = document.getElementById('dashboardLink');
    if (adminBtn) {
      if (usuario && usuario.tipo === 'admin') adminBtn.classList.remove('hidden');
      else adminBtn.classList.add('hidden');
    }
    if (dashboardLinkDiv) {
      if (usuario && usuario.tipo === 'admin') dashboardLinkDiv.classList.remove('hidden');
      else dashboardLinkDiv.classList.add('hidden');
    }
  } catch (e) {
    // Em caso de erro ao ler sessão, evitar inicializar Meus Cursos
    const existing = document.getElementById('cursos-aluno');
    if (existing) existing.remove();
    const adminBtn = document.getElementById('adminDashboardNav');
    const dashboardLinkDiv = document.getElementById('dashboardLink');
    if (adminBtn) adminBtn.classList.add('hidden');
    if (dashboardLinkDiv) dashboardLinkDiv.classList.add('hidden');
  }
});


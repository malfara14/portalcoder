// Cliente API para comunicação com o backend
class ApiClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.apiUrl = `${baseUrl}/api`;
  }

  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    try {
      const url = `${this.apiUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Obter todos os textos do site
  async getTexts() {
    return await this.request('/content/texts');
  }

  // Obter informações da escola
  async getSchoolInfo() {
    return await this.request('/content/school-info');
  }

  // Obter lista de cursos
  async getCourses() {
    return await this.request('/content/courses');
  }

  // Obter configurações do site
  async getConfig() {
    return await this.request('/content/config');
  }

  // Obter lista de imagens
  async getImages() {
    return await this.request('/assets/images');
  }

  // Obter lista de vídeos
  async getVideos() {
    return await this.request('/assets/videos');
  }

  // Obter URL do logo
  getLogoUrl() {
    // Fallback para logo local se backend não estiver disponível
    return `${this.baseUrl}/api/assets/logo`;
  }

  // Obter URL de uma imagem específica
  getImageUrl(filename) {
    return `${this.baseUrl}/api/assets/images/${filename}`;
  }

  // Obter URL de um vídeo específico
  getVideoUrl(filename) {
    return `${this.baseUrl}/api/assets/videos/${filename}`;
  }

  // Verificar se o backend está disponível
  async isBackendAvailable() {
    try {
      const response = await fetch(`${this.baseUrl}/api/content/config`, {
        method: 'GET',
        timeout: 3000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Carregar dados iniciais do site
  async loadSiteData() {
    try {
      const [texts, schoolInfo, courses, config] = await Promise.all([
        this.getTexts(),
        this.getSchoolInfo(),
        this.getCourses(),
        this.getConfig()
      ]);

      return {
        texts: texts.data,
        schoolInfo: schoolInfo.data,
        courses: courses.data,
        config: config.data
      };
    } catch (error) {
      console.error('Erro ao carregar dados do site:', error);
      return null;
    }
  }
}

// Instância global do cliente API
const apiClient = new ApiClient();

// Função para inicializar o site com dados do backend
async function initializeSiteWithBackend() {
  try {
    // Verificar se o backend está disponível
    const backendAvailable = await apiClient.isBackendAvailable();
    
    if (backendAvailable) {
      const siteData = await apiClient.loadSiteData();
      
      if (siteData) {
        // Atualizar título da página
        if (siteData.texts.site.title) {
          document.title = siteData.texts.site.title;
          const siteTitle = document.getElementById('site-title');
          if (siteTitle) {
            siteTitle.textContent = siteData.texts.site.title;
          }
        }

        // Atualizar seção sobre
        updateAboutSection(siteData.texts.sections.about);
        
        // Atualizar seção de cursos
        updateCoursesSection(siteData.courses);
        
        // Atualizar seção de contato
        updateContactSection(siteData.texts.sections.contact);
        
        // Atualizar seção de vídeo
        updateVideoSection(siteData.texts.sections.video);
        
        // Atualizar logo
        updateLogo(siteData.schoolInfo.logo);
        
        // Atualizar URLs para usar backend
        updateUrlsToBackend();
        
        console.log('Site inicializado com dados do backend');
        return;
      }
    }
    
    // Fallback para dados locais
    console.log('Backend não disponível, usando dados locais');
    initializeWithLocalData();
    
  } catch (error) {
    console.error('Erro ao inicializar site com backend:', error);
    // Fallback para dados locais se o backend não estiver disponível
    console.log('Usando dados locais como fallback');
    initializeWithLocalData();
  }
}

// Função para inicializar com dados locais
function initializeWithLocalData() {
  // Atualizar seção sobre com dados locais
  const aboutContent = document.getElementById('sobre-conteudo');
  if (aboutContent) {
    aboutContent.textContent = "Nosso objetivo é ensinar e apoiar a nova geração no aprendizado de idiomas e no uso da tecnologia. Aqui, o conhecimento é para todos: oferecemos recursos em Libras e áudio, para que cada pessoa aprenda de forma acessível e inclusiva.";
  }
  
  // Atualizar vídeo com fallback local
  const videoElement = document.querySelector('video source');
  const video = document.querySelector('#apresentacao-video');
  const videoFallback = document.getElementById('video-fallback');
  
  if (videoElement) {
    videoElement.src = 'backend/public/media/backend/public/media/apresentacao.mp4';
    videoElement.type = 'video/mp4';
    console.log('Vídeo local configurado:', videoElement.src);
  }
  
  // Configurar fallback para quando o vídeo não carregar
  if (video) {
    video.onerror = function() {
      console.log('Vídeo local não encontrado, mostrando fallback');
      video.style.display = 'none';
      if (videoFallback) {
        videoFallback.style.display = 'block';
      }
    };
  }
  
  // Atualizar logo com fallback local
  updateLogoWithFallback();
}

// Função para atualizar seção sobre
function updateAboutSection(aboutData) {
  const aboutTitle = document.getElementById('titulo-sobre');
  const aboutContent = document.getElementById('sobre-conteudo');
  
  if (aboutTitle && aboutData.title) {
    aboutTitle.textContent = aboutData.title;
  }
  
  if (aboutContent && aboutData.content) {
    aboutContent.textContent = aboutData.content;
  }
}

// Função para atualizar seção de cursos
function updateCoursesSection(coursesData) {
  const coursesTitle = document.getElementById('titulo-cursos');
  const coursesList = document.querySelector('#cursos ul');
  
  if (coursesTitle && coursesData.courses) {
    coursesTitle.textContent = 'Nossos Cursos';
  }
  
  if (coursesList && coursesData.courses) {
    coursesList.innerHTML = '';
    coursesData.courses.forEach(course => {
      const li = document.createElement('li');
      li.textContent = course.name;
      coursesList.appendChild(li);
    });
  }
}

// Função para atualizar seção de contato
function updateContactSection(contactData) {
  const contactTitle = document.getElementById('titulo-contato');
  const nameLabel = document.querySelector('label[for="nome"]');
  const emailLabel = document.querySelector('label[for="email"]');
  const messageLabel = document.querySelector('label[for="mensagem"]');
  const submitButton = document.querySelector('#contatoForm button');
  
  if (contactTitle && contactData.title) {
    contactTitle.textContent = contactData.title;
  }
  
  if (nameLabel && contactData.form.name) {
    nameLabel.textContent = contactData.form.name;
  }
  
  if (emailLabel && contactData.form.email) {
    emailLabel.textContent = contactData.form.email;
  }
  
  if (messageLabel && contactData.form.message) {
    messageLabel.textContent = contactData.form.message;
  }
  
  if (submitButton && contactData.form.submit) {
    submitButton.textContent = contactData.form.submit;
  }
}

// Função para atualizar seção de vídeo
function updateVideoSection(videoData) {
  const videoTitle = document.querySelector('section h2');
  const videoElement = document.querySelector('video source');
  
  if (videoTitle && videoData.title) {
    videoTitle.textContent = videoData.title;
  }
  
  if (videoElement) {
    // Tentar carregar vídeo do backend
    videoElement.src = apiClient.getVideoUrl('apresentacao.mp4');
    videoElement.type = 'video/mp4';
  }
}

// Função para atualizar logo
function updateLogo(logoData) {
  // Adicionar logo ao header se não existir
  const header = document.querySelector('header');
  if (header && logoData) {
    const existingLogo = header.querySelector('.logo');
    if (!existingLogo) {
      const logoImg = document.createElement('img');
      logoImg.src = apiClient.getLogoUrl();
      logoImg.alt = logoData.alt || 'Logo da Coder Factory';
      logoImg.className = 'logo';
      logoImg.style.maxHeight = '60px';
      logoImg.style.marginRight = '20px';
      
      const title = header.querySelector('h1');
      if (title) {
        header.insertBefore(logoImg, title);
      }
    }
  }
}

// Função para atualizar logo com fallback local
function updateLogoWithFallback() {
  // Atualizar logo na tela de login
  const loginLogo = document.querySelector('.logo-login');
  if (loginLogo) {
    loginLogo.src = 'backend/public/media/logo.png';
    loginLogo.onerror = function() {
      console.log('Logo local não encontrado, ocultando elemento');
      this.style.display = 'none';
    };
  }
  
  // Atualizar logo no header
  const headerLogo = document.querySelector('.logo-header');
  if (headerLogo) {
    headerLogo.src = 'backend/public/media/logo.png';
    headerLogo.onerror = function() {
      console.log('Logo local não encontrado, ocultando elemento');
      this.style.display = 'none';
    };
  }
}

// Função para atualizar URLs para usar backend
function updateUrlsToBackend() {
  // Atualizar logo na tela de login
  const loginLogo = document.querySelector('.logo-login');
  if (loginLogo) {
    loginLogo.src = apiClient.getLogoUrl();
  }
  
  // Atualizar logo no header
  const headerLogo = document.querySelector('.logo-header');
  if (headerLogo) {
    headerLogo.src = apiClient.getLogoUrl();
  }
  
  // Atualizar vídeo
  const videoElement = document.querySelector('video source');
  if (videoElement) {
    videoElement.src = apiClient.getVideoUrl('apresentacao.mp4');
    videoElement.type = 'video/mp4';
  }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Sempre tentar inicializar com backend primeiro, depois fallback local
  initializeSiteWithBackend();
});

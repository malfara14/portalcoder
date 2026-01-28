const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Caminho para os dados
const dataPath = path.join(__dirname, '../data');

// Função para ler dados de um arquivo JSON
const readData = (filename) => {
  try {
    const filePath = path.join(dataPath, filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filename}:`, error);
    return null;
  }
};

// Função para escrever dados em arquivo JSON
const writeData = (filename, data) => {
  try {
    const filePath = path.join(dataPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filename}:`, error);
    return false;
  }
};

// Rota para obter todos os textos do site
router.get('/texts', (req, res) => {
  try {
    const texts = readData('texts.json');
    if (texts) {
      res.json({
        success: true,
        data: texts
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Arquivo de textos não encontrado'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar textos',
      error: error.message
    });
  }
});

// Rota para obter informações da escola
router.get('/school-info', (req, res) => {
  try {
    const schoolInfo = readData('school-info.json');
    if (schoolInfo) {
      res.json({
        success: true,
        data: schoolInfo
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Informações da escola não encontradas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar informações da escola',
      error: error.message
    });
  }
});

// Rota para obter lista de cursos
router.get('/courses', (req, res) => {
  try {
    const courses = readData('courses.json');
    if (courses) {
      res.json({
        success: true,
        data: courses
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Lista de cursos não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar cursos',
      error: error.message
    });
  }
});

// ==========================
// CRUD de Cursos (Admin)
// ==========================

// Criar novo curso
router.post('/courses', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.name) {
      return res.status(400).json({ success: false, message: 'Dados do curso inválidos' });
    }

    const coursesData = readData('courses.json') || { courses: [] };
    const arr = Array.isArray(coursesData.courses) ? coursesData.courses : [];
    const nextId = arr.reduce((max, c) => Math.max(max, (c.id || 0)), 0) + 1;

    const newCourse = Object.assign({ id: nextId }, payload);
    arr.push(newCourse);
    coursesData.courses = arr;

    const ok = writeData('courses.json', coursesData);
    if (!ok) return res.status(500).json({ success: false, message: 'Falha ao salvar curso' });

    return res.json({ success: true, data: newCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao criar curso', error: error.message });
  }
});

// Atualizar curso existente
router.put('/courses/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const payload = req.body;
    if (!id || !payload) return res.status(400).json({ success: false, message: 'Dados inválidos' });

    const coursesData = readData('courses.json') || { courses: [] };
    const arr = Array.isArray(coursesData.courses) ? coursesData.courses : [];
    const idx = arr.findIndex(c => parseInt(c.id, 10) === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Curso não encontrado' });

    arr[idx] = Object.assign({}, arr[idx], payload, { id: arr[idx].id });
    coursesData.courses = arr;

    const ok = writeData('courses.json', coursesData);
    if (!ok) return res.status(500).json({ success: false, message: 'Falha ao salvar curso' });

    return res.json({ success: true, data: arr[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao atualizar curso', error: error.message });
  }
});

// Remover curso
router.delete('/courses/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ success: false, message: 'ID inválido' });

    const coursesData = readData('courses.json') || { courses: [] };
    const arr = Array.isArray(coursesData.courses) ? coursesData.courses : [];
    const idx = arr.findIndex(c => parseInt(c.id, 10) === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Curso não encontrado' });

    const removed = arr.splice(idx, 1)[0];
    coursesData.courses = arr;

    const ok = writeData('courses.json', coursesData);
    if (!ok) return res.status(500).json({ success: false, message: 'Falha ao remover curso' });

    return res.json({ success: true, data: removed });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erro ao remover curso', error: error.message });
  }
});

// Rota para obter configurações do site
router.get('/config', (req, res) => {
  try {
    const config = readData('config.json');
    if (config) {
      res.json({
        success: true,
        data: config
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Configurações não encontradas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar configurações',
      error: error.message
    });
  }
});

module.exports = router;

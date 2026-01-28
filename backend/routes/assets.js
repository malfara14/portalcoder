const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Caminhos para os assets
const imagesPath = path.join(__dirname, '../public/images');
const videosPath = path.join(__dirname, '../public/videos');

// Rota para obter lista de imagens
router.get('/images', (req, res) => {
  try {
    if (fs.existsSync(imagesPath)) {
      const files = fs.readdirSync(imagesPath);
      const images = files
        .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
        .map(file => ({
          filename: file,
          url: `/api/assets/images/${file}`,
          path: path.join(imagesPath, file)
        }));
      
      res.json({
        success: true,
        data: images
      });
    } else {
      res.json({
        success: true,
        data: [],
        message: 'Pasta de imagens não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar imagens',
      error: error.message
    });
  }
});

// Rota para obter lista de vídeos
router.get('/videos', (req, res) => {
  try {
    if (fs.existsSync(videosPath)) {
      const files = fs.readdirSync(videosPath);
      const videos = files
        .filter(file => /\.(mp4|webm|ogg|avi|mov)$/i.test(file))
        .map(file => ({
          filename: file,
          url: `/api/assets/videos/${file}`,
          path: path.join(videosPath, file)
        }));
      
      res.json({
        success: true,
        data: videos
      });
    } else {
      res.json({
        success: true,
        data: [],
        message: 'Pasta de vídeos não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar vídeos',
      error: error.message
    });
  }
});

// Rota para servir imagens específicas
router.get('/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(imagesPath, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        message: 'Imagem não encontrada'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao servir imagem',
      error: error.message
    });
  }
});

// Rota para servir vídeos específicos
router.get('/videos/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(videosPath, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({
        success: false,
        message: 'Vídeo não encontrado'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao servir vídeo',
      error: error.message
    });
  }
});

// Rota para obter logo da escola
router.get('/logo', (req, res) => {
  try {
    const logoPath = path.join(imagesPath, 'logo.png');
    const logoSvgPath = path.join(imagesPath, 'logo.svg');
    
    if (fs.existsSync(logoPath)) {
      res.sendFile(logoPath);
    } else if (fs.existsSync(logoSvgPath)) {
      res.sendFile(logoSvgPath);
    } else {
      res.status(404).json({
        success: false,
        message: 'Logo da escola não encontrado'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao servir logo',
      error: error.message
    });
  }
});

module.exports = router;

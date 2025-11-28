const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');

router.get('/health', async (req, res) => {
  const ollamaHealth = await ollamaService.healthCheck();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      ollama: ollamaHealth,
    },
  });
});

router.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.listModels();
    res.json({
      success: true,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models',
    });
  }
});

module.exports = router;
const axios = require('axios');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async chat(messages, onChunk) {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: this.model,
          messages: messages,
          stream: true,
        },
        {
          responseType: 'stream',
        }
      );

      let fullResponse = '';

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (parsed.message && parsed.message.content) {
                fullResponse += parsed.message.content;
                if (onChunk) {
                  onChunk(parsed.message.content);
                }
              }

              if (parsed.done) {
                resolve(fullResponse);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        });

        response.data.on('error', (error) => {
          reject(error);
        });

        response.data.on('end', () => {
          if (fullResponse) {
            resolve(fullResponse);
          }
        });
      });
    } catch (error) {
      console.error('Ollama API Error:', error.message);
      throw new Error('Failed to communicate with Ollama service');
    }
  }

  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Error listing models:', error.message);
      return [];
    }
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return { status: 'healthy', models: response.data.models };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new OllamaService();
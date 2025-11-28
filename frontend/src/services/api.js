import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const conversationAPI = {
  createConversation: async (title = 'New Conversation') => {
    const response = await api.post('/conversations', { title });
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  getConversation: async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  sendMessage: async (conversationId, message, onChunk) => {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              onChunk(data.chunk);
            }
            if (data.done) {
              return data;
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    }
  },

  deleteConversation: async (id) => {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  },

  updateConversationTitle: async (id, title) => {
    const response = await api.patch(`/conversations/${id}/title`, { title });
    return response.data;
  },
};

export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  getModels: async () => {
    const response = await api.get('/models');
    return response.data;
  },
};

export default api;
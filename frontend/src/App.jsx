import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { conversationAPI } from './services/api';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await conversationAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await conversationAPI.createConversation();
      const newConversation = response.data;
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      const response = await conversationAPI.getConversation(id);
      setCurrentConversation(response.data);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await conversationAPI.deleteConversation(id);
      setConversations(conversations.filter(conv => conv._id !== id));
      if (currentConversation?._id === id) {
        setCurrentConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!currentConversation) {
      const response = await conversationAPI.createConversation();
      const newConversation = response.data;
      setCurrentConversation(newConversation);
      setConversations([newConversation, ...conversations]);
      await sendMessageToConversation(newConversation._id, message);
    } else {
      await sendMessageToConversation(currentConversation._id, message);
    }
  };

  const sendMessageToConversation = async (conversationId, message) => {
    try {
      setIsLoading(true);
      setStreamingMessage('');

      const updatedConv = {
        ...currentConversation,
        messages: [...(currentConversation?.messages || []), { role: 'user', content: message }]
      };
      setCurrentConversation(updatedConv);

      await conversationAPI.sendMessage(conversationId, message, (chunk) => {
        setStreamingMessage(prev => prev + chunk);
      });

      const response = await conversationAPI.getConversation(conversationId);
      setCurrentConversation(response.data);
      setStreamingMessage('');
      loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <Chat
        conversation={currentConversation}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        streamingMessage={streamingMessage}
      />
    </div>
  );
}

export default App;
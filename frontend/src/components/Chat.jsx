import { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import './Chat.css';

const Chat = ({ conversation, onSendMessage, isLoading, streamingMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamingMessage]);

  if (!conversation) {
    return (
      <div className="chat-container">
        <div className="chat-empty">
          <h1>ChatFlow</h1>
          <p>Start a conversation by typing a message below</p>
        </div>
        <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {conversation.messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {streamingMessage && (
          <Message role="assistant" content={streamingMessage} />
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;
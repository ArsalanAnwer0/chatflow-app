import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || disabled}
        >
          <FiSend />
        </button>
      </form>
      <div className="chat-input-footer">
        ChatFlow can make mistakes. Check important info.
      </div>
    </div>
  );
};

export default ChatInput;
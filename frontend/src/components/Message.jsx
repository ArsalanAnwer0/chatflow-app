import { FiUser, FiCpu } from 'react-icons/fi';
import './Message.css';

const Message = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        <div className="message-icon">
          {isUser ? <FiUser /> : <FiCpu />}
        </div>
        <div className="message-text">
          <div className="message-role">{isUser ? 'You' : 'Assistant'}</div>
          <div className="message-body">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
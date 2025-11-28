import { useState } from 'react';
import { FiPlus, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ conversations, currentConversation, onNewChat, onSelectConversation, onDeleteConversation }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <FiPlus /> New Chat
        </button>
      </div>

      <div className="conversations-list">
        {conversations.map((conv) => (
          <div
            key={conv._id}
            className={`conversation-item ${currentConversation?._id === conv._id ? 'active' : ''}`}
            onClick={() => onSelectConversation(conv._id)}
          >
            <FiMessageSquare className="conversation-icon" />
            <span className="conversation-title">{conv.title}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv._id);
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="app-info">
          <h3>ChatFlow</h3>
          <p>Powered by Ollama</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
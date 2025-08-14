import React, { useState, useRef, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';

// 定义 GraphQL mutation
const SEND_MESSAGE = gql`
  mutation SendMessage($message: String!) {
    sendMessage(message: $message) {
      id
      content
      role
      timestamp
    }
  }
`;

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是基于 DeepSeek 的 AI 助手，有什么我可以帮你的吗？',
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendMessage] = useMutation(SEND_MESSAGE);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 发送消息到 GraphQL API
      const { data } = await sendMessage({
        variables: { message: inputValue }
      });

      // 添加 AI 回复
      if (data?.sendMessage) {
        setMessages(prev => [...prev, data.sendMessage]);
      }
    } catch (error) {
      // 添加错误消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h2>DeepSeek AI 助手</h2>
        <p>基于 Cloudflare Workers 部署</p>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.role}`}
          >
            <div className="message-content">
              <div className="message-sender">
                {message.role === 'user' ? '你' : 'AI 助手'}
              </div>
              <div className="message-text">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="message-sender">AI 助手</div>
              <div className="message-text typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入你的消息..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          发送
        </button>
      </form>
    </div>
  );
};

export default AIChat;
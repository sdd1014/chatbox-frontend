import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatBox.css';
import aiAvatar from './ai-avatar.jpg';

// GraphQL API 端点 - 部署后需要替换为你的 Workers URL
const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:8787/graphql';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      text: '嗨！我是你的人工智能助手。有什么问题都可以问我。',
      sender: 'assistant',
      id: Date.now(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 调用 GraphQL API
  const callGraphQLAPI = async (message) => {
    const query = `
      mutation SendMessage($message: String!) {
        sendMessage(message: $message) {
          content
          role
        }
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { message },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.sendMessage;
  };

  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);

    // 添加用户消息
    const newUserMessage = {
      text: userMessage,
      sender: 'user',
      id: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // 显示加载状态
    setIsLoading(true);
    const loadingMessage = {
      text: '正在思考...',
      sender: 'assistant',
      id: Date.now() + 1,
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // 调用 GraphQL API
      const response = await callGraphQLAPI(userMessage);

      // 移除加载消息，添加 AI 响应
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            text: response.content,
            sender: 'assistant',
            id: Date.now() + 2,
          },
        ];
      });
    } catch (err) {
      console.error('Error calling API:', err);
      setError(err.message);

      // 移除加载消息，添加错误消息
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isLoading);
        return [
          ...filtered,
          {
            text: `抱歉，出现错误：${err.message}`,
            sender: 'assistant',
            id: Date.now() + 2,
            isError: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理键盘事件：Enter 发送，Shift+Enter 换行
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI 聊天助手</h2>
        {error && (
          <div className="error-banner" onClick={() => setError(null)}>
            {error} (点击关闭)
          </div>
        )}
      </div>
      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'} ${
              message.isError ? 'error-message' : ''
            } ${message.isLoading ? 'loading-message' : ''}`}
          >
            <div
              className="message-avatar"
              style={message.sender === 'assistant' ? {
                backgroundImage: `url(${aiAvatar})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'transparent',
                fontSize: 0
              } : {}}
            >
              {message.sender === 'user' ? '👤' : 'AI'}
            </div>
            <div className="message-content">
              {message.sender === 'assistant' && !message.isLoading ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
          className="chat-input"
          disabled={isLoading}
          rows={1}
        />
        <button type="submit" className="send-button" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
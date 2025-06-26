'use client';

import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import styles from '../../styles/message.module.css';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}

const MessagePage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Jane Smith",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Hello! Is it possible to make a...",
      timestamp: "11w"
    },
    {
      id: 2,
      name: "Chris Barlow",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Everything was great! Thank ...",
      timestamp: "20w"
    },
    {
      id: 3,
      name: "Paul Cobbett",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Sent you a message",
      timestamp: "20w"
    },
    {
      id: 4,
      name: "Aileen Willis",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Wonderful! Thanks!",
      timestamp: "23w"
    },
    {
      id: 5,
      name: "Alec Kirk",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Liked a message",
      timestamp: "25w"
    },
    {
      id: 6,
      name: "Victoria Terry",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "I checked your menu yesterd...",
      timestamp: "26w"
    },
    {
      id: 7,
      name: "Angela Brown",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XzizaW9c79upDHu0YfHImk5r8ZLMNV.png",
      lastMessage: "Hi! Will you be open during t...",
      timestamp: "26w"
    }
  ]);

  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: []
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg: Message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
      }));

      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Link href="/dashboard" className={styles.header}>
          <button className={styles.backButton}>
            <ArrowLeft size={24} />
          </button>
          <h1>Messages</h1>
        </Link>
        <div className={styles.conversationList}>
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${selectedConversation === conversation.id ? styles.selected : ''}`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <img src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} className={styles.avatar} />
              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <h3>{conversation.name}</h3>
                  <span className={styles.timestamp}>{conversation.timestamp}</span>
                </div>
                <p className={styles.lastMessage}>{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chatContainer}>
        {selectedConversation ? (
          <>
            <div className={styles.messageList}>
              {messages[selectedConversation].map(message => (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'me' ? styles.sent : styles.received}`}
                >
                  <div className={styles.messageContent}>
                    <p>{message.text}</p>
                    <span className={styles.messageTime}>{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.messageInput}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={styles.sendButton}
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <Send size={48} />
            </div>
            <h2>Your Messages</h2>
            <p>Send private photos and messages to a friend or group.</p>
            <button onClick={() => setSelectedConversation(1)} className={styles.sendMessageButton}>
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;

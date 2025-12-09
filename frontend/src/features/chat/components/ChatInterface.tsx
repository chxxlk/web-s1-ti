import React, { useRef, useEffect, useState } from 'react';
import { MessageBubble } from '../components/MessageBubble';
import { InputArea } from "../components/InputArea";
import type { Message } from '../types/chat.schema';
import { getWelcomeMessage } from '../utils/chat.api';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onClearError: () => void;
  isModal?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearError,
  isModal = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<Message | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChatbot = async () => {
      if (messages.length === 0 && !isInitialized) {
        try {
          const data = await getWelcomeMessage();
          const welcomeMsg: Message = {
            id: 'welcome-' + Date.now(),
            text: data.data.message,
            sender: 'ai',
            timestamp: new Date(),
            source: 'system',
            isWelcome: true
          };
          setWelcomeMessage(welcomeMsg);
        } catch (error) {
          console.error('Failed to load welcome message:', error);
          // Fallback welcome message
          const fallbackMsg: Message = {
            id: 'welcome-fallback',
            text: 'Halo! 👋 Saya Chris, Asisten Virtual dari Program Studi Teknologi Informasi UKSW. Ada yang bisa saya bantu?',
            sender: 'ai',
            timestamp: new Date(),
            source: 'system',
            isWelcome: true
          };
          setWelcomeMessage(fallbackMsg);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeChatbot();
  }, [messages.length, isInitialized]);


  const displayMessages = welcomeMessage ? [welcomeMessage, ...messages] : messages;

  return (
    <div className={`flex flex-col ${isModal ? 'h-full rounded-lg' : 'h-screen'} bg-gradient-to-br from-slate-50 to-blue-50`}>

        {/* Area pesan */}
        <div className="flex-1 overflow-y-auto p-2 bg-white no-scrollbar">
          {displayMessages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 mt-10">
              <div className="animate-pulse">Memuat percakapan...</div>
            </div>
          )}

          {displayMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isWelcome={message.isWelcome}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                  onClick={onClearError}
                  className="absolute top-0 right-0 mt-1 mr-2 text-red-800 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <InputArea
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          placeholder="Tanyakan tentang pengumuman, prodi, dosen, atau informasi kampus lainnya..."
        />
    </div>

  );
};
import React, { useRef, useEffect, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import type { Message } from '../types/chat.schema';
import { getWelcomeMessage } from '../utils/chat.api';
import { streamChat } from '../utils/chat.api';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  isModal?: boolean;
  sessionId: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  error,
  onClearError,
  isModal = false,
  sessionId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<Message | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);  // kita simpan incremental
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    const initializeChatbot = async () => {
      if (localMessages.length === 0 && !isInitialized) {
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
          const fallbackMsg: Message = {
            id: 'welcome-fallback',
            text: 'Halo! 👋 Saya Mr. Wacana, Asisten Virtual dari Program Studi Teknologi Informasi UKSW. Ada yang bisa saya bantu?',
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
  }, [localMessages.length, isInitialized]);

  // Gabung welcome + lokal
  const displayMessages = welcomeMessage
    ? [welcomeMessage, ...localMessages]
    : localMessages;

  const handleSendMessage = (msg: string) => {
    // Tambah ke UI sebagai pesan user
    const userMsg: Message = {
      id: 'user-' + Date.now(),
      text: msg,
      sender: 'user',
      timestamp: new Date(),
    };
    setLocalMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // streaming
    let accum = '';
    let isFirstChunk = true;
    streamChat(
      msg,
      sessionId,
      (chunk) => {
        // chunk pertama: matikan loading
        if (isFirstChunk) {
          setLoading(false);
          isFirstChunk = false;
        }
        // setiap chunk diterima, tambahkan ke message AI terakhir atau buat baru
        accum += chunk;
        const aiMsg: Message = {
          id: 'ai-' + Date.now(), // atau bisa reuse id
          text: accum,
          sender: 'ai',
          timestamp: new Date(),
          source: 'rag',
        };
        // hapus pesan AI lama jika ada (teks sebelumnya) lalu masukkan baru
        setLocalMessages((prev) => {
          // kalau pesan terakhir dari AI: replace
          const last = prev[prev.length - 1];
          if (last && last.sender === 'ai') {
            const rest = prev.slice(0, prev.length - 1);
            return [...rest, aiMsg];
          } else {
            return [...prev, aiMsg];
          }
        });
      },
      () => {
        // selesai streaming
        setLoading(false);
      },
      (err) => {
        // error SSE
        console.error('Stream error', err);
        setLoading(false);
        onClearError();
      }
    );
  };

  return (
    <div className={`flex flex-col ${isModal ? 'h-full rounded-lg' : 'h-screen'} bg-gradient-to-br from-slate-50 to-blue-50`}>
      <div className="flex-1 overflow-y-auto p-2 bg-white no-scrollbar">
        {displayMessages.length === 0 && !loading && (
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
        {loading && (
          <div className="flex justify-start mb-4 mt-2">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs">
              <div className="flex items-center space-x-1 text-gray-500">
                <span className='animate-bounce bg-blue-500 rounded-full w-2 h-2' style={{ animationDelay: '0.2s' }}></span>
                <span className='animate-bounce bg-blue-500 rounded-full w-2 h-2' style={{ animationDelay: '0.3s' }}></span>
                <span className='animate-bounce bg-blue-500 rounded-full w-2 h-2' style={{ animationDelay: '0.4s' }}></span>
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
      <InputArea onSendMessage={handleSendMessage} isLoading={loading} placeholder="Tanyakan tentang pengumuman, prodi, dosen, atau informasi kampus lainnya..." />
    </div>
  );
};

import { useState, useCallback } from 'react';
import { sendChatMessage } from '../utils/chat.api';
import type { Message, ChatState } from '../types/chat.schema';

export const useOpenRouter = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (message: string) => {
    // Skip jika message kosong
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      messages: [...prev.messages, userMessage],
    }));

    try {
      const response = await sendChatMessage(message);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        source: response.source
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, aiMessage],
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Gagal mengirim pesan. Silakan coba lagi.",
      }));
    }
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearChat,
    clearError,
  };
};
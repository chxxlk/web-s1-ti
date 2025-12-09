import React from 'react';
import { ChatInterface } from '../components/ChatInterface';
import type { Message } from '../types/chat.schema';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (message: string) => void;
    onClearChat: () => void;
    onClearError: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
    isOpen,
    onClose,
    messages,
    isLoading,
    error,
    onSendMessage,
    onClearChat,
    onClearError,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-end sm:justify-right">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-lg bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col transform transition-all duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-b from-blue-500 to-white text-white rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-lg">🤖</span>
                        </div>
                        <div className='text-black text-left'>
                            <h3 className="font-semibold">Chris Assistant</h3>
                            <p className="text-xs">Online • Siap membantu</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/50 hover:bg-red-500/80 transition-colors flex items-center justify-center"
                    >
                        <span>❌</span>
                    </button>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                    <ChatInterface
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                        onSendMessage={onSendMessage}
                        onClearChat={onClearChat}
                        onClearError={onClearError}
                        isModal={true}
                    />
                </div>
            </div>
        </div>
    );
};
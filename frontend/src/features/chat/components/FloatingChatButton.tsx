import React, { useState } from 'react';

interface FloatingChatButtonProps {
  onOpen: () => void;
  isOpen?: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ 
  onOpen, 
  isOpen = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110 ${
        isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        zIndex: 1000
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-2xl text-white">🤖</span>
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
          Chat dengan Fernando 🤖
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-900 border-l-transparent border-r-transparent"></div>
        </div>
      )}
    </button>
  );
};
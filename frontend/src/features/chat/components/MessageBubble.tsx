/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { Message } from '../types/chat.schema';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
  isWelcome?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> =
  ({ message, isWelcome = false }) => {
    const isUser = message.sender === 'user';

    const markdownComponents = {
      strong: ({ node, ...props }: any) => (
        <strong className="font-bold text-blue-700" {...props} />
      ),
      li: ({ node, ...props }: any) => (
        <li className="list-disc ml-6 text-gray-800" {...props} />
      ),
      p: ({ node, ...props }: any) => (
        <p className="mb-2 leading-relaxed" {...props} />
      ),
      h1: ({ node, ...props }: any) => (
        <h1 className="text-2xl font-bold my-4" {...props} />
      ),
      h2: ({ node, ...props }: any) => (
        <h2 className="text-xl font-semibold my-3" {...props} />
      ),
      a: ({ node, href, ...props }: any) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          {...props}
        />
      ),
    };

    return (
      <div
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
      >
        <div
          className={`my-2 max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-lg ${isWelcome
            ? 'border-blue-200/50 shadow-lg rounded-3xl'
            : isUser
              ? 'text-black shadow-lg rounded-3xl bg-gray-200'
              : 'bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-lg rounded-3xl'
            }`}
        >
          <div className="markdown prose prose-sm text-left">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.text}
            </ReactMarkdown>
          </div>
          {/* <p className="markdown prose prose-sm whitespace-pre-wrap leading-relaxed text-gray-800 text-left">
            {message.text}
        </p> */}
          {/* <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/20">
          <span className={`text-xs ${isUser ? 'text-gray-400' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {!isUser && message.source && message.source !== 'system' && (
            <span className="text-xs text-gray-400">
              {message.source === 'database' ? '📊 Database' : '🤖 AI'}
            </span>
          )}
        </div> */}
          <div className='flex justify-between items-center mt-3 pt-2 border-t border-white/20'>
            <span className='text-xs text-gray-500'>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className='text-xs text-gray-400 min-w-[60px] text-right'>
              {!isUser && message.source && message.source !== 'system' && (
                <span className="text-xs text-gray-400">
                  {message.source === 'database' ? '📊 Database' : '🤖 AI'}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

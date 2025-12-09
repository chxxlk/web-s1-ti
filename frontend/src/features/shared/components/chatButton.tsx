import { ChatModal } from "@/features/chat/components/ChatModal";
import { FloatingChatButton } from "@/features/chat/components/FloatingChatButton";
import { useOpenRouter } from "@/features/chat/hooks/useOpenRouter";
import { useState } from "react";



export function chatButton() {
    const { messages, isLoading, error, sendMessage, clearChat, clearError } = useOpenRouter();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const handleOpenChat = () => {
        setIsChatOpen(true);
    };
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };
    return (
        <>
            <div>
                < FloatingChatButton onOpen={handleOpenChat} isOpen={isChatOpen} />

                {/* Chat Modal */}
                < ChatModal
                    isOpen={isChatOpen}
                    onClose={handleCloseChat}
                    messages={messages}
                    isLoading={isLoading}
                    error={error}
                    onSendMessage={sendMessage}
                    onClearChat={clearChat}
                    onClearError={clearError}
                />
            </div>
        </>
    );
}
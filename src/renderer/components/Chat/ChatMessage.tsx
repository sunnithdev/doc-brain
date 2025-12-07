import React, { ReactNode } from 'react';

interface ChatMessageProps {
    message: string;
    isSender?: boolean;
    senderName?: string;
    avatar?: ReactNode | string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isSender = false, senderName, avatar }) => {
    const chatClass = isSender ? 'chat-end' : 'chat-start';
    const defaultAvatarInitials = isSender ? 'Me' : 'Ai';
    const defaultAvatarColor = isSender ? 'bg-neutral text-neutral-content' : 'bg-primary text-primary-content';

    return (
        <div className={`chat ${chatClass}`}>
            <div className="chat-image avatar">
                <div className={`w-10 rounded-full flex items-center justify-center ${typeof avatar === 'string' ? '' : defaultAvatarColor}`}>
                    {typeof avatar === 'string' ? (
                        <img src={avatar} alt={`${senderName || 'User'} avatar`} />
                    ) : (
                        avatar || <span>{defaultAvatarInitials}</span>
                    )}
                </div>
            </div>
            {senderName && (
                <div className="chat-header opacity-50 mb-1">
                    {senderName}
                </div>
            )}
            <div className="chat-bubble">
                {message}
            </div>
        </div>
    );
};

export default ChatMessage;

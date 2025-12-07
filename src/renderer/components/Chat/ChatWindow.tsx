import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useDocStore } from '../../store/docStore';
import { useChatStore, Message } from '../../store/chatStore';

const ChatWindow: React.FC = () => {
    const { files } = useDocStore();
    const { chats, activeChatId, addMessage } = useChatStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = chats.find(c => c.id === activeChatId);
    const messages = activeChat?.messages || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            isSender: true,
            senderName: "You"
        };
        addMessage(userMsg);

        try {
            const activeFile = files.find(f => f.status === 'parsed');

            const aiResponse = await window.electronAPI.askDocBrain(text);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                isSender: false,
                senderName: "DocBrain"
            };
            addMessage(aiMsg);

        } catch (error) {
            console.error("Error asking DocBrain:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I encountered an error trying to think. Please check your API Key and try again.",
                isSender: false,
                senderName: "DocBrain"
            };
            addMessage(errorMsg);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative bg-base-100">

            <div className="flex-1 overflow-y-auto w-full">

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🧠</span>
                            </div>
                            <h1 className="text-2xl font-semibold">DocBrain</h1>
                            {files.length > 0 && <p className="text-sm opacity-50 mt-2">I have access to {files.length} document(s).</p>}
                        </div>

                        <div className="w-full max-w-2xl">
                            <ChatInput onSend={handleSend} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col min-h-full">
                        <div className="flex-1 p-4 space-y-6 max-w-3xl mx-auto w-full pb-32">
                            {messages.map(msg => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg.text}
                                    isSender={msg.isSender}
                                    senderName={msg.senderName}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="w-full p-4 bg-base-100 pb-8 sticky bottom-0 z-10">
                            <div className="max-w-3xl mx-auto">
                                <ChatInput onSend={handleSend} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;


import React from 'react';

interface ChatInputProps {
    onSend?: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
    const [input, setInput] = React.useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (input.trim() && onSend) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center w-full p-2 bg-base-200/50 border border-base-300 rounded-3xl focus-within:ring-2 focus-within:ring-base-300 focus-within:border-transparent transition-all shadow-sm">

                <input
                    className="flex-1 bg-transparent border-none focus:ring-0 text-base px-2 placeholder:text-base-content/40 outline-none min-h-[44px]"
                    placeholder="Message DocBrain..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleSend}
                        className="btn btn-circle btn-sm btn-primary text-white shadow-sm ml-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform rotate-90">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;

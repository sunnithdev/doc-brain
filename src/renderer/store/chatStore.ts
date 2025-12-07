import { create } from 'zustand';

export interface Message {
    id: string;
    text: string;
    isSender: boolean;
    senderName: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

interface ChatState {
    chats: Chat[];
    activeChatId: string | null;
    createNewChat: () => void;
    switchChat: (id: string) => void;
    addMessage: (message: Message) => void;
    deleteChat: (id: string) => void;
}

const generateChatTitle = (messages: Message[]): string => {
    if (messages.length === 0) return "New Chat";
    const firstUserMessage = messages.find(m => m.isSender);
    if (!firstUserMessage) return "New Chat";
    return firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? "..." : "");
};

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [{
        id: Date.now().toString(),
        title: "New Chat",
        messages: [],
        timestamp: Date.now()
    }],
    activeChatId: Date.now().toString(),

    createNewChat: () => {
        const currentChat = get().chats.find(c => c.id === get().activeChatId);

        if (currentChat && currentChat.messages.length > 0 && currentChat.title === "New Chat") {
            set(state => ({
                chats: state.chats.map(c =>
                    c.id === state.activeChatId
                        ? { ...c, title: generateChatTitle(c.messages) }
                        : c
                )
            }));
        }

        const newChat: Chat = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: [],
            timestamp: Date.now()
        };

        set(state => ({
            chats: [newChat, ...state.chats],
            activeChatId: newChat.id
        }));
    },

    switchChat: (id: string) => {
        set({ activeChatId: id });
    },

    addMessage: (message: Message) => {
        set(state => ({
            chats: state.chats.map(chat =>
                chat.id === state.activeChatId
                    ? { ...chat, messages: [...chat.messages, message], timestamp: Date.now() }
                    : chat
            )
        }));
    },

    deleteChat: (id: string) => {
        set(state => {
            const newChats = state.chats.filter(c => c.id !== id);
            const newActiveChatId = state.activeChatId === id
                ? (newChats[0]?.id || null)
                : state.activeChatId;

            return {
                chats: newChats.length > 0 ? newChats : [{
                    id: Date.now().toString(),
                    title: "New Chat",
                    messages: [],
                    timestamp: Date.now()
                }],
                activeChatId: newActiveChatId || Date.now().toString()
            };
        });
    }
}));

import React from 'react';
import { useChatStore } from '../store/chatStore';

const Sidebar: React.FC = () => {
    const { chats, activeChatId, createNewChat, switchChat, deleteChat } = useChatStore();

    return (
        <div className="drawer-side z-20">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu p-3 pt-12 w-64 min-h-full bg-base-100 text-base-content border-r border-base-200 flex flex-col">
                <li className="mb-2">
                    <button
                        onClick={createNewChat}
                        className="btn btn-outline btn-sm btn-block justify-start gap-2 normal-case font-normal text-sm border-base-300 hover:bg-base-200 hover:border-base-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New chat
                    </button>
                </li>

                <li className="menu-title text-xs font-semibold opacity-50 px-2 mt-4 mb-1">
                    <span>Recent</span>
                </li>

                {chats.map((chat) => (
                    <li key={chat.id} className="group">
                        <div className="flex items-center gap-2 p-0">
                            <a
                                onClick={() => switchChat(chat.id)}
                                className={`flex-1 text-sm py-2 px-2 hover:bg-base-200 rounded-lg truncate block cursor-pointer ${activeChatId === chat.id ? 'bg-base-200 font-medium' : ''
                                    }`}
                            >
                                {chat.title}
                            </a>
                            {chats.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteChat(chat.id);
                                    }}
                                    className="btn btn-ghost btn-xs opacity-0 hover:opacity-100 group-hover:opacity-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </li>
                ))}

                <div className="mt-auto pt-2 border-t border-base-200">
                    <li>
                        <a className="flex items-center gap-3 py-3 px-2 hover:bg-base-200 rounded-lg">
                            <div className="avatar placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                    <span className="text-xs">U</span>
                                </div>
                            </div>
                        </a>
                    </li>
                </div>
            </ul>
        </div>
    );
};

export default Sidebar;

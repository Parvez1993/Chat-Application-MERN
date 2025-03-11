// src/components/ChatSidebar.jsx
import React from 'react';

function ChatSidebar({ username, conversations, onConversationChange }) {
    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
            {/* User profile area */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        {username.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-medium">{username}</h3>
                        <p className="text-xs text-gray-400">Online</p>
                    </div>
                </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-3 text-xs uppercase text-gray-400 font-semibold">Conversations</div>
                <ul>
                    {conversations.map(conversation => (
                        <li
                            key={conversation.id}
                            className={`px-4 py-3 flex items-center justify-between cursor-pointer transition ${
                                conversation.active ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                            onClick={() => onConversationChange(conversation.id)}
                        >
                            <span>{conversation.name}</span>
                            {conversation.unread > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {conversation.unread}
                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Settings/logout */}
            <div className="p-4 border-t border-gray-700">
                <button className="w-full py-2 text-gray-400 hover:text-white transition text-left">
                    Settings
                </button>
            </div>
        </div>
    );
}

export default ChatSidebar;
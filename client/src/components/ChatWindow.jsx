import React, { useState, useRef, useEffect } from 'react';
import MessageItem from './MessageItem';


function ChatWindow({ activeConversation, messages, onSendMessage, onSendLocation }) {
    const [inputMessage, setInputMessage] = useState('');
    const [sendingLocation, setSendingLocation] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage('');
        }
    };

    const handleSendLocation = () => {
        setSendingLocation(true);
        onSendLocation();
        setTimeout(() => setSendingLocation(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-lg">{activeConversation.name}</h2>
                    <p className="text-xs text-gray-500">3 members</p>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No messages yet. Send one to start the conversation!
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <MessageItem key={index} message={message} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Send
                    </button>
                    <button
                        type="button"
                        onClick={handleSendLocation}
                        disabled={sendingLocation}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {sendingLocation ? 'Sending...' : 'Location'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;
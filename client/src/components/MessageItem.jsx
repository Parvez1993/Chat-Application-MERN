import React from 'react';
import moment from 'moment';

function MessageItem({ message }) {
    return (
        <div className="mb-4 p-3 bg-white rounded-lg shadow">
            {message.type === 'text' ? (
                <div>{message.text}</div>
            ) : (
                <a
                    href={message.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                >
                    <span className="mr-2">📍</span> View my location
                </a>
            )}
            <span className="text-xs text-gray-500 block mt-1">
        {message.created ? moment(message.created).format('h:mm A') : moment().format('h:mm A')}
      </span>
        </div>
    );
}

export default MessageItem;
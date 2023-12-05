import React, { useState, useEffect } from "react";
import '../Chat.css';
import io from 'socket.io-client';

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const socket = io('http://localhost:8800');

    useEffect(() => {
        socket.on('chat message', (msg) => {
            setChatHistory(prevHistory => [...prevHistory, { text: msg.text, sender: msg.sender }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() === "") {
            return;
        }

        socket.emit('chat message', { text: message, sender: 'user' });

        setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
        setMessage("");
    };

    return (
        <div className={`chat-container ${isOpen ? "open" : "closed"}`}>
            <div className="chat-header">
                <div className="chat-title">Chat with Bot</div>
                <button className="chat-toggle-button" onClick={toggleChat}>
                    {isOpen ? "Close Chat" : "Open Chat"}
                </button>
            </div>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-messages">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={handleMessageChange}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;

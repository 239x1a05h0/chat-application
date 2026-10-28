import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat({ user, setUser }) {
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const token = localStorage.getItem('token');

    // Load all users
    const loadUsers = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/users/${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return;
            }
            setUsers(data);
        } catch (error) {
            alert('Could not load users');
        }
    };

    // Connect to Socket.IO
    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            auth: {
                token: token
            }
        });
        setSocket(newSocket);
        loadUsers();
        return () => {
            newSocket.disconnect();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Receive messages in real time
    useEffect(() => {
        if (!socket) return;
        const receiveMessage = (message) => {
            if (
                conversation &&
                String(message.conversationId) ===
                String(conversation._id)
            ) {
                setMessages((oldMessages) => [
                    ...oldMessages,
                    message
                ]);
            }
        };
        socket.on('receiveMessage', receiveMessage);
        return () => {
            socket.off('receiveMessage', receiveMessage);
        };
    }, [socket, conversation]);
    // Select user and create/find conversation
    const selectUser = async (selected) => {
        setSelectedUser(selected);
        setMessages([]);
        setConversation(null);

        try {
            const conversationResponse = await fetch(
                'http://localhost:5000/api/conversations',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        senderId: user.id,
                        receiverId: selected._id
                    })
                }
            );
            const conversationData = await conversationResponse.json();
            if (!conversationResponse.ok) {
                alert(conversationData.message);
                return;
            }
            setConversation(conversationData);
            // Load previous messages
            const messagesResponse = await fetch(
                `http://localhost:5000/api/messages/${conversationData._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const messagesData =await messagesResponse.json();
            if (!messagesResponse.ok) {
                alert(messagesData.message);
                return;
            }
            setMessages(messagesData);
        } catch (error) {
            alert('Could not load conversation');
        }
    };
    // Send message
    const sendMessage = () => {
        if (!socket || !conversation || !selectedUser) {
            return;
        }
        if (text.trim() === '') {
            return;
        }
        socket.emit('sendMessage', {
            conversationId: conversation._id,
            receiver: selectedUser._id,
            text: text.trim()
        });
        setText('');
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <div className="app">

            {/* Header */}
            <div className="header">
                <h1>WhatsApp</h1>

                <div>
                    <span>{user.name}</span>

                    <button
                        className="logout"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="chat-container">

                {/* Users */}
                <div className="users">
                    <h2>Chats</h2>

                    {users.length === 0 ? (
                        <p>No other users</p>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u._id}
                                className={
                                    selectedUser?._id === u._id
                                        ? 'user selected'
                                        : 'user'
                                }
                                onClick={() => selectUser(u)}
                            >
                                <div className="avatar">
                                    {u.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <b>{u.name}</b>
                                    <small>{u.email}</small>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat */}
                <div className="chat">

                    {!selectedUser ? (
                        <div className="welcome">
                            <h2>Welcome to WhatsApp</h2>
                            <p>
                                Select a user to start chatting
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Chat header */}
                            <div className="chat-header">
                                <div className="avatar">
                                    {selectedUser.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <h2>{selectedUser.name}</h2>
                            </div>

                            {/* Messages */}
                            <div className="messages">
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={
                                            String(message.sender) ===
                                            String(user.id)
                                                ? 'message sent'
                                                : 'message received'
                                        }
                                    >
                                        {message.text}
                                    </div>
                                ))}
                            </div>

                            {/* Message input */}
                            <div className="message-box">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) =>
                                        setText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                />

                                <button onClick={sendMessage}>
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;


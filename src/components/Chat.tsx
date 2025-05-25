import { BASE_URL } from '@/api';
import { useState, useEffect } from 'react';

type ChatProps = {
    user: { id: string; token: string };
    socket: any;
    setUser: (user: any) => void;
};

export default function Chat({ user, socket, setUser }: ChatProps) {
    const [friends, setFriends] = useState<any>([]);
    const [friendUsername, setFriendUsername] = useState('');
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [messages, setMessages] = useState<any>([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        socket.emit('join', user.id);
        fetchFriends();
        socket.on('receiveMessage', (msg: { sender: any; receiver: any; }) => {
            if (msg.sender == selectedFriend?._id || msg.receiver == selectedFriend?._id) {
                setMessages((prev: any) => [...prev, msg]);
            }
        });
        return () => socket.off('receiveMessage');
    }, [selectedFriend]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/friends`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setFriends(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const addFriend = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/friends`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ friendUsername }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setFriends([...friends, data.friend]);
            setFriendUsername('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchMessages = async (friendId: any) => {
        try {
            const res = await fetch(`${BASE_URL}/api/messages/${friendId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setMessages(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const sendMessage = () => {
        if (!message || !selectedFriend) return;
        console.log('Sending message:', selectedFriend);
        socket.emit('sendMessage', {
            sender: user.id,
            receiver: selectedFriend._id,
            content: message,
        });
        setMessage('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl flex h-[80vh]">
            <div className="w-1/3 border-r p-4">
                <h2 className="text-xl font-bold mb-4">Friends</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Add friend by username"
                        value={friendUsername}
                        onChange={(e) => setFriendUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={addFriend}
                        className="w-full bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
                    >
                        Add Friend
                    </button>
                </div>
                {friends.map((friend: any) => (
                    <div
                        key={friend._id}
                        onClick={() => {
                            setSelectedFriend(friend);
                            fetchMessages(friend._id);
                        }}
                        className={`p-2 cursor-pointer rounded ${selectedFriend?._id === friend._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    >
                        {friend.username}
                    </div>
                ))}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <div className="w-2/3 p-4 flex flex-col">
                {selectedFriend ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Chat with {selectedFriend.username}</h2>
                        <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded">
                            {messages.map((msg: any, index: any) => (
                                <div
                                    key={index}
                                    className={`mb-2 ${msg.sender == user.id ? 'text-right' : 'text-left'}`}
                                >
                                    <span
                                        className={`inline-block p-2 rounded ${msg.sender == user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {msg.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 p-2 border rounded-l"
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Select a friend to start chatting</p>
                )}
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        setUser(null);
                    }}
                    className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
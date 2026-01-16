'use client';

import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "@/api";
import CallModal from "./modal/CallModal";
import { FaPhone, FaVideo } from "react-icons/fa";
import { Socket } from "socket.io-client";

type ChatProps = {
    user: { id: string; token: string; username: string };
    socket: Socket;
    setUser: (user: any) => void;
};

const Chat: React.FC<ChatProps> = ({ user, socket, setUser }) => {
    const [friends, setFriends] = useState<any[]>([]);
    const [friendUsername, setFriendUsername] = useState<string>("");
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
    const [peerConnection, setPeerConnection] = useState<any>(null);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [callingUser, setCallingUser] = useState<any>(null);
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const beepRef = useRef<HTMLAudioElement | null>(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    useEffect(() => {
        beepRef.current = new Audio("/sounds/message.mp3");
    }, []);

    useEffect(() => {
        ringtoneRef.current = new Audio('/sounds/ringtone.mp3');
        ringtoneRef.current.loop = true;
    }, []);

    useEffect(() => {
        if (incomingCall && ringtoneRef.current) {
            ringtoneRef.current.play().catch(console.error);
        } else {
            ringtoneRef.current?.pause();
            if (ringtoneRef.current) ringtoneRef.current.currentTime = 0;
        }
    }, [incomingCall]);

    useEffect(() => {
        socket.on("incomingCall", ({ from, signal, type }) => {
            setIncomingCall({ from, signal, type }); // ✅ expects signal here
        });


        socket.on("callAnswered", (signal) => {
            if (peerConnection) peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
        });

        socket.on("callEnded", () => endCall());

        socket.on("receiveMessage", (msg) => {
            if (!selectedFriend) return;

            const isForThisChat =
                (msg.sender === selectedFriend._id && msg.receiver === user.id) ||
                (msg.sender === user.id && msg.receiver === selectedFriend._id);

            if (isForThisChat) {
                setMessages(prev => [...prev, msg]);
            }
        });


        socket.on("onlineUsers", (users: string[]) => {
            setOnlineUsers(users);
        });

        socket.on("typing", ({ from }) => {
            setTypingUser(from);
        });

        socket.on("stopTyping", () => {
            setTypingUser(null);
        });

        return () => {
            socket.off("incomingCall");
            socket.off("callAnswered");
            socket.off("callEnded");
            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [socket, peerConnection]);

    const startCall = async (type: "audio" | "video") => {
        if (!selectedFriend) return alert("Select a friend first!");
        setIsVideoCall(type === "video");
        setCallingUser(selectedFriend);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });

            const pc = new RTCPeerConnection(servers);
            setPeerConnection(pc);

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            setLocalStream(stream);

            const remote = new MediaStream();
            setRemoteStream(remote);

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => remote.addTrack(track));
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            socket.emit("callUser", {
                from: user.id,
                to: selectedFriend._id,
                signal: offer, // offer includes { type: "offer", sdp: "..." }
                type,          // "video" or "audio"
            });

        } catch (err) {
            console.error("Call error:", err);
        }
    };

    const answerCall = async () => {
        if (!incomingCall) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: incomingCall.type === "video",
                audio: true,
            });

            const pc = new RTCPeerConnection(servers);
            setPeerConnection(pc);

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
            setLocalStream(stream);

            const remote = new MediaStream();
            setRemoteStream(remote);

            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => remote.addTrack(track));
            };

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit("answerCall", {
                to: incomingCall.from,
                signal: answer,
            });

            setIncomingCall(null);
            setCallAccepted(true);
        } catch (error) {
            console.error("Answer call error:", error);
        }
    };

    const endCall = () => {
        if (peerConnection) peerConnection.close();
        if (localStream) localStream.getTracks().forEach((track: any) => track.stop());
        if (selectedFriend) {
            socket.emit("endCall", { to: selectedFriend._id });
        }
        setCallAccepted(false);
        setIncomingCall(null);
        setLocalStream(null);
        setRemoteStream(null);
        setCallingUser(null);
        setPeerConnection(null);
    };

    const addFriend = async () => {
        if (!friendUsername.trim()) return alert("Enter a username");
        try {
            const res = await fetch(`${BASE_URL}/api/friends`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ friendUsername }),
            });
            const data = await res.json();
            if (data.error) {
                alert(data.error);
            } else {
                setFriends(prev => [...prev, data.friend]);
                setFriendUsername("");
            }
        } catch (error) {
            console.error("Add friend error:", error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/friends`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setFriends(data);
        } catch (error) {
            console.error("Fetch friends error:", error);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/messages/${selectedFriend?._id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error("Fetch friends error:", error);
        }
    };
    useEffect(() => {
        console.log(selectedFriend)
        if (selectedFriend) {
            fetchMessages();
        }
    }, [selectedFriend]);

    useEffect(() => {
        fetchFriends();
    }, []);

    const sendMessage = async () => {
        // Don’t send if no message or media selected
        if ((!message.trim() && !selectedMedia) || !selectedFriend) return;

        // Create message base object
        const msg: any = {
            sender: user.id,
            receiver: selectedFriend._id,
            content: message.trim(),
            type: selectedMedia ? "media" : "text",
            timestamp: new Date().toISOString(),
        };

        try {
            // If a media file is selected — upload to backend first
            if (selectedMedia) {
                const formData = new FormData();
                formData.append("file", selectedMedia);
                formData.append("sender", user.id);
                formData.append("receiver", selectedFriend._id);

                const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${user.token}` },
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok || !uploadData.url) {
                    console.error("Upload failed:", uploadData);
                    alert("Failed to upload file");
                    return;
                }

                // Add file URL to message
                msg.mediaUrl = uploadData.url;
                msg.fileName = selectedMedia.name;
                msg.fileType = selectedMedia.type;
            }

            // Emit to socket server
            socket.emit("sendMessage", msg);

            // Optimistically update UI
            // setMessages((prev) => [...prev, msg]);

            // Reset fields
            setMessage("");
            setSelectedMedia(null);
            socket.emit("stopTyping", { to: selectedFriend._id, from: user.username });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Something went wrong while sending your message");
        }
    };

    const handleTyping = (val: string) => {
        setMessage(val);
        if (selectedFriend) {
            socket.emit("typing", { to: selectedFriend._id, from: user.username });
            if (!val) {
                socket.emit("stopTyping", { to: selectedFriend._id, from: user.username });
            }
        }
    };


    useEffect(() => {
        const handleReceiveMessage = (msg: any) => {
            if (!selectedFriend) return;

            const isForThisChat =
                (msg.sender === selectedFriend._id && msg.receiver === user.id) ||
                (msg.sender === user.id && msg.receiver === selectedFriend._id);

            if (isForThisChat) {
                setMessages(prev => [...prev, msg]);

                if (beepRef.current) {
                    beepRef.current.currentTime = 0;
                    beepRef.current.play().catch(() => { });
                }
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage); // ✔ OK now, returns void
        };
    }, [socket, selectedFriend]);

    return (
        <div className="flex flex-col h-screen w-full rounded-lg bg-[#f7f8f3] shadow-lg ">
            {/* Top bar */}
            <div className="bg-[#8aa234] text-white  flex justify-between px-6 py-3 items-center">
                <div className="font-bold text-lg">LocalConnect</div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        Connected
                    </span>
                    <div className="bg-[#a5b863] text-sm px-3 py-1 rounded-full">{user.username}</div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            socket.disconnect();
                            setUser(null);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-white border-r flex flex-col">
                    <div className="p-3">
                        <h2 className="text-xl font-bold mb-3">Contacts</h2>
                        <input
                            type="text"
                            placeholder="Add friend..."
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button
                            onClick={addFriend}
                            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        >
                            Add Friend
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-xs font-semibold px-3 py-1 text-gray-500">ONLINE</h4>
                        {friends && friends.filter(f => onlineUsers.includes(f._id)).map(friend => (
                            <div
                                key={friend._id}
                                onClick={() => setSelectedFriend(friend)}
                                className={`cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${selectedFriend?._id === friend._id ? 'bg-green-100' : ''}`}
                            >
                                <div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full font-semibold">
                                    {friend.username[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{friend.username}</p>
                                    <p className="text-xs text-green-500">Available</p>
                                </div>
                            </div>
                        ))}
                        <h4 className="text-xs font-semibold px-3 py-1 mt-2 text-gray-500">OFFLINE</h4>
                        {friends.filter(f => !onlineUsers.includes(f._id)).map(friend => (
                            <div
                                key={friend._id}
                                onClick={() => setSelectedFriend(friend)}
                                className={`cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-gray-100 ${selectedFriend?._id === friend._id ? 'bg-green-100' : ''}`}
                            >
                                <div className="w-8 h-8 bg-gray-300 text-gray-700 flex items-center justify-center rounded-full font-semibold">
                                    {friend.username[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{friend.username}</p>
                                    <p className="text-xs text-gray-400">Offline</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat window */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedFriend ? (
                        <>
                            <div className="border-b px-4 py-2 flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold">{selectedFriend.username}</h2>
                                    <p className="text-xs text-gray-500">Last seen recently</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startCall("audio")}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"
                                    >
                                        <FaPhone /> Voice
                                    </button>
                                    <button
                                        onClick={() => startCall("video")}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
                                    >
                                        <FaVideo /> Video
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`my-1 ${msg.sender === user.id ? 'text-right' : 'text-left'
                                            }`}
                                    >
                                        <div
                                            className={`inline-block overflow-hidden line-clamp-2 text-wrap px-3 py-2 rounded-lg max-w-[70%] ${msg.sender === user.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {msg.type === 'media' && msg.mediaUrl ? (
                                                msg.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                    <img
                                                        src={msg.mediaUrl}
                                                        alt="media"
                                                        className="rounded-lg mb-1 max-h-40"
                                                    />
                                                ) : msg.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={msg.mediaUrl}
                                                        controls
                                                        className="rounded-lg mb-1 max-h-40"
                                                    />
                                                ) : (
                                                    <a
                                                        href={msg.mediaUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="underline"
                                                    >
                                                        📎 Download File
                                                    </a>
                                                )
                                            ) : (
                                                // Process text to convert URLs into clickable links
                                                msg.content.split(/(https?:\/\/[^\s]+)/g).map((part, idx) =>
                                                    part.match(/https?:\/\/[^\s]+/) ? (
                                                        <a
                                                            key={idx}
                                                            href={part}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="underline text-blue-500"
                                                        >
                                                            {part}
                                                        </a>
                                                    ) : (
                                                        <span key={idx}>{part}</span>
                                                    )
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {typingUser && (
                                    <p className="text-xs italic text-gray-400">{typingUser} is typing...</p>
                                )}
                                <div ref={messagesEndRef}></div>
                            </div>
                            {/* Message Input + Media Upload */}
                            <div className="border-t p-3 flex flex-col gap-2">
                                {/* Media preview (WhatsApp-style) */}
                                {selectedMedia && (
                                    <div className="flex items-center gap-3 bg-gray-100 p-2 rounded">
                                        {selectedMedia.type.startsWith("image/") ? (
                                            <img
                                                src={URL.createObjectURL(selectedMedia)}
                                                alt="preview"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : selectedMedia.type.startsWith("video/") ? (
                                            <video
                                                src={URL.createObjectURL(selectedMedia)}
                                                className="w-20 h-16 rounded"
                                                controls
                                            />
                                        ) : (
                                            <div className="text-sm bg-gray-200 px-3 py-1 rounded">
                                                📄 {selectedMedia.name}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setSelectedMedia(null)}
                                            className="text-red-500 text-sm font-semibold hover:underline"
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                )}

                                {/* Message + send area */}
                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
                                        📎
                                        <input
                                            type="file"
                                            accept="image/*,video/*,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setSelectedMedia(file);
                                            }}
                                        />
                                    </label>

                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => handleTyping(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();   // prevents newline or form submission
                                                sendMessage();
                                            }
                                        }}
                                        placeholder="Type a message..."
                                        className="flex-1 border rounded-l px-3 py-2 text-sm"
                                    />

                                    <button
                                        onClick={sendMessage}
                                        className="bg-[#8aa234] hover:bg-[#7d922e] text-white px-4 py-2 rounded-r"
                                    >
                                        ➤
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a contact to start chatting
                        </div>
                    )}
                </div>
            </div>

            {/* Call modals */}
            {callingUser && !callAccepted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <h2 className="text-lg font-semibold mb-3">Calling {callingUser.username}...</h2>
                        <p className="text-gray-600 mb-4">Waiting for them to answer</p>
                        <button
                            onClick={endCall}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {incomingCall && !callAccepted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg text-center">
                        <h2 className="text-lg font-semibold mb-3">
                            Incoming {incomingCall.type === "video" ? "Video" : "Voice"} Call
                        </h2>
                        <p className="text-gray-600 mb-4">From: {incomingCall.from}</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={answerCall}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={endCall}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CallModal
                isOpen={callAccepted}
                isVideo={isVideoCall}
                localStream={localStream}
                remoteStream={remoteStream}
                onEnd={endCall}
                onClose={endCall}
            />
        </div>
    );
};

export default Chat;

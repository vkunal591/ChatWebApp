'use client'

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
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [localStream, setLocalStream] = useState<any>(null);
    const [remoteStream, setRemoteStream] = useState<any>(null);
    const [peerConnection, setPeerConnection] = useState<any>(null);
    const [isVideoCall, setIsVideoCall] = useState(false);
    const [callingUser, setCallingUser] = useState<any>(null); // friend you're calling
    const ringtoneRef = useRef<HTMLAudioElement | null>(null);

    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

    useEffect(() => {
        ringtoneRef.current = new Audio('/sounds/ringtone.mp3');
        ringtoneRef.current.loop = true;
    }, []);

    useEffect(() => {
        if (incomingCall && ringtoneRef.current) {
            ringtoneRef.current.play().catch(console.error);
        } else {
            ringtoneRef.current?.pause();
            ringtoneRef.current!.currentTime = 0;
        }
    }, [incomingCall]);

    useEffect(() => {
        socket.on("incomingCall", ({ from, signal, type }) => {
            setIncomingCall({ from, signal, type });
        });

        socket.on("callAnswered", (signal) => {
            peerConnection?.setRemoteDescription(new RTCSessionDescription(signal));
        });

        socket.on("callEnded", () => {
            endCall();
        });
    }, [socket, peerConnection]);

    const startCall = async (type: "audio" | "video") => {
        if (!selectedFriend) return alert("Select a friend first!");
        setIsVideoCall(type === "video");
        setCallingUser(selectedFriend); // <-- Show the "Calling..." modal

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

        pc.ontrack = (event) =>
            event.streams[0].getTracks().forEach((t) => remote.addTrack(t));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("callUser", {
            from: user.id,
            to: selectedFriend._id,
            signal: offer,
            type,
        });
    };


    const answerCall = async () => {
        if (!incomingCall) return;

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
        pc.ontrack = (event) => event.streams[0].getTracks().forEach((t) => remote.addTrack(t));

        await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answerCall", { to: incomingCall.from, signal: answer });
        setIncomingCall(null);
        setCallAccepted(true);
    };

    const rejectCall = () => {
        ringtoneRef.current?.pause();
        ringtoneRef.current!.currentTime = 0;
        setIncomingCall(null);
    };

    const endCall = () => {
        peerConnection?.close();
        localStream?.getTracks().forEach((t: any) => t.stop());
        socket.emit("endCall", { to: selectedFriend?._id });
        setCallAccepted(false);
        setIncomingCall(null);
        setLocalStream(null);
        setRemoteStream(null);
    };

    useEffect(() => {
        if (!socket) return;

        // Incoming call
        socket.on("incomingCall", ({ from, offer }) => {
            setIncomingCall({ from, signal: offer }); // You may include type if backend sends it
        });

        // Call answered
        socket.on("callAnswered", ({ answer }) => {
            peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // ICE Candidate received
        socket.on("iceCandidate", ({ candidate }) => {
            if (peerConnection) {
                peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        // Call ended
        socket.on("callEnded", () => {
            endCall();
        });

        return () => {
            socket.off("incomingCall");
            socket.off("callAnswered");
            socket.off("iceCandidate");
            socket.off("callEnded");
        };
    }, [socket, peerConnection]);

    // Scroll to latest
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Socket setup
    useEffect(() => {
        // Ensure socket is properly connected
        socket.connect();

        // Emit a "join" event to notify the server about the user joining
        socket.emit("join", user.id);

        // Set up socket event listeners
        socket.on("onlineUsers", (list: string[]) => setOnlineUsers(list));
        socket.on("receiveMessage", (msg: any) => {
            console.log(msg);
            if (msg.sender === selectedFriend?._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });
        socket.on("typing", ({ from }) => setTypingUser(from));
        socket.on("stopTyping", () => setTypingUser(null));

        // Return a cleanup function that disconnects the socket when component is unmounted or dependencies change
        return () => {
            socket.off("onlineUsers");
            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stopTyping");

            socket.disconnect(); // This cleans up the connection
        };
    }, [selectedFriend, user.id]); // Dependencies should include `selectedFriend` and `user.id`



    // Fetch friends
    const fetchFriends = async () => {
        const res = await fetch(`${BASE_URL}/api/friends`, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setFriends(data);
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    // Send message
    const sendMessage = () => {
        if (!message || !selectedFriend) return;
        socket.emit("sendMessage", {
            sender: user.id,
            receiver: selectedFriend._id,
            content: message,
        });
        setMessages((prev) => [
            ...prev,
            { sender: user.id, receiver: selectedFriend._id, content: message },
        ]);
        console.log(messages)
        setMessage("");
        socket.emit("stopTyping", { to: selectedFriend._id, from: user.username });
    };

    // Typing indicator
    const handleTyping = (val: string) => {
        setMessage(val);
        if (selectedFriend) {
            socket.emit("typing", { to: selectedFriend._id, from: user.username });
            if (!val) socket.emit("stopTyping", { to: selectedFriend._id, from: user.username });
        }
    };

    return (
        <div className="w-full bg-[#f7f8f3] flex flex-col h-[90vh] rounded-lg overflow-hidden shadow-md">
            {/* Top header */}
            <div className="bg-[#8aa234] text-white flex justify-between items-center px-6 py-3">
                <div className="text-lg font-semibold">LocalConnect</div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        Connected
                    </span>
                    <div className="bg-[#a5b863] text-sm px-3 py-1 rounded-full">
                        {user.username}
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            setUser(null);
                            socket.disconnect();
                        }}
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-4 gap-4 bg-[#edf1dc] px-6 py-3 border-b">
                <div className="bg-white p-3 rounded shadow-sm">
                    <h3 className="font-semibold text-sm">Network</h3>
                    <p className="text-green-600 font-bold text-sm">Home Network</p>
                    <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <h3 className="font-semibold text-sm">Online Users</h3>
                    <p className="text-lg font-bold">{onlineUsers.length}</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <h3 className="font-semibold text-sm">Messages Sent</h3>
                    <p className="text-lg font-bold">{messages.filter(m => m.sender === user.id).length}</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <h3 className="font-semibold text-sm">Messages Received</h3>
                    <p className="text-lg font-bold">{messages.filter(m => m.receiver === user.id).length}</p>
                </div>
            </div>

            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-white border-r flex flex-col">
                    <div className="p-3">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full p-2 border rounded text-sm"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-xs font-semibold px-3 py-1 text-gray-500">ONLINE - {onlineUsers.length}</h4>
                        {friends
                            .filter((f) => onlineUsers.includes(f._id))
                            .map((f) => (
                                <div
                                    key={f._id}
                                    onClick={() => setSelectedFriend(f)}
                                    className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${selectedFriend?._id === f._id
                                        ? "bg-green-100"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#a5b863] text-white font-semibold uppercase">
                                        {f.username[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{f.username}</p>
                                        <p className="text-xs text-green-500">Available</p>
                                    </div>
                                </div>
                            ))}

                        <h4 className="text-xs font-semibold px-3 py-1 text-gray-500 mt-2">
                            OFFLINE - {friends.length - onlineUsers.length}
                        </h4>
                        {friends
                            .filter((f) => !onlineUsers.includes(f._id))
                            .map((f) => (
                                <div
                                    key={f._id}
                                    onClick={() => setSelectedFriend(f)}
                                    className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${selectedFriend?._id === f._id
                                        ? "bg-green-100"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-semibold uppercase">
                                        {f.username[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{f.username}</p>
                                        <p className="text-xs text-gray-500">Offline</p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="border-t p-3 text-center text-sm text-gray-600 cursor-pointer hover:text-green-700">
                        ⚙️ Settings
                    </div>
                </div>

                {/* Chat section */}
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
                                        className="bg-green-500 flex items-center justify-center gap-2 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        <FaPhone /> Voice
                                    </button>
                                    <button
                                        onClick={() => startCall("video")}
                                        className="bg-blue-500 flex items-center justify-center gap-2 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        <FaVideo /> Video
                                    </button>
                                </div>

                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`my-1 ${msg.sender === user.id ? "text-right" : "text-left"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block px-3 py-2 rounded-lg ${msg.sender === user.id
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {msg.content}
                                        </span>
                                    </div>
                                ))}
                                {typingUser && (
                                    <p className="text-xs text-gray-400 italic">{typingUser} is typing...</p>
                                )}
                                <div ref={messagesEndRef}></div>
                            </div>

                            <div className="border-t p-3 flex items-center">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => handleTyping(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-l px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-[#8aa234] text-white px-4 py-2 rounded-r hover:bg-[#7d922e]"
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
            {callingUser && !callAccepted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <h2 className="text-lg font-semibold mb-3">Calling {callingUser.username}...</h2>
                        <p className="text-gray-600 mb-2">Waiting for them to answer</p>
                        <button
                            onClick={endCall}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancel Call
                        </button>
                    </div>
                </div>
            )}

            {incomingCall && !callAccepted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white p-6 rounded-xl text-center">
                        <h2 className="text-lg font-semibold mb-3">
                            Incoming {incomingCall.type === "video" ? "Video" : "Voice"} Call
                        </h2>
                        <p className="text-gray-600 mb-4">From: {incomingCall.from}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={answerCall}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => setIncomingCall(null)}
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
}

export default Chat;
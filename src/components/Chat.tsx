"use client";

import {jwtDecode} from "jwt-decode"
import { useEffect, useState, useRef } from "react";
import { BASE_URL } from "@/api";
import CallModal from "./modal/CallModal";
import {
  Paperclip,
  Fingerprint,
  Send,
  Lock,
} from "lucide-react";
import { Socket } from "socket.io-client";



import {
  FiMessageSquare,
  FiFolder,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";

type ChatProps = {
  user: {
    id: string;
    token: string;
    username: string;
    status: string;
    role: string;
  };
  socket: Socket;
  setUser: (user: any) => void;
};
interface ChatUser {
  id: string;
  username: string;
  email?: string;
  role?: string;
  status?: string;
  isBlocked?: boolean;
}

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");


  const token = localStorage.getItem("token");

  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded role:", decoded.role);
      isAdmin = decoded.role === "admin";
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  useEffect(() => {
    beepRef.current = new Audio("/sounds/message.mp3");
  }, []);

  useEffect(() => {
    ringtoneRef.current = new Audio("/sounds/ringtone.mp3");
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
      if (peerConnection)
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
    });

    socket.on("callEnded", () => endCall());

    // socket.on("receiveMessage", (msg) => {
    //   if (!selectedFriend) return;

    //   const isForThisChat =
    //     (msg.sender === selectedFriend._id && msg.receiver === user.id) ||
    //     (msg.sender === user.id && msg.receiver === selectedFriend._id);

    //   if (isForThisChat) {
    //     setMessages((prev) => [...prev, msg]);
    //   }
    // });

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
      // socket.off("receiveMessage");
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
        type, // "video" or "audio"
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

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.signal),
      );
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
    if (localStream)
      localStream.getTracks().forEach((track: any) => track.stop());
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
      if (!user?.token) {
        alert("Unauthorized");
        return;
      }
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
        setFriends((prev) => [...prev, data.friend]);
        setFriendUsername("");
      }
    } catch (error) {
      console.error("Add friend error:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/friends`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const result = await res.json();

      console.log("friends api response:", result);

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : [];

      setFriends(list);
    } catch (error) {
      console.error("Fetch friends error:", error);
      setFriends([]); // safety fallback
    }
  };
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchMessages = async (friendId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/messages/${friendId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log("=====", res);

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  useEffect(() => {
    if (!selectedFriend?._id) return;

    setMessages([]);
    fetchMessages(selectedFriend._id);
  }, [selectedFriend?._id]);

  const sendMessage = async () => {
    if ((!message.trim() && !selectedMedia) || !selectedFriend) return;

    const msg: any = {
      sender: user.id,
      receiver: selectedFriend._id,
      content: message.trim(),
      type: selectedMedia ? "media" : "text",
      timestamp: new Date().toISOString(),
    };

    try {
      // 1️⃣ If media selected, upload first
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
          alert("Failed to upload file");
          return;
        }

        msg.mediaUrl = uploadData.url;
        msg.fileName = selectedMedia.name;
        msg.fileType = selectedMedia.type;
      }

      // 3️⃣ Emit to socket
      socket.emit("sendMessage", msg);

      // 4️⃣ Reset input
      setMessage("");
      setSelectedMedia(null);

      socket.emit("stopTyping", {
        to: selectedFriend._id,
        from: user.username,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong");
    }
  };

  const getDateLabel = (dateStr: string) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(msgDate, today)) return "Today";
    if (isSameDay(msgDate, yesterday)) return "Yesterday";

    return msgDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleTyping = (val: string) => {
    setMessage(val);
    if (selectedFriend) {
      socket.emit("typing", { to: selectedFriend._id, from: user.username });
      if (!val) {
        socket.emit("stopTyping", {
          to: selectedFriend._id,
          from: user.username,
        });
      }
    }
  };

  const [users, setUsers] = useState<ChatUser[]>([]);
 const fetchAdminUsersAndFriends = async () => {
   try {
     const token = localStorage.getItem("token");

     const [usersRes, friendsRes] = await Promise.all([
       fetch(`${BASE_URL}/api/user-list`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       }),
       fetch(`${BASE_URL}/api/friends`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
       }),
     ]);
     if (!usersRes.ok || !friendsRes.ok) {
       throw new Error("API request failed");
     }
     const usersData = await usersRes.json();
     const friendsData = await friendsRes.json();
     const list = Array.isArray(usersData) ? usersData : usersData.data || [];

     const mappedUsers: ChatUser[] = list.map((u: any) => ({
       id: u.id || u._id,
       username: u.username,
       email: u.email,
       role: u.role,
       status: u.status ?? "offline",
       isBlocked: u.isBlocked,
     }));

     setUsers(mappedUsers);
     setFriends(
       Array.isArray(friendsData) ? friendsData : friendsData.data || [],
     );
   } catch (error) {
     console.error("Failed to fetch admin users & friends:", error);
   }
 };
  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsersAndFriends();
    } else {
      fetchFriends();
    }
  }, [isAdmin]);
 
  useEffect(() => {
    const handleReceiveMessage = (msg: any) => {
      if (!selectedFriend) return;

      const isForThisChat =
        (msg.sender === selectedFriend._id && msg.receiver === user.id) ||
        (msg.sender === user.id && msg.receiver === selectedFriend._id);

      if (isForThisChat) {
        setMessages((prev) => [...prev, msg]);

        if (beepRef.current) {
          beepRef.current.currentTime = 0;
          beepRef.current.play().catch(() => {});
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage); // ✔ OK now, returns void
    };
  }, [socket, selectedFriend]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // ✅ cleanup after backend confirms logout
      localStorage.removeItem("token");

      if (socket?.connected) {
        socket.disconnect();
      }

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      if (socket?.connected) socket.disconnect();
      setUser(null);
    }
  };
  const filteredFriends = friends.filter((friend) => {
    if (!friend?.username) return false;

    return friend.username.toLowerCase().includes(search.trim().toLowerCase());
  });
  return (
    <div className="flex flex-col h-screen w-full rounded-lg bg-[#f7f8f3] shadow-lg ">
      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isAdmin && (
          <div className="w-[320px] h-screen bg-white border-r flex flex-col justify-between">
            {/* TOP */}
            <div className="p-4 space-y-6">
              {/* LOGO */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#0B1F3B] flex items-center justify-center">
                  <img
                    src="/assets/logo/localchatlogo.png"
                    alt="logo"
                    className="object-contain h-8 w-8 filter brightness-0 invert "
                  />
                </div>
                <div>
                  <h1 className="text-[#0B1F3B] font-bold text-lg leading-tight">
                    LocalChat
                  </h1>
                  <p className="text-xs text-slate-400 tracking-wide">
                    SECURE TALK
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Add friend…"
                className="
    w-full mb-2 px-3 py-1.5 text-sm
    rounded-md
    border border-[#1f3a5f]
    text-gray-600 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-[#1f3a5f]/400 focus:border-[#1f3a5f]/400
    transition
  "
              />

              <button
                disabled={!friendUsername}
                onClick={addFriend}
                className="
    w-full mb-4 py-1.5 text-sm font-semibold
    rounded-md
    bg-gradient-to-br from-[#0f2a44] to-[#1e4b6e]
    text-white shadow
    transition
    disabled:opacity-50 disabled:cursor-not-allowed
  "
              >
                Add Friend
              </button>

              {/* PROFILE */}
              <div className="flex items-center gap-3 border rounded-xl p-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <img
                    src="/assets/logo/localchatlogo.png"
                    alt="logo"
                    className="object-contain h-8 w-8 "
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800">
                    {user.username}
                  </p>
                  <span className="inline-block mt-1 text-xs px-2 py-[2px] rounded bg-green-100 text-green-600 font-semibold">
                    LEVEL - 3
                  </span>
                </div>
              </div>

              {/* NAV */}
              <nav className="space-y-1 text-sm">
                {/* ACTIVE ITEM */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 border-l-4 border-blue-800">
                  <div className="flex items-center gap-3 text-blue-900 font-semibold">
                    <FiMessageSquare size={18} />
                    Messages
                  </div>
                  <span className="h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </div>

                {/* OTHER ITEMS */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                  <FiFolder size={18} />
                  Directory
                </div>

                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                  <FiFileText size={18} />
                  Files
                </div>

                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                  <FiFileText size={18} />
                  Reports
                </div>

                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                  <FiSettings size={18} />
                  Settings
                </div>
              </nav>
              {/* LOGOUT */}
              <div className="mt-25">
                <button
                  onClick={() => handleLogout()}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition justify-center"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          className={`${
            isAdmin ? "w-[480px]" : "w-[400px]"
          } h-screen border-r bg-white flex flex-col`}
        >
          <div className="p-4 space-y-3">
            <h2 className="text-sm font-bold tracking-wide text-slate-900">
              {isAdmin ? "USERS & FRIENDS" : "ACTIVE FRIENDS"}
            </h2>

            {/* SEARCH */}
            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-800"
              />
            </div>
          </div>

          {/* CHANNEL LIST */}
          <div className="flex-1 overflow-y-auto">
            {/* 👤 ADMIN USERS */}
            {isAdmin && (
              <>
                <p className="px-4 py-2 text-xs font-semibold text-slate-500">
                  USERS
                </p>
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => setSelectedFriend(u)}
                    className="cursor-pointer"
                  >
                    <ChannelItem name={u.username} status={u.status} />
                  </div>
                ))}
              </>
            )}

            {/* 👥 FRIENDS (ADMIN + USER) */}
            <p className="px-4 py-2 text-xs font-semibold text-slate-500">
              FRIENDS
            </p>
            {friends.map((f) => (
              <div
                key={f._id}
                onClick={() => setSelectedFriend(f)}
                className="cursor-pointer"
              >
                <ChannelItem name={f.username} status={f.status} />
              </div>
            ))}
          </div>
        </div>
        {/* Chat window */}

        <div className=" bg-[#f4f7fb] flex items-center justify-center w-full ">
          {/* Chat Container */}
          <div className="w-full max-w-4xl bg-white shadow-xl  overflow-hidden h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <img
                    src="/assets/logo/localchatlogo.png"
                    alt="logo"
                    className="object-contain h-8 w-8 "
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">
                    {selectedFriend ? selectedFriend.username : "Select a chat"}
                  </h2>

                  <p className="text-xs text-slate-500">
                    FIELD OFFICER • DELHI
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-md bg-orange-100 text-orange-700 border border-orange-500">
                <Lock size={12} className="text-orange-700" />
                TLS 1.3
              </span>
            </div>

            {/* Messages */}
            <div className="bg-[#f8fafc] p-6 space-y-6 h-[460px] overflow-y-auto">
              {/* Date badge */}

              {messages.map((msg: any, index: number) => {
                const isOutgoing = msg.sender === user.id;

                const currentDate = getDateLabel(msg.timestamp);
                const prevDate =
                  index > 0
                    ? getDateLabel(messages[index - 1].timestamp)
                    : null;

                const showDate = index === 0 || currentDate !== prevDate;

                return (
                  <div key={msg._id || index}>
                    {/* 🔥 Date Separator */}
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <div className="px-3 py-1 rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                          {currentDate}
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-md ${isOutgoing ? "ml-auto text-right" : ""}`}
                    >
                      {/* Confidential label */}
                      <div className="mb-1">
                        <span className="text-[8px] text-slate-700 bg-amber-500 rounded-[5px] px-1.5 py-0.5 font-semibold inline-block">
                          CONFIDENTIAL
                        </span>
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`mt-1 rounded-xl px-4 py-3 shadow inline-block max-w-full break-words whitespace-pre-wrap ${
                          isOutgoing
                            ? "bg-gradient-to-br from-[#0f2a44] to-[#1e4b6e] text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        {/* TEXT MESSAGE */}
                        {msg.type === "text" && (
                          <p className="text-sm break-words whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        )}

                        {/* MEDIA MESSAGE */}
                        {msg.type === "media" && msg.mediaUrl && (
                          <>
                            {msg.fileType?.startsWith("image") ? (
                              <img
                                src={msg.mediaUrl}
                                className="rounded-md max-w-xs"
                                alt="media"
                              />
                            ) : (
                              <a
                                href={msg.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {msg.fileName}
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p
                        className={`mt-1 flex gap-2 text-[10px] text-slate-400 ${
                          isOutgoing ? "justify-end" : ""
                        }`}
                      >
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Hidden file input – ONE TIME ONLY */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedMedia(file);
                }
              }}
            />

            {/* Input */}
            <div className="flex items-center gap-3 px-6 py-4 bg-white">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Paperclip size={18} />
              </button>
              {selectedMedia && (
                <div className="px-6 py-2 text-xs text-slate-600 bg-slate-100 flex items-center gap-2">
                  {selectedMedia.name}
                </div>
              )}
              <input
                placeholder="Type message..."
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button className="text-slate-400 hover:text-slate-600">
                <Fingerprint size={18} />
              </button>
              <button
                onClick={sendMessage}
                className="bg-[#0f2a44] text-white p-2 rounded-full hover:bg-[#163b5c]"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call modals */}
      {callingUser && !callAccepted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-3">
              Calling {callingUser.username}...
            </h2>
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
const ChannelItem = ({
  name,
  message,
  time,
  unread,
  status,
  active = false,
  urgent = false,
  avatar,
}: any) => {
  const statusColorMap: any = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    pending: "bg-yellow-400",
  };

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer
      ${urgent ? "bg-red-50" : "hover:bg-slate-50"}`}
    >
      {(active || urgent) && (
        <span
          className={`absolute left-0 top-0 h-full w-1
          ${urgent ? "bg-red-600" : "bg-blue-800"}`}
        />
      )}

      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-slate-200 flex items-center justify-center bg-white">
          <img
            src={avatar || "/assets/logo/localchatlogo.png"}
            alt={name}
            className="object-cover h-8 w-8 rounded-full"
          />
        </div>

        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
          ${urgent ? "bg-red-500" : statusColorMap[status]}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p
            className={`text-sm font-semibold truncate
            ${urgent ? "text-red-600" : "text-slate-900"}`}
          >
            {name}
          </p>
          {time && <span className="text-xs text-slate-400">{time}</span>}
        </div>

        <p
          className={`text-xs truncate
          ${urgent ? "text-red-600 font-semibold" : "text-slate-500"}`}
        >
          {message}
        </p>
      </div>

      {unread > 0 && (
        <span
          className={`h-5 w-5 flex items-center justify-center rounded-full text-xs text-white font-semibold
          ${urgent ? "bg-red-600" : "bg-blue-800"}`}
        >
          {unread}
        </span>
      )}
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import ActivityItem from "@/components/ActivityItem";
import Marker from "@/components/Marker";
import { Menu, X } from "lucide-react";
import { BASE_URL } from "@/api";
import QuickActions from "@/components/admin/action";
import { Socket } from "socket.io-client";

import { useRouter, usePathname } from "next/navigation";



type ChatProps = {
  user: { id: string; token: string; username: string };
  socket: Socket;
  setUser: (user: any) => void;
};
import {
  MessageCircle,
  Home,
  MapPin,
  Folder,
  Users,
  BarChart2,
  Settings,
  Search,
  Bell,
  Mail,
  Activity,
  Lock,
  HeartPulse,
  UserPlus,
  FileText,
  Radio,
  RefreshCcw,
  ShieldCheck,
  BookOpen,
  Headphones,
  ChevronUp,
  CheckCircle,
  UserCheck,
  List,
} from "lucide-react";
const stats = [
  {
    title: "TOTAL USERS",
    value: "1284",
    icon: Users,
    iconBg: "bg-[#eaf5ee]",
    iconColor: "text-[#4b6f44]",
    badge: "+12%",
    badgeBg: "bg-[#e6f7ec]",
    badgeColor: "text-[#16a34a]",
    border: "border-t-4 border-[#2ecc71]",
  },
  {
    title: "ACTIVE OPERATIONS",
    value: "342",
    icon: Activity,
    iconBg: "bg-[#e6fbf4]",
    iconColor: "text-[#10b981]",
    badge: "+5%",
    badgeBg: "bg-[#e6f7ec]",
    badgeColor: "text-[#16a34a]",
  },
  {
    title: "SECURE CHANNELS",
    value: "56",
    icon: Lock,
    iconBg: "bg-[#fff4e6]",
    iconColor: "text-[#f59e0b]",
    badge: "-2%",
    badgeBg: "bg-[#fdecec]",
    badgeColor: "text-[#ef4444]",
  },
  {
    title: "SYSTEM HEALTH",
    value: "98",
    icon: HeartPulse,
    iconBg: "bg-[#fdecec]",
    iconColor: "text-[#ef4444]",
    badge: "Stable",
    badgeBg: "bg-[#e6f7ec]",
    badgeColor: "text-[#16a34a]",
  },
];

const menuItems = [
  { name: "Overview", icon: Home, route: "/dashboard" },
  { name: "Geo Monitoring", icon: MapPin, route: "/on-map" },
  { name: "Files", icon: Folder, route: "/files" },
  { name: "Users", icon: Users, route: "/admin/users" },
  // { name: "Analytics", icon: BarChart2, route: "/analytics" },
  { name: "Chat", icon: MessageCircle, route: "/chat" }, 
  { name: "Settings", icon: Settings, route: "/settings" },
];

const actions = [
  {
    title: "Add User",
    description: "Create new operative account",
    icon: UserPlus,
    action: "ADD_USER",
  },
  {
    title: "Export Report",
    description: "Generate activity summary",
    icon: FileText,
    action: "EXPORT",
  },
  {
    title: "Send Alert",
    description: "Broadcast emergency message",
    icon: Radio,
    action: "ALERT",
  },
  {
    title: "Sync Data",
    description: "Update all field devices",
    icon: RefreshCcw,
    action: "SYNC",
  },
];

const activities = [
  {
    icon: <CheckCircle className="text-green-600 h-5 w-5" />,
    title: "Secure Connection Established",
    subtitle: "New device authenticated",
  },
  {
    icon: <CheckCircle className="text-green-600 h-5 w-5" />,
    title: "Secure Connection Established",
    subtitle: "New device authenticated",
  },
  {
    icon: <UserCheck className="text-green-600 h-5 w-5" />,
    title: "Identity Verified",
    subtitle: "Biometric scan approved",
  },
  {
    icon: <CheckCircle className="text-green-600 h-5 w-5" />,
    title: "Secure Connection Established",
    subtitle: "New device authenticated",
  },
  {
    icon: <CheckCircle className="text-green-600 h-5 w-5" />,
    title: "Secure Connection Established",
    subtitle: "New device authenticated",
  },
  {
    icon: <CheckCircle className="text-green-600 h-5 w-5" />,
    title: "Secure Connection Established",
    subtitle: "New device authenticated",
  },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target, duration]);

  return count;
}

const  Admin:React.FC<ChatProps>=({ user, socket, setUser })=> {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [isOpen, setIsOpen] = useState(true); // desktop expanded/collapsed
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [friendUsername, setFriendUsername] = useState<string>("");
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

  
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("token");
    if (socket?.connected) socket.disconnect();
  
  }
};

  const router = useRouter();
  const pathname = usePathname(); // for active menu (recommended)

  const handleMenuClick = (item:any) => {
    router.push(item.route);
  }
  

    
  const addFriend=async() => {
    if (!friendUsername.trim()) return alert("Enter friend's username");
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

      const data =await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setFriends((prev) => [...prev, data.friend])
        setFriendUsername("");
      }
    } catch (error) {
        console.error("Add friend error:", error);
    }

  }

  return (
    <>
      <div className="flex min-h-screen bg-[#f5f7fb]">
        {/* SIDEBAR */}
        {/* Desktop toggle button */}
        <button
          className="hidden md:flex fixed top-5 left-5 z-50 p-2 rounded-md bg-[#031026] text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden fixed top-5 left-5 z-50 p-2 rounded-md bg-[#031026] text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <aside
          className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-[#031026] to-[#020b1c] text-white flex flex-col justify-between px-2 py-6
          transform transition-all duration-300 ease-in-out
          z-40
          ${isOpen ? "w-[280px] px-5" : "w-20 px-2"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
        >
          {/* Top Logo */}
          <div>
            <div
              className={`flex justify-center mb-4 border-b border-[#0f254a] pb-4 ${
                isOpen ? "" : "justify-center"
              }`}
            >
              <div className="h-20 w-20 flex items-center justify-center">
                <img
                  src="/assets/logo/localchatlogo.png"
                  alt="logo"
                  className="object-contain"
                />
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
    bg-[#0b1f3c]
    border border-[#1f3a5f]
    text-gray-200 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400
    transition
  "
            />

            <button
              disabled={!friendUsername}
              onClick={addFriend}
              className="
              disabled:opacity-50 disabled:cursor-not-allowed
    w-full mb-4 py-1.5 text-sm font-semibold
    rounded-md
    bg-emerald-500
    hover:bg-emerald-400
    text-[#031026]
    transition-colors duration-200
  "
            >
              Add Friend
            </button>

            {/* Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.route;

                return (
                  <div
                    key={item.name}
                    onClick={() => handleMenuClick(item)}
                    className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer
            border-l-4 transition-colors duration-300 ease-in-out
            ${
              isActive
                ? "bg-[#0b1f3c] border-emerald-400"
                : "border-transparent hover:bg-[#081a34] hover:border-emerald-400"
            }`}
                  >
                    <item.icon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isActive ? "text-emerald-400" : "text-gray-400"
                      }`}
                    />

                    {isOpen && (
                      <span
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isActive ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Branding */}
          {isOpen && (
            <div className="flex items-center gap-3 border-t border-[#0f254a] pt-4">
              <div className="h-10 w-10 flex items-center justify-center">
                <img
                  src="/assets/logo/localchatlogo.png"
                  alt="logo"
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-semibold">LOCAL</p>
                <p className="text-sm font-bold leading-4">
                  CHAT <br />
                  <span className="text-xs">COMMANDER</span>
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        {/* RIGHT CONTENT */}
        <div className="flex-1 ml-[280px] flex flex-col">
          {/* HEADER */}
          <header className="sticky top-0 z-40 mx-6 mt-6 bg-white rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
            {/* Left */}
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">
                Command <span className="text-[#4b6f44]">Center</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Home <span className="mx-1">›</span> Dashboard{" "}
                <span className="mx-1">›</span>
                <span className="text-gray-600">Overview</span>
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#f8fafc] border border-gray-200 rounded-full px-4 py-2 w-[260px]">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search operations..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              <div
                className="relative group bg-[#f8fafc] p-3 rounded-full border border-gray-200
  transition-all duration-300 ease-out
  hover:bg-[#4b6f44]
  hover:ring-4 hover:ring-[#4b6f44]/30
"
              >
                {/* Icon */}
                <Bell
                  className="h-5 w-5 text-gray-600
    transition-transform duration-300
    group-hover:text-white
    group-hover:scale-125
    group-hover:animate-[pulse_1.2s_ease-in-out_infinite]"
                />

                {/* Notification Count */}
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white
    rounded-full flex items-center justify-center
    animate-[pulse_2.5s_ease-in-out_infinite]"
                >
                  3
                </span>
              </div>

              <div
                className="group bg-[#f8fafc] p-3 rounded-full border border-gray-200
  transition-all duration-300 ease-out
  hover:bg-[#4b6f44]
  hover:ring-4 hover:ring-[#4b6f44]/30
"
              >
                <Mail
                  className="h-5 w-5 text-gray-600
    transition-transform duration-300
    group-hover:text-white
    group-hover:scale-125
    group-hover:animate-[pulse_1.2s_ease-in-out_infinite]"
                />
              </div>

              <button
                onClick={() => handleLogout()}
                className="group flex items-center gap-2 bg-[#ef4444] text-white
  px-5 py-2 rounded-full text-sm font-semibold
  transition-all duration-300 ease-out
  hover:bg-[#dc2626]
  hover:scale-110
  hover:shadow-xl
  active:scale-95
"
              >
                <span
                  className="transition-transform duration-300
    group-hover:animate-[pulse_1.2s_ease-in-out_infinite]"
                >
                  ⏻
                </span>
                Logout
              </button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="p-6 space-y-6">
            {/* TOTAL DATA SECTION — NOW CORRECT */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.map((item) => {
                const animatedValue = useCountUp(Number(item.value));

                return (
                  <div
                    key={item.title}
                    className="group relative bg-white rounded-2xl p-6 shadow-sm
        border border-gray-100 overflow-hidden
        transition-all duration-300 ease-out
        hover:scale-[1.03] hover:shadow-lg"
                  >
                    {/* Animated Top Border */}
                    <span
                      className="absolute top-0 left-0 h-[3px] w-0
  bg-gradient-to-r from-[#2ecc71] to-[#4b6f44]
  transition-all duration-500 ease-out
  group-hover:w-full"
                    />

                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`p-3 rounded-xl ${item.iconBg}
            transition-transform duration-300
            group-hover:scale-110`}
                      >
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full
            ${item.badgeBg} ${item.badgeColor}`}
                      >
                        {item.badge.startsWith("-")
                          ? "↓ "
                          : item.badge.startsWith("+")
                            ? "↑ "
                            : "✓ "}
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs font-semibold tracking-wider text-gray-400">
                      {item.title}
                    </p>

                    {/* Animated Count */}
                    <h2 className="text-3xl font-bold text-[#0f172a] mt-2">
                      {animatedValue.toLocaleString()}
                    </h2>
                  </div>
                );
              })}
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT – LIVE GEO MONITORING */}
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-[#4b6f44]" />
                  <h2 className="text-lg font-semibold text-[#0f172a]">
                    Live Geo Monitoring
                  </h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-4">
                  <button className="px-4 py-1.5 text-xs rounded-md bg-[#4b6f44] text-white font-semibold">
                    Live
                  </button>
                  <button className="px-4 py-1.5 text-xs rounded-md border border-gray-200 text-gray-500 hover:bg-[#4b6f44] hover:text-white font-semibold">
                    History
                  </button>
                  <button className="px-4 py-1.5 text-xs rounded-md border border-gray-200 text-gray-500 hover:bg-[#4b6f44] hover:text-white font-semibold">
                    Zones
                  </button>
                </div>

                {/* Map Placeholder */}
                <div className="relative h-[320px] rounded-xl bg-gradient-to-b from-[#1e3a6d] to-[#17325c] overflow-hidden">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                    {[...Array(48)].map((_, i) => (
                      <div key={i} className="border border-white/10" />
                    ))}
                  </div>

                  {/* Markers */}
                  <Marker top="25%" left="30%" color="bg-green-500" />
                  <Marker top="50%" left="40%" color="bg-cyan-400" />
                  <Marker top="60%" left="25%" color="bg-red-500" />
                  <Marker top="40%" left="65%" color="bg-orange-400" />
                </div>
              </div>

              {/* RIGHT – LIVE ACTIVITY */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[420px]">
                {/* Header (fixed) */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5 text-[#4b6f44]" />
                    <h2 className="text-lg font-semibold text-[#0f172a]">
                      Live Activity
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs rounded-md bg-[#4b6f44] text-white font-semibold">
                      All
                    </button>
                    <button className="px-3 py-1 text-xs rounded-md border border-gray-200 text-gray-500 hover:bg-[#4b6f44] hover:text-white font-semibold ">
                      Alerts
                    </button>
                  </div>
                </div>

                {/* Scrollable Activity List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {[
                    {
                      icon: <CheckCircle className="text-green-600 h-5 w-5" />,
                      title: "Secure Connection Established",
                      subtitle: "New device authenticated",
                    },
                    {
                      icon: <CheckCircle className="text-green-600 h-5 w-5" />,
                      title: "Secure Connection Established",
                      subtitle: "New device authenticated",
                    },
                    {
                      icon: <UserCheck className="text-green-600 h-5 w-5" />,
                      title: "Identity Verified",
                      subtitle: "Biometric scan approved",
                    },
                    {
                      icon: <CheckCircle className="text-green-600 h-5 w-5" />,
                      title: "Secure Connection Established",
                      subtitle: "New device authenticated",
                    },
                    {
                      icon: <CheckCircle className="text-green-600 h-5 w-5" />,
                      title: "Secure Connection Established",
                      subtitle: "New device authenticated",
                    },
                    {
                      icon: <CheckCircle className="text-green-600 h-5 w-5" />,
                      title: "Secure Connection Established",
                      subtitle: "New device authenticated",
                    },
                  ].map((item, index) => (
                    <ActivityItem
                      key={index}
                      index={index}
                      icon={item.icon}
                      title={item.title}
                      subtitle={item.subtitle}
                    />
                  ))}
                </div>
              </div>
            </section>

            <div className="p-6">
              <QuickActions />
            </div>
          </main>

          {/* FOOTER*/}
          <footer className="bg-white mt-12 border-t border-gray-200">
            {/* Top Footer Row */}
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/assets/logo/localchatlogo.png"
                  alt="logo"
                  className="object-contain h-15 w-15"
                />
                <div className="leading-tight">
                  <p className="text-xs tracking-widest text-[#22c55e] font-semibold">
                    LOCAL
                  </p>
                  <p className="text-lg font-bold text-[#0f172a]">CHAT</p>
                </div>
              </div>

              {/* Center Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#0f172a]"
                >
                  <Lock className="h-4 w-4" />
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#0f172a]"
                >
                  <BookOpen className="h-4 w-4" />
                  User Manual
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#0f172a]"
                >
                  <Headphones className="h-4 w-4" />
                  Support
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#0f172a]"
                >
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </a>
              </div>

              {/* Scroll to Top */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>

            {/* Bottom Text */}
            <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-500">
              © 2026 Local Chat Command Center. All rights reserved. | System
              Version 2.4.1
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Admin;

'use client';

import React from "react";

export default function ActivityItem({
  icon,
  title,
  subtitle,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  index: number;
}) {
  return (
    <div
      style={{
        opacity: 0,
        transform: "translateX(-16px)",
        animation: "activitySlide 0.45s ease-out forwards",
        animationDelay: `${index * 180 + 100}ms`, // 👈 KEY FIX
      }}
      className="
        group relative flex gap-4 items-start
        p-3 rounded-xl
        transition-all duration-300 ease-out
        hover:translate-x-2 hover:bg-[#eef5f0]
      "
    >
      {/* Left border on hover */}
      <span
        className="
          absolute left-0 top-0 h-full w-0
          bg-[#4b6f44]
          rounded-l-xl
          transition-all duration-300
          group-hover:w-1
        "
      />

      {/* Icon */}
      <div
        className="
          h-10 w-10 rounded-xl bg-[#e6f7ec]
          flex items-center justify-center
          transition-transform duration-300
          group-hover:scale-110
        "
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold text-[#0f172a]">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
        <p className="text-xs text-green-600 mt-1">Just now</p>
      </div>
    </div>
  );
}

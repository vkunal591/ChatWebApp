"use client";
export default function Marker({
  top,
  left,
  color,
}: {
  top: string;
  left: string;
  color: string;
}) {
  return (
    <div className="absolute" style={{ top, left }}>
      <div className={`h-4 w-4 rounded-full ${color} relative`}>
        <span className="absolute inset-[-10px] rounded-full border border-green-400/40 animate-ping" />
      </div>
    </div>
  );
}

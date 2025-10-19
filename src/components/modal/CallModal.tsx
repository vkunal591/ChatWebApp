import { useEffect, useRef } from "react";

export default function CallModal({
  isOpen,
  onClose,
  isVideo,
  localStream,
  remoteStream,
  onEnd,
}: any) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localStream) {
      localRef.current.srcObject = localStream;
    }
    if (remoteRef.current && remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md text-center relative">
        <h2 className="font-semibold text-lg mb-3">
          {isVideo ? "Video Call" : "Voice Call"}
        </h2>

        {isVideo ? (
          <div className="flex flex-col items-center">
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="w-60 h-40 rounded-lg bg-black mb-2"
            />
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className="w-28 h-20 rounded-lg bg-gray-900"
            />
          </div>
        ) : (
          <p className="text-gray-600 mb-4">Connected — Audio Only</p>
        )}

        <button
          onClick={onEnd}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          End Call
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

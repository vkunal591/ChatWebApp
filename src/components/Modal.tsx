import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-white text-black w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg p-6 relative shadow-xl">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-black hover:text-red-600 z-50 cursor-pointer"
        >
          ✕
        </button>

        {/* MODAL CONTENT */}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

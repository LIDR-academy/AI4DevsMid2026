import React from 'react';

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => (
  <div
    role="status"
    aria-live="polite"
    className="fixed bottom-[32px] right-[32px] z-50 bg-[#1a1c1c] border-2 border-[#1a1c1c] text-white px-[24px] py-[16px] flex items-center gap-[16px]"
  >
    <span className="font-space font-bold text-[14px]">{message}</span>
    <button
      onClick={onDismiss}
      aria-label="Dismiss notification"
      className="text-white font-space text-[16px] leading-none"
    >
      ×
    </button>
  </div>
);

export default Toast;

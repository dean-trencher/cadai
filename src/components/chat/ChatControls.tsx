
import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatControlsProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

const ChatControls: React.FC<ChatControlsProps> = ({ onSubmit, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-adam-gray/40 text-white/70 text-xs rounded-full hover:bg-adam-gray/60 transition-colors">
          Rounded slots
        </button>
        <button className="px-3 py-1 bg-adam-gray/40 text-white/70 text-xs rounded-full hover:bg-adam-gray/60 transition-colors">
          Variable fillets
        </button>
        <button className="px-3 py-1 bg-adam-gray/40 text-white/70 text-xs rounded-full hover:bg-adam-gray/60 transition-colors">
          Textured surface
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={disabled ? "Memproses..." : "Describe an object..."}
            disabled={disabled}
            className="w-full bg-adam-gray/50 border border-white/10 rounded-lg py-3 px-4 pr-12 text-white focus:outline-none focus:ring-1 focus:ring-adam-pink/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#D946EF] rounded-md p-2 hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Submit"
          >
            <ArrowUp size={16} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatControls;

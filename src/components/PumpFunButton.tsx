import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import ButtonPrimary from './ButtonPrimary';

const PumpFunButton: React.FC = () => {
  const [pumpFunLink, setPumpFunLink] = useState('');

  useEffect(() => {
    const savedLink = localStorage.getItem('cadai_pumpfun_link') || '#';
    setPumpFunLink(savedLink);
  }, []);

  const handleClick = () => {
    if (pumpFunLink && pumpFunLink !== '#') {
      window.open(pumpFunLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="action-button-glow relative bg-gradient-to-r from-adam-pink to-pink-600 text-white rounded-full px-6 py-3 font-medium 
        transition-all duration-300 hover:shadow-lg flex items-center gap-2"
    >
      <span>pump.fun</span>
      <ExternalLink size={16} />
    </button>
  );
};

export default PumpFunButton;

import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import ButtonPrimary from './ButtonPrimary';
import { supabase } from '@/integrations/supabase/client';

const PumpFunButton: React.FC = () => {
  const [pumpFunLink, setPumpFunLink] = useState('#');

  useEffect(() => {
    loadPumpFunLink();
  }, []);

  const loadPumpFunLink = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('pumpfun_link')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading pump.fun link:', error);
        return;
      }

      if (data && data.pumpfun_link) {
        setPumpFunLink(data.pumpfun_link);
      }
    } catch (error) {
      console.error('Error loading pump.fun link:', error);
    }
  };

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

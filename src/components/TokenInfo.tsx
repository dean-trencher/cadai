import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const TokenInfo: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('cadai_contract_address') || 'TBA - Set in /edit';
    setContractAddress(savedAddress);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      toast.success('Contract address copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="flex items-center gap-3 bg-adam-gray/40 rounded-lg px-4 py-3 border border-white/10">
      <div className="flex flex-col">
        <span className="text-xs text-white/60">$CADAI Token</span>
        <span className="text-sm text-white font-mono">{contractAddress}</span>
      </div>
      <button
        onClick={handleCopy}
        className="ml-auto p-2 hover:bg-white/10 rounded-md transition-colors"
        aria-label="Copy contract address"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-white/60" />}
      </button>
    </div>
  );
};

export default TokenInfo;

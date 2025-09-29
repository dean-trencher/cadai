import React, { useState } from 'react';
import { Menu, Wallet } from 'lucide-react';
import { useWalletDetection } from '@/hooks/useWalletDetection';
import WalletSidebar from './WalletSidebar';

const WalletSidebarTrigger: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected, walletAddress } = useWalletDetection();

  if (!isConnected || !walletAddress) return null;

  return (
    <>
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 right-4 z-30 bg-gradient-to-r from-adam-pink to-purple-500 hover:from-adam-pink/80 hover:to-purple-500/80 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-105"
        title="Open Wallet Sidebar"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-white" />
          <Menu className="w-4 h-4 text-white" />
        </div>
      </button>

      <WalletSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </>
  );
};

export default WalletSidebarTrigger;
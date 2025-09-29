import React from 'react';
import { Shield, Wifi, WifiOff } from 'lucide-react';
import { useWalletDetection } from '@/hooks/useWalletDetection';
const Web3Status: React.FC = () => {
  const {
    isPhantomInstalled,
    isConnected,
    walletAddress
  } = useWalletDetection();
  return <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg bg-zinc-900">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Web3:</span>
        
        {isPhantomInstalled ? <div className="flex items-center gap-2">
            {isConnected ? <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500 font-mono">
                  {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                </span>
              </> : <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-500">Ready</span>
              </>}
          </div> : <span className="text-xs text-slate-50">Not Available</span>}
      </div>
    </div>;
};
export default Web3Status;
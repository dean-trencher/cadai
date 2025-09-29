import React from 'react';
import { X, Wallet, Copy, ExternalLink, ChevronRight } from 'lucide-react';
import { useWalletDetection } from '@/hooks/useWalletDetection';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { useToast } from '@/hooks/use-toast';

interface WalletSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletSidebar: React.FC<WalletSidebarProps> = ({ isOpen, onClose }) => {
  const { isConnected, walletAddress, disconnectWallet } = useWalletDetection();
  const { balance, loading } = useSolanaBalance(walletAddress);
  const { toast } = useToast();

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`, '_blank');
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    onClose();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected successfully",
    });
  };

  if (!isConnected || !walletAddress) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-adam-dark border-l border-adam-gray/30
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-adam-gray/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-adam-pink to-purple-500 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Wallet</h2>
                <p className="text-sm text-white/60">Phantom Connected</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-adam-gray/20 hover:bg-adam-gray/40 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Balance Section */}
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-adam-gray/20 to-adam-gray/10 rounded-xl p-6 border border-adam-gray/20">
              <div className="text-center">
                <p className="text-sm text-white/60 mb-2">Total Balance</p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-adam-gray/40 rounded w-24 mx-auto"></div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-white mb-1">
                    {balance?.toFixed(4) || '0.0000'} SOL
                  </div>
                )}
                <p className="text-xs text-white/40">Devnet Balance</p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">Wallet Address</h3>
              <div className="bg-adam-gray/20 rounded-lg p-4 border border-adam-gray/20">
                <p className="text-xs font-mono text-white/60 break-all mb-3">
                  {walletAddress}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={copyAddress}
                    className="flex-1 flex items-center justify-center gap-2 bg-adam-gray/30 hover:bg-adam-gray/50 rounded-lg py-2 px-3 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="text-xs">Copy</span>
                  </button>
                  <button
                    onClick={openExplorer}
                    className="flex-1 flex items-center justify-center gap-2 bg-adam-pink/20 hover:bg-adam-pink/30 rounded-lg py-2 px-3 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-xs">Explorer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between bg-adam-gray/20 hover:bg-adam-gray/30 rounded-lg p-3 transition-colors">
                  <span className="text-sm text-white">Transaction History</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
                <button className="w-full flex items-center justify-between bg-adam-gray/20 hover:bg-adam-gray/30 rounded-lg p-3 transition-colors">
                  <span className="text-sm text-white">NFT Collection</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
                <button className="w-full flex items-center justify-between bg-adam-gray/20 hover:bg-adam-gray/30 rounded-lg p-3 transition-colors">
                  <span className="text-sm text-white">Settings</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto p-6 border-t border-adam-gray/30">
            <button
              onClick={handleDisconnect}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg py-3 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletSidebar;
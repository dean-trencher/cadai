import React from 'react';
import { Wallet } from 'lucide-react';
import { useWalletDetection } from '@/hooks/useWalletDetection';
import ButtonSecondary from '@/components/ButtonSecondary';
import { useToast } from '@/hooks/use-toast';

const HeaderWalletButton: React.FC = () => {
  const { 
    isPhantomInstalled, 
    isConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet 
  } = useWalletDetection();
  
  const { toast } = useToast();

  const handleWalletAction = async () => {
    if (!isPhantomInstalled) {
      window.open('https://phantom.app/', '_blank');
      toast({
        title: "Install Phantom",
        description: "Please install Phantom wallet to continue",
      });
      return;
    }

    if (isConnected) {
      try {
        await disconnectWallet();
        toast({
          title: "Wallet Disconnected",
          description: "Phantom wallet has been disconnected",
        });
      } catch (error) {
        toast({
          title: "Disconnection Failed",
          description: "Failed to disconnect wallet",
          variant: "destructive",
        });
      }
    } else {
      try {
        const publicKey = await connectWallet();
        toast({
          title: "Wallet Connected",
          description: `Connected to ${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`,
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet",
          variant: "destructive",
        });
      }
    }
  };

  const getButtonText = () => {
    if (!isPhantomInstalled) return "Install Phantom";
    if (isConnected) return `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}`;
    return "Connect Wallet";
  };

  return (
    <button 
      onClick={handleWalletAction}
      className="group relative border border-white/20 hover:border-adam-pink/50 bg-adam-gray/50
        text-white rounded-full px-6 py-3 font-medium 
        transition-all duration-300 hover:shadow-lg flex items-center gap-2"
    >
      <Wallet size={16} />
      <span className="hidden sm:inline">{getButtonText()}</span>
    </button>
  );
};

export default HeaderWalletButton;
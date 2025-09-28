import React from 'react';
import { Wallet, ExternalLink } from 'lucide-react';
import { useWalletDetection } from '@/hooks/useWalletDetection';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const WalletConnector: React.FC = () => {
  const { 
    isPhantomInstalled, 
    isConnected, 
    walletAddress, 
    connectWallet, 
    disconnectWallet 
  } = useWalletDetection();
  
  const { toast } = useToast();

  const handleConnect = async () => {
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
  };

  const handleDisconnect = async () => {
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
  };

  if (!isPhantomInstalled) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
        <Wallet className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Phantom Wallet Not Detected</h3>
          <p className="text-muted-foreground mb-4">
            Please install Phantom wallet to connect with Solana network
          </p>
          <Button 
            onClick={() => window.open('https://phantom.app/', '_blank')}
            className="gap-2"
          >
            Install Phantom <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Phantom Wallet Detected</span>
      </div>
      
      {isConnected ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-primary">Wallet Connected</h3>
          <p className="text-sm text-muted-foreground mb-4 font-mono">
            {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
          </p>
          <Button 
            onClick={handleDisconnect}
            variant="outline"
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-4">
            Connect your Phantom wallet to access Web3 features
          </p>
          <Button 
            onClick={handleConnect}
            className="gap-2"
          >
            <Wallet className="w-4 h-4" />
            Connect Phantom
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
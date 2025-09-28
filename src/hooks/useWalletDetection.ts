import { useState, useEffect } from 'react';

export interface WalletInfo {
  isPhantomInstalled: boolean;
  isConnected: boolean;
  publicKey: string | null;
  walletAddress: string | null;
}

export const useWalletDetection = () => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    isPhantomInstalled: false,
    isConnected: false,
    publicKey: null,
    walletAddress: null,
  });

  const checkPhantomWallet = () => {
    if (typeof window !== 'undefined') {
      const isPhantomInstalled = !!(window as any).solana?.isPhantom;
      return isPhantomInstalled;
    }
    return false;
  };

  const connectWallet = async () => {
    try {
      const { solana } = window as any;
      
      if (!solana?.isPhantom) {
        alert('Phantom wallet tidak terdeteksi! Silakan install Phantom wallet.');
        return;
      }

      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      
      setWalletInfo(prev => ({
        ...prev,
        isConnected: true,
        publicKey,
        walletAddress: publicKey,
      }));

      return publicKey;
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window as any;
      
      if (solana) {
        await solana.disconnect();
      }
      
      setWalletInfo(prev => ({
        ...prev,
        isConnected: false,
        publicKey: null,
        walletAddress: null,
      }));
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      const isPhantomInstalled = checkPhantomWallet();
      
      setWalletInfo(prev => ({
        ...prev,
        isPhantomInstalled,
      }));

      if (isPhantomInstalled) {
        try {
          const { solana } = window as any;
          const response = await solana.connect({ onlyIfTrusted: true });
          
          if (response.publicKey) {
            const publicKey = response.publicKey.toString();
            setWalletInfo(prev => ({
              ...prev,
              isConnected: true,
              publicKey,
              walletAddress: publicKey,
            }));
          }
        } catch (error) {
          // User hasn't granted permission yet
          console.log('Wallet not connected');
        }
      }
    };

    checkWalletConnection();

    // Listen for wallet events
    if (typeof window !== 'undefined' && (window as any).solana) {
      const handleConnect = (publicKey: any) => {
        setWalletInfo(prev => ({
          ...prev,
          isConnected: true,
          publicKey: publicKey.toString(),
          walletAddress: publicKey.toString(),
        }));
      };

      const handleDisconnect = () => {
        setWalletInfo(prev => ({
          ...prev,
          isConnected: false,
          publicKey: null,
          walletAddress: null,
        }));
      };

      (window as any).solana.on('connect', handleConnect);
      (window as any).solana.on('disconnect', handleDisconnect);

      return () => {
        (window as any).solana.off('connect', handleConnect);
        (window as any).solana.off('disconnect', handleDisconnect);
      };
    }
  }, []);

  return {
    ...walletInfo,
    connectWallet,
    disconnectWallet,
  };
};
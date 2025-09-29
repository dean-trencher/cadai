import { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const useSolanaBalance = (walletAddress: string | null) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        setBalance(null);
        return;
      }

      setLoading(true);
      try {
        // Using Solana devnet for now
        const connection = new Connection('https://api.devnet.solana.com');
        const publicKey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAddress]);

  return { balance, loading };
};
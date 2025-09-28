import React from 'react';

const CryptoLogosBar = () => {
  const cryptoLogos = [
    { name: 'Solana', logo: '◎' },
    { name: 'Phantom', logo: '👻' },
    { name: 'MetaMask', logo: '🦊' },
    { name: 'Bitcoin', logo: '₿' },
    { name: 'Ethereum', logo: 'Ξ' },
    { name: 'Pump.fun', logo: '🚀' },
    { name: 'GMGN', logo: '📊' },
    { name: 'Axiom Trade', logo: '⚡' },
    { name: 'Neo Trade', logo: '💎' },
    { name: 'Chainlink', logo: '🔗' },
    { name: 'Polygon', logo: '🔷' },
    { name: 'Avalanche', logo: '🏔️' },
    { name: 'Cardano', logo: '♠️' },
    { name: 'Polkadot', logo: '🔴' },
    { name: 'Binance', logo: '🟡' },
    { name: 'Coinbase', logo: '🔵' },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedLogos = [...cryptoLogos, ...cryptoLogos];

  return (
    <div className="w-full py-16 bg-gradient-to-r from-background via-muted/5 to-background overflow-hidden border-t border-border/10">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {duplicatedLogos.map((crypto, index) => (
          <div
            key={`${crypto.name}-${index}`}
            className="flex items-center justify-center mx-12 min-w-[140px] group"
          >
            <div className="flex flex-col items-center gap-3 transition-all duration-500 group-hover:scale-110">
              <div className="text-4xl opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,59,154,0.3)]">
                {crypto.logo}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-primary transition-all duration-500 font-medium tracking-wider">
                {crypto.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoLogosBar;
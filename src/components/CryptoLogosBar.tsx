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
    <div className="w-full py-12 bg-gradient-to-r from-adam-darker via-adam-gray/20 to-adam-darker overflow-hidden">
      <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {duplicatedLogos.map((crypto, index) => (
          <div
            key={`${crypto.name}-${index}`}
            className="flex items-center justify-center mx-8 min-w-[120px] group"
          >
            <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:scale-110">
              <div className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">
                {crypto.logo}
              </div>
              <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors duration-300 font-medium">
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
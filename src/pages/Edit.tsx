import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from 'sonner';

const Edit: React.FC = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState('');
  const [pumpFunLink, setPumpFunLink] = useState('');

  useEffect(() => {
    const savedAddress = localStorage.getItem('cadai_contract_address') || '';
    const savedLink = localStorage.getItem('cadai_pumpfun_link') || '';
    setContractAddress(savedAddress);
    setPumpFunLink(savedLink);
  }, []);

  const handleSave = () => {
    localStorage.setItem('cadai_contract_address', contractAddress);
    localStorage.setItem('cadai_pumpfun_link', pumpFunLink);
    toast.success('Settings saved successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-adam-darker text-white">
      <header className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <Logo />
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Edit Token Settings</h1>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="contractAddress" className="block text-sm font-medium text-white/80 mb-2">
              Contract Address
            </label>
            <input
              id="contractAddress"
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter $CADAI contract address"
              className="w-full bg-adam-gray/40 border border-white/10 rounded-lg px-4 py-3 text-white 
                placeholder:text-white/40 focus:outline-none focus:border-adam-pink transition-colors"
            />
          </div>

          <div>
            <label htmlFor="pumpFunLink" className="block text-sm font-medium text-white/80 mb-2">
              Pump.fun Link
            </label>
            <input
              id="pumpFunLink"
              type="url"
              value={pumpFunLink}
              onChange={(e) => setPumpFunLink(e.target.value)}
              placeholder="https://pump.fun/..."
              className="w-full bg-adam-gray/40 border border-white/10 rounded-lg px-4 py-3 text-white 
                placeholder:text-white/40 focus:outline-none focus:border-adam-pink transition-colors"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-adam-pink hover:bg-adam-pink/90 text-white rounded-lg px-6 py-3 font-medium 
              transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Edit;

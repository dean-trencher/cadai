import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Edit: React.FC = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState('');
  const [pumpFunLink, setPumpFunLink] = useState('');
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
        return;
      }

      if (data) {
        setContractAddress(data.contract_address || '');
        setPumpFunLink(data.pumpfun_link || '');
        setSettingsId(data.id);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (settingsId) {
        // Update existing settings
        const { error } = await supabase
          .from('app_settings')
          .update({
            contract_address: contractAddress,
            pumpfun_link: pumpFunLink,
          })
          .eq('id', settingsId);

        if (error) throw error;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('app_settings')
          .insert({
            contract_address: contractAddress,
            pumpfun_link: pumpFunLink,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setSettingsId(data.id);
      }

      toast.success('Settings saved successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
            className="w-full bg-adam-pink hover:bg-adam-pink/90 text-white rounded-lg px-6 py-3 font-medium 
              transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Edit;

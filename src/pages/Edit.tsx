import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Logo from '@/components/Logo';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Validation schemas - basic validation only
const contractAddressSchema = z
  .string()
  .min(1, 'Contract address is required')
  .max(100, 'Contract address is too long');

const pumpFunLinkSchema = z
  .string()
  .min(1, 'Link is required')
  .max(2048, 'Link is too long');

const Edit: React.FC = () => {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState('');
  const [pumpFunLink, setPumpFunLink] = useState('');
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ contractAddress?: string; pumpFunLink?: string }>({});

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
    // Validate inputs
    const validationErrors: { contractAddress?: string; pumpFunLink?: string } = {};
    
    // Validate contract address
    const contractResult = contractAddressSchema.safeParse(contractAddress);
    if (!contractResult.success) {
      validationErrors.contractAddress = contractResult.error.errors[0].message;
    }
    
    // Validate pump.fun link
    const linkResult = pumpFunLinkSchema.safeParse(pumpFunLink);
    if (!linkResult.success) {
      validationErrors.pumpFunLink = linkResult.error.errors[0].message;
    }
    
    // If there are validation errors, show them and don't proceed
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      return;
    }
    
    setErrors({});
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
              onChange={(e) => {
                setContractAddress(e.target.value);
                setErrors(prev => ({ ...prev, contractAddress: undefined }));
              }}
              placeholder="Enter $CADAI contract address"
              maxLength={100}
              className={`w-full bg-adam-gray/40 border rounded-lg px-4 py-3 text-white 
                placeholder:text-white/40 focus:outline-none focus:border-adam-pink transition-colors
                ${errors.contractAddress ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.contractAddress && (
              <p className="mt-1 text-sm text-red-500">{errors.contractAddress}</p>
            )}
          </div>

          <div>
            <label htmlFor="pumpFunLink" className="block text-sm font-medium text-white/80 mb-2">
              Pump.fun Link
            </label>
            <input
              id="pumpFunLink"
              type="url"
              value={pumpFunLink}
              onChange={(e) => {
                setPumpFunLink(e.target.value);
                setErrors(prev => ({ ...prev, pumpFunLink: undefined }));
              }}
              placeholder="https://pump.fun/..."
              maxLength={2048}
              className={`w-full bg-adam-gray/40 border rounded-lg px-4 py-3 text-white 
                placeholder:text-white/40 focus:outline-none focus:border-adam-pink transition-colors
                ${errors.pumpFunLink ? 'border-red-500' : 'border-white/10'}`}
            />
            {errors.pumpFunLink && (
              <p className="mt-1 text-sm text-red-500">{errors.pumpFunLink}</p>
            )}
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

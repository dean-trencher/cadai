import React, { useState } from 'react';
import { ArrowUp, MessageSquare, Menu, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatConversation from '../components/chat/ChatConversation';
import ModelViewer from '../components/chat/ModelViewer';
import ParametersPanel from '../components/chat/ParametersPanel';
import ChatControls from '../components/chat/ChatControls';
import FeedbackModal from '../components/chat/FeedbackModal';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { useWalletDetection } from '@/hooks/useWalletDetection';
import { useModelParameters } from '@/hooks/useModelParameters';

// Import images
import laptopStandImage from '@/assets/laptop-stand-cad.jpg';
import candleStandImage from '@/assets/candle-stand-cad.jpg';
import legoBrickImage from '@/assets/lego-brick-cad.jpg';

const ProjectCard = ({
  title,
  imageSrc,
  onRemix
}: {
  title: string;
  imageSrc: string;
  onRemix: () => void;
}) => {
  return <div 
      onClick={onRemix}
      className="bg-adam-gray rounded-lg overflow-hidden cursor-pointer hover:bg-adam-gray/80 transition-colors"
    >
      <div className="h-40 flex items-center justify-center bg-adam-dark p-4">
        <img src={imageSrc} alt={title} className="max-h-full w-full object-contain" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-adam-pink flex items-center justify-center text-xs text-white">A</div>
          <span className="text-xs text-white/60">anonymous</span>
        </div>
      </div>
    </div>;
};

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [showConversation, setShowConversation] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string; content: string; isUser: boolean}>>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected, walletAddress } = useWalletDetection();
  const { parameters, updateParameter } = useModelParameters();

  const recentProjects = [{
    title: 'Jewelry Holder',
    imageSrc: '/lovable-uploads/af99a164-9ee9-4a6f-8b0a-947e590f5f3e.png'
  }, {
    title: 'Laptop Stand',
    imageSrc: laptopStandImage
  }, {
    title: 'Candle Stand',
    imageSrc: candleStandImage
  }, {
    title: 'LEGO Brick',
    imageSrc: legoBrickImage
  }, {
    title: 'Shelf Bracket',
    imageSrc: '/lovable-uploads/7973c816-d414-4bfa-b312-1407036a6e21.png'
  }, {
    title: 'Propeller Blade',
    imageSrc: '/lovable-uploads/e50ff5ee-d6a3-49e9-b666-e7f48dfdfb8b.png'
  }, {
    title: 'Ergonomic Spatula',
    imageSrc: '/lovable-uploads/6d9b54c2-64d4-44f3-959b-b0c71fff7a04.png'
  }, {
    title: 'Wall-Mounted key holder',
    imageSrc: '/lovable-uploads/c698cbec-dfee-4c2d-921b-5a2d0274ec33.png'
  }, {
    title: 'Toothbrush holder',
    imageSrc: '/lovable-uploads/af99a164-9ee9-4a6f-8b0a-947e590f5f3e.png'
  }, {
    title: 'Stamp',
    imageSrc: laptopStandImage
  }, {
    title: 'Basic Phone Stand',
    imageSrc: candleStandImage
  }, {
    title: 'Pencil Holder',
    imageSrc: legoBrickImage
  }];

  const handleNewChat = () => {
    setMessages([]);
    setShowConversation(false);
    setPrompt('');
    toast({
      title: "New Chat Started",
      description: "Ready to create something new!",
    });
  };

  const handleRemix = (title: string) => {
    const remixPrompt = `Create a variation of the ${title} with improved design`;
    setPrompt(remixPrompt);
    toast({
      title: "Project Remixed",
      description: `Starting remix of ${title}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      setIsLoading(true);
      const newMessage = {
        id: Date.now().toString(),
        content: prompt,
        isUser: true
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setShowConversation(true);
      setPrompt('');
      
      try {
        const response = await fetch('https://qayhwdfoofonllwwybgw.supabase.co/functions/v1/chat-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: updatedMessages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            }))
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

      const data = await response.json();
      
      // Parse 3D parameters from AI response
      try {
        // Try to parse as JSON directly first
        let parsed;
        try {
          parsed = JSON.parse(data.message);
        } catch {
          // If direct parse fails, try regex extraction
          const jsonMatch = data.message.match(/\{[\s\S]*?"parameters"[\s\S]*?\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          }
        }
        
        if (parsed?.parameters) {
          // Update model parameters
          Object.entries(parsed.parameters).forEach(([key, value]) => {
            updateParameter(key as keyof typeof parameters, value as number);
          });
          
          // Show only the description in chat
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            content: parsed.description || 'Object 3D berhasil dibuat',
            isUser: false
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          // No parameters, show raw message
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            content: data.message,
            isUser: false
          };
          setMessages(prev => [...prev, aiResponse]);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        // If all parsing fails, show the raw message
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: data.message || 'Gagal memproses response AI',
          isUser: false
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      } catch (error) {
        console.error('Error:', error);
        
        toast({
          title: "Error",
          description: error instanceof Error && error.message.includes('429') 
            ? "Rate limit tercapai. Silakan coba lagi dalam beberapa saat atau gunakan Lovable AI dengan Gemini (gratis sampai 6 Okt 2025)."
            : "Gagal mendapatkan response AI. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleNewMessage = async (message: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    try {
      const response = await fetch('https://qayhwdfoofonllwwybgw.supabase.co/functions/v1/chat-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Parse 3D parameters from AI response
      try {
        // Try to parse as JSON directly first
        let parsed;
        try {
          parsed = JSON.parse(data.message);
        } catch {
          // If direct parse fails, try regex extraction
          const jsonMatch = data.message.match(/\{[\s\S]*?"parameters"[\s\S]*?\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          }
        }
        
        if (parsed?.parameters) {
          // Update model parameters
          Object.entries(parsed.parameters).forEach(([key, value]) => {
            updateParameter(key as keyof typeof parameters, value as number);
          });
          
          // Show only the description in chat
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            content: parsed.description || 'Object 3D berhasil dibuat',
            isUser: false
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          // No parameters, show raw message
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            content: data.message,
            isUser: false
          };
          setMessages(prev => [...prev, aiResponse]);
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        // If all parsing fails, show the raw message
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: data.message || 'Gagal memproses response AI',
          isUser: false
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error && error.message.includes('429')
          ? "Rate limit tercapai. Silakan coba lagi dalam beberapa saat atau gunakan Lovable AI dengan Gemini (gratis sampai 6 Okt 2025)."
          : "Gagal mendapatkan response AI. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-adam-dark text-white overflow-hidden">
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
      
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-[192px]'} bg-adam-darker border-r border-white/10 flex flex-col transition-all duration-300`}>
        <div className="p-4">
          {!sidebarCollapsed && (
            <Link to="/" className="block mb-4">
              <Logo />
            </Link>
          )}
          <button 
            onClick={handleNewChat}
            className="w-full bg-transparent hover:bg-adam-gray/30 border border-adam-pink/30 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2 transition-colors mb-4"
          >
            <Plus size={16} />
            {!sidebarCollapsed && <span className="text-sm">New Chat</span>}
          </button>
          
          {!sidebarCollapsed && (
            <div className="py-2">
              <div className="flex items-center gap-2 text-white/60 hover:text-white py-1 px-2 rounded transition-colors">
                <MessageSquare size={16} />
                <span className="text-sm">Creations</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <button 
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 text-white/60 hover:text-white py-1 px-2 rounded transition-colors w-full"
          >
            <MessageSquare size={16} />
            {!sidebarCollapsed && <span className="text-sm">Feedback</span>}
          </button>
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-2 text-white/60 hover:text-white py-1 px-2 rounded transition-colors w-full"
          >
            <Menu size={16} />
            {!sidebarCollapsed && <span className="text-sm">Toggle Sidebar</span>}
          </button>
          
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 mt-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-adam-pink to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                {isConnected ? walletAddress?.slice(0, 2).toUpperCase() : 'AN'}
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-white">
                  {isConnected ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}` : 'Anonymous'}
                </span>
                <span className="text-white/60">
                  {isConnected ? 'Wallet Connected' : 'Not Connected'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConversation ? (
        <div className="flex-1 flex">
          <div className="w-64 border-r border-white/10 bg-adam-dark flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <path d="M7 7h.01M12 7h.01M17 7h.01"></path>
              </svg>
              <span className="font-medium text-white">Chat</span>
            </div>
            <ChatConversation messages={messages} />
            <ChatControls onSubmit={handleNewMessage} disabled={isLoading} />
          </div>
          <ModelViewer parameters={parameters} />
          <ParametersPanel 
            parameters={parameters}
            onParameterChange={updateParameter}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-y-auto pb-20">
          <div className="max-w-3xl mx-auto w-full px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">What can I help you build?</h1>
              <p className="text-white/70">Describe the 3D part you want to create and I'll help you build it.</p>
            </div>

            <form onSubmit={handleSubmit} className="mb-16">
              <div className="relative">
                <textarea 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)} 
                  placeholder="Describe an object..." 
                  className="w-full bg-adam-gray/50 border border-white/10 rounded-lg py-3 px-4 pr-12 min-h-[80px] text-white resize-none focus:outline-none focus:ring-1 focus:ring-adam-pink/50" 
                />
                <button 
                  type="submit" 
                  className="absolute bottom-3 right-3 bg-[#D946EF] rounded-md p-2 hover:bg-opacity-80 transition-colors"
                  aria-label="Submit"
                >
                  <ArrowUp size={16} className="text-white" />
                </button>
              </div>
            </form>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Recent Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentProjects.map((project, index) => (
                  <ProjectCard 
                    key={index} 
                    title={project.title} 
                    imageSrc={project.imageSrc} 
                    onRemix={() => handleRemix(project.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

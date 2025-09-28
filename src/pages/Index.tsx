import React, { useEffect, useRef } from 'react';
import { ArrowRight, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnnouncementBar from '@/components/AnnouncementBar';
import Logo from '@/components/Logo';
import ButtonPrimary from '@/components/ButtonPrimary';
import ButtonSecondary from '@/components/ButtonSecondary';
import ExampleChip from '@/components/ExampleChip';
import YCombinatorBadge from '@/components/YCombinatorBadge';
import SearchBar from '@/components/SearchBar';
import Interactive3DViewer from '@/components/Interactive3DViewer';
const Index = () => {
  const product3dRef = useRef<HTMLDivElement>(null);
  const deviceImageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (product3dRef.current && deviceImageRef.current) {
        const scrollPosition = window.scrollY;
        product3dRef.current.style.transform = `translateY(${scrollPosition * 0.05}px) rotate(${scrollPosition * 0.02}deg)`;
        deviceImageRef.current.style.transform = `translateY(${scrollPosition * -0.03}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <div className="flex flex-col min-h-screen bg-adam-darker text-white overflow-x-hidden">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center animate-fade-in">
        <Logo />
        <ButtonPrimary>GET IN TOUCH</ButtonPrimary>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient w-full pt-16 pb-24 px-4 md:px-8 lg:px-0 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Speak anything<br />into <span className="text-adam-pink">existence</span>
            </h1>
            <p className="mt-6 text-xl text-white/80">
              Generate CAD with AI in seconds.
            </p>
            <div className="mt-10">
              <Link to="/chat">
                <ButtonSecondary icon={true} className="group">
                  Try Adam Now
                </ButtonSecondary>
              </Link>
            </div>
            <YCombinatorBadge />
          </div>
          
          {/* Right Content - Floating 3D Cube */}
          <div className="lg:w-1/2 flex justify-center relative animate-fade-in">
            <div ref={product3dRef} className="relative animate-float w-full max-w-md">
              <div className="h-96 md:h-[400px]">
                <Interactive3DViewer simple={true} showColorPicker={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See Adam in Action Section */}
      <section className="w-full py-24 px-4">
        <div className="max-w-5xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">See Adam in action</h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Adam is the fastest to way to convert ideas into reality. Speak your prototypes into existence.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="bg-adam-gray/40 rounded-lg p-2 overflow-hidden animate-fade-in">
            <div ref={deviceImageRef} className="relative w-full aspect-video bg-[#1E1C20] rounded-md overflow-hidden">
              <div className="w-full h-10 bg-[#0F0E10] flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-white/60 text-xs">Adam Demo</div>
              </div>
              <div className="p-4">
                <Interactive3DViewer showColorPicker={true} />
              </div>
            </div>
          </div>
          <div className="absolute -left-4 -right-4 top-1/2 -translate-y-1/2 -z-10 h-40 bg-gradient-to-r from-adam-pink/30 via-transparent to-adam-pink/30 blur-3xl opacity-20"></div>
        </div>
      </section>

      {/* Build Anything Section */}
      <section className="w-full py-24 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">Build anything with natural language</h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Whether for industrial design or mechanical engineering, Adam brings ideas to life.
          </p>
        </div>
        
        <SearchBar />
        
        <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          <ExampleChip text="Mockup a camshaft for a 4 stroke engine" />
          <ExampleChip text="20-tooth spur gear with a 20° pressure angle, 2.5 mm pitch" />
          <ExampleChip text="Generate a wall mounted key holder" />
          <ExampleChip text="3D printable phone stand" />
          <ExampleChip text="Create a snap-fit case for an arduino nano" />
          <ExampleChip text="Make a toothbrush holder" />
          <ExampleChip text="Small desktop plant pot for succulents" />
          <ExampleChip text="Design a futuristic mug" />
          <ExampleChip text="Create an enclosure for a raspberry pi 4" />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-6 mb-6 md:mb-0">
            <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
              <Twitter size={18} />
              <span className="text-sm">@makewithdam</span>
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
              <Mail size={18} />
              <span className="text-sm">hello@adam.ai</span>
            </a>
          </div>
          <Logo />
        </div>
      </footer>
    </div>;
};
export default Index;
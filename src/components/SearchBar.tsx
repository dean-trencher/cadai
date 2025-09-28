
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

// Input validation schema
const searchSchema = z.object({
  query: z.string()
    .trim()
    .min(1, { message: "Please enter a design request" })
    .max(500, { message: "Request must be less than 500 characters" })
});

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate input
      const validatedData = searchSchema.parse({ query });
      
      // Navigate to chat with the query
      navigate('/chat', { 
        state: { 
          initialMessage: validatedData.query 
        } 
      });
      
      toast({
        title: "Starting design session",
        description: "Redirecting to CAD.ai chat...",
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Invalid input",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive", 
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center bg-adam-light-gray rounded-full p-1 pl-4 pr-1 glow-pink">
          <div className="flex items-center text-white/60 mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Start building with Adam..." 
            className="flex-grow bg-transparent text-white py-3 focus:outline-none"
            disabled={isSubmitting}
            maxLength={500}
          />
          <button 
            type="submit"
            disabled={isSubmitting || !query.trim()}
            className="bg-adam-pink rounded-full p-3 transition-all duration-300 hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight size={20} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

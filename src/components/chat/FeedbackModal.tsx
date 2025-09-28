import React from 'react';
import { X, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handleSubmitFeedback = (type: 'bug' | 'feature' | 'general') => {
    toast({
      title: "Feedback Sent",
      description: `Your ${type} feedback has been submitted. Thank you!`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-adam-gray border border-white/10 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Send Feedback</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => handleSubmitFeedback('bug')}
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <MessageSquare size={16} />
            Report a Bug
          </Button>
          
          <Button 
            onClick={() => handleSubmitFeedback('feature')}
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <Star size={16} />
            Request a Feature
          </Button>
          
          <Button 
            onClick={() => handleSubmitFeedback('general')}
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <MessageSquare size={16} />
            General Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
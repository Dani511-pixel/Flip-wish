import React, { useState, useEffect } from "react";
import { Message } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Download, X } from "lucide-react";
import MessageCard from "./MessageCard";
import { motion, AnimatePresence } from "framer-motion";

interface FlipbookPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: Message[];
  theme?: string;
}

const FlipbookPreview = ({ isOpen, onClose, title, messages, theme = "standard" }: FlipbookPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);

  const totalMessages = messages.length;
  const currentMessage = totalMessages > 0 ? messages[currentIndex] : null;

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalMessages - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === totalMessages - 1 ? 0 : prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play effect
  useEffect(() => {
    let interval: any = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, goToNext]);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        rotateY: direction > 0 ? 45 : -45
      };
    },
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        rotateY: direction < 0 ? 45 : -45
      };
    }
  };

  // Create a gradient based on theme
  const getGradient = () => {
    switch (theme) {
      case "premium":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "elegant":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      case "celebration":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-primary to-blue-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className={`text-white px-6 py-4 ${getGradient()}`}>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 bg-gray-50 flex justify-center items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4 text-gray-500 hover:text-primary"
              onClick={goToPrevious}
              disabled={totalMessages <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flip-card w-80 h-96 perspective-1000">
              <AnimatePresence initial={false} custom={direction}>
                {currentMessage && (
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="w-full h-full absolute"
                  >
                    <MessageCard message={currentMessage} isFlipbook={true} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Button 
              variant="ghost" 
              className="ml-4 text-gray-500 hover:text-primary"
              onClick={goToNext}
              disabled={totalMessages <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Card <span className="font-medium">{currentIndex + 1}</span> of <span className="font-medium">{totalMessages}</span>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAutoPlay}
              disabled={totalMessages <= 1}
            >
              <Play className="h-4 w-4 mr-1" />
              {isPlaying ? "Pause" : "Auto Play"}
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlipbookPreview;

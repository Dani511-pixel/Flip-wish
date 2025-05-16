import React, { useState, useEffect } from "react";
import { Message } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Pause, Download, X } from "lucide-react";
import MessageCard from "./MessageCard";

interface FlipbookPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  messages: Message[];
  theme?: string;
}

const FlipbookPreview = ({ isOpen, onClose, title, messages, theme = "standard" }: FlipbookPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 for cover page
  const [isPlaying, setIsPlaying] = useState(false);
  const [customTitle, setCustomTitle] = useState(title);
  const [customDate, setCustomDate] = useState(new Date().toLocaleDateString());

  const totalMessages = messages.length;
  const currentMessage = totalMessages > 0 && currentIndex >= 0 ? messages[currentIndex] : null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === -1 ? totalMessages - 1 : prev - 1));
  };

  const goToNext = () => {
    // Always move sequentially through messages
    if (currentIndex === -1) {
      // From cover page, always go to first message
      setCurrentIndex(0);
    } else if (currentIndex < totalMessages - 1) {
      // Move to next message
      setCurrentIndex(currentIndex + 1);
    } else {
      // From last message, go back to cover
      setCurrentIndex(-1);
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play effect - scroll through messages sequentially
  useEffect(() => {
    let interval: any = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        // Sequentially move through messages and then back to cover
        if (currentIndex === -1) {
          // Start at first message
          setCurrentIndex(0);
        } else if (currentIndex < totalMessages - 1) {
          // Go to next message
          setCurrentIndex(currentIndex + 1);
        } else {
          // Go back to cover
          setCurrentIndex(-1);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentIndex, totalMessages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90vw] max-w-4xl bg-white rounded-lg overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="bg-white text-gray-800 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            type="button"
            className="text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors duration-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 bg-gray-50 flex flex-col justify-center items-center flex-grow">
          <div className="flex items-center justify-center w-full">
            <button 
              type="button"
              className="mx-2 sm:mx-4 text-gray-500 hover:text-primary bg-white p-2 rounded hover:bg-gray-100 transition-colors duration-200 z-10"
              onClick={goToPrevious}
              disabled={currentIndex === -1 || totalMessages <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="w-64 sm:w-80 md:w-96 relative">
              {currentIndex === -1 ? (
                // Cover Page
                <Card className="overflow-hidden border border-gray-100 shadow-lg">
                  <CardContent className="p-4 h-full flex flex-col justify-between bg-white">
                    <div className="flex-grow flex flex-col items-center justify-center p-4">
                      <h1 className="text-4xl font-cursive font-bold text-center mb-4">
                        {customTitle}
                      </h1>
                      
                      {/* Decorative element with right arrow - fully centered */}
                      <div className="my-6 flex flex-col items-center w-full">
                        <div className="h-px w-40 bg-gray-200 relative mb-6">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary"></div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 text-center">Click to start</p>
                        <div 
                          className="text-center cursor-pointer mx-auto" 
                          onClick={goToNext}
                        >
                          <div className="animate-bounce mt-2 bg-primary text-white p-3 rounded-full mx-auto">
                            <ChevronRight className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Date section */}
                    <div className="border-t border-gray-200 pt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Created on {customDate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : currentMessage && (
                // Message Cards
                <MessageCard message={currentMessage} isFlipbook={true} />
              )}
            </div>
            
            <button 
              type="button"
              className="mx-2 sm:mx-4 z-10 bg-primary text-white p-2 rounded hover:bg-primary/90 transition-colors duration-200"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Footer controls */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentIndex === -1 ? (
              <span>Cover Page</span>
            ) : (
              <>Card <span className="font-medium">{currentIndex + 1}</span> of <span className="font-medium">{totalMessages}</span></>
            )}
          </div>
          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={toggleAutoPlay}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-300 bg-white hover:bg-gray-100"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isPlaying ? "Pause" : "Auto Play"}</span>
            </button>
            <button 
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded bg-primary text-white hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipbookPreview;
import React, { useState, useEffect } from "react";
import { Message } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Download, X, Book } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(-1); // Start at -1 for cover page
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState(title);
  const [titleFont, setTitleFont] = useState("cursive");
  const [titleSize, setTitleSize] = useState("4xl");
  const [editingDate, setEditingDate] = useState(false);
  const [customDate, setCustomDate] = useState(new Date().toLocaleDateString());

  const totalMessages = messages.length;
  const currentMessage = totalMessages > 0 ? messages[currentIndex] : null;

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === -1 ? totalMessages - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    
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
  
  // Font options
  const fontOptions = [
    { value: "serif", label: "Serif" },
    { value: "sans", label: "Sans" },
    { value: "mono", label: "Monospace" },
    { value: "cursive", label: "Cursive" }
  ];
  
  // Font size options
  const fontSizes = [
    { value: "lg", label: "Small" },
    { value: "xl", label: "Medium" },
    { value: "2xl", label: "Large" },
    { value: "4xl", label: "Extra Large" }
  ];

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
          setDirection(1);
          setCurrentIndex(0);
        } else if (currentIndex < totalMessages - 1) {
          // Go to next message
          setDirection(1);
          setCurrentIndex(currentIndex + 1);
        } else {
          // Go back to cover
          setDirection(-1);
          setCurrentIndex(-1);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentIndex, totalMessages]);

  const variants = {
    enter: (direction: number) => {
      return {
        x: 1000, // Always enter from right
        opacity: 0,
        rotateY: 25,
        scale: 0.9
      };
    },
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    exit: (direction: number) => {
      return {
        x: -1000, // Always exit to left
        opacity: 0,
        rotateY: -25,
        scale: 0.9
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
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden" aria-describedby="flipbook-description">
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
            {currentIndex !== -1 && (
              <Button 
                variant="ghost" 
                className="mr-4 text-gray-500 hover:text-primary"
                onClick={goToPrevious}
                disabled={totalMessages <= 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            
            <div className="flip-card w-80 h-96 perspective-1000">
              <AnimatePresence initial={false} custom={direction}>
                {currentIndex === -1 ? (
                  // Cover Page
                  <motion.div
                    key="cover"
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
                    <Card className="h-full overflow-hidden border border-gray-100 shadow-lg">
                      <CardContent className="p-4 h-full flex flex-col justify-between bg-white">
                        <div className="flex-grow flex flex-col items-center justify-center p-4">
                          {editingTitle ? (
                            <div className="space-y-4 w-full">
                              <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                className="w-full p-2 border rounded text-center"
                                autoFocus
                              />
                              <div className="flex justify-between gap-2">
                                <select 
                                  value={titleFont}
                                  onChange={(e) => setTitleFont(e.target.value)}
                                  className="flex-1 p-2 border rounded text-sm"
                                >
                                  {fontOptions.map(font => (
                                    <option key={font.value} value={font.value}>{font.label}</option>
                                  ))}
                                </select>
                                <select 
                                  value={titleSize}
                                  onChange={(e) => setTitleSize(e.target.value)}
                                  className="flex-1 p-2 border rounded text-sm"
                                >
                                  {fontSizes.map(size => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                  ))}
                                </select>
                              </div>
                              <Button 
                                onClick={() => setEditingTitle(false)}
                                className="w-full" 
                                size="sm"
                              >
                                Save Title
                              </Button>
                            </div>
                          ) : (
                            <h1 
                              className={`text-${titleSize} font-${titleFont === 'mono' ? 'mono' : titleFont === 'sans' ? 'sans' : titleFont === 'cursive' ? 'cursive' : 'serif'} font-bold text-center mb-4 cursor-pointer`}
                              onClick={() => setEditingTitle(true)}
                            >
                              {customTitle}
                            </h1>
                          )}
                          
                          {/* Decorative element with right arrow */}
                          <div className="my-6 flex flex-col items-center">
                            <div className="h-px w-40 bg-gray-200 relative mb-6">
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary"></div>
                            </div>
                            <div className="text-center">
                              <div className="animate-bounce mt-2 bg-primary text-white p-3 rounded-full">
                                <ChevronRight className="h-6 w-6" />
                              </div>
                              <p className="text-sm text-gray-500 mt-2">Click to start</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Date section */}
                        <div className="border-t border-gray-200 pt-4 text-center">
                          {editingDate ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="w-full p-2 border rounded text-center text-sm"
                                autoFocus
                              />
                              <Button 
                                onClick={() => setEditingDate(false)}
                                className="w-full" 
                                size="sm"
                              >
                                Save Date
                              </Button>
                            </div>
                          ) : (
                            <p 
                              className="text-sm text-gray-600 cursor-pointer"
                              onClick={() => setEditingDate(true)}
                            >
                              Created on {customDate}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : currentMessage && (
                  // Message Cards
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
              variant="default" 
              className="ml-4"
              onClick={goToNext}
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

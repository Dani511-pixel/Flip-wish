import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SimpleDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const demoMessages = [
    {
      id: 1,
      fromName: "Emma Johnson",
      content: "You've been the most inspiring friend I've ever had. Thank you for making everything so special!"
    },
    {
      id: 2,
      fromName: "Alex Thompson",
      content: "Your kindness and generosity never cease to amaze me. You've made such a positive impact on everyone around you!"
    },
    {
      id: 3,
      fromName: "Michael Rodriguez",
      content: "Thanks for always being there when I needed someone to talk to. Your friendship means the world to me."
    },
    {
      id: 4,
      fromName: "Sophia Wong",
      content: "Your passion and enthusiasm are contagious! You inspire me to be a better person every day."
    }
  ];

  const totalPages = demoMessages.length + 2; // Cover, welcome, messages, promo

  const goToNext = () => {
    setDirection(1);
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
      
      // Show confetti when going from cover to welcome
      if (currentIndex === -1) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    } else {
      setCurrentIndex(-1); // Loop back to cover
    }
  };

  const goToPrevious = () => {
    setDirection(-1);
    if (currentIndex > -1) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalPages - 1); // Loop to the end
    }
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Render the appropriate content based on currentIndex
  const renderContent = () => {
    if (currentIndex === -1) {
      // Welcome message (First page)
      return (
        <Card className="overflow-hidden border border-gray-100 shadow-lg">
          <CardContent className="p-6 h-full flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-semibold text-center text-primary mb-4">Welcome to your FlipWish!</h2>
            <p className="text-center mb-4">
              You've been sent a FlipWish. Your friends, colleagues or team mates have got together to share their wishes for you today.
            </p>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Use the arrows on either side to navigate through your messages</p>
              <div 
                className="text-center cursor-pointer mx-auto" 
                onClick={goToNext}
              >
                <div className="animate-bounce mt-2 bg-primary text-white p-3 rounded-full mx-auto">
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else if (currentIndex === 0) {
      // Title page (Cover)
      return (
        <Card className="overflow-hidden border border-gray-100 shadow-lg">
          <CardContent className="p-4 h-full flex flex-col justify-between bg-white">
            <div className="flex-grow flex flex-col items-center justify-center p-4">
              <div className="bg-primary/10 px-4 py-2 rounded-md mb-6">
                <h3 className="text-primary text-lg font-medium">FlipWish Book</h3>
              </div>
              <h1 className="text-4xl font-bold text-center mb-4">
                Your Special Day
              </h1>
              
              {/* Decorative element */}
              <div className="my-6 flex flex-col items-center w-full">
                <div className="h-px w-40 bg-gray-200 relative mb-6">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary"></div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 text-center">
              <p className="text-sm text-gray-600">
                Created on {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    } else if (currentIndex <= demoMessages.length) {
      // Message pages
      const message = demoMessages[currentIndex - 1];
      return (
        <Card className="overflow-hidden border border-gray-100 shadow-lg">
          <CardContent className="p-6 h-full flex flex-col bg-white">
            <div className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4">
              <p className="text-center text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 mb-2 sm:mb-4">
                "{message.content}"
              </p>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-end">
              <div className="font-bold text-sm text-primary">
                From: {message.fromName}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Promo page (last page)
      return (
        <Card className="overflow-hidden border border-gray-100 shadow-lg">
          <CardContent className="p-6 h-full flex flex-col justify-center items-center bg-white">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">
              Do you know someone who deserves a FlipWish?
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Create a special memory collection for someone in your life.
            </p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Start Your Own FlipWish
            </a>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">FlipWish Book Demo</h1>
      <p className="mb-6">Click the button below to see the FlipWish book with animated page transitions.</p>
      
      <Button onClick={() => setIsOpen(true)} className="mb-8">
        Open FlipWish Book
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {showConfetti && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-confetti-1 absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="animate-confetti-2 absolute top-0 left-1/3 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="animate-confetti-3 absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="animate-confetti-4 absolute top-0 left-2/3 w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="animate-confetti-5 absolute top-0 left-3/4 w-2 h-2 bg-pink-500 rounded-full"></div>
                <div className="animate-confetti-6 absolute top-0 left-1/5 w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="animate-confetti-7 absolute top-0 left-4/5 w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          )}
          
          <div className="w-[90vw] max-w-4xl bg-white rounded-lg overflow-hidden flex flex-col shadow-xl">
            {/* Header */}
            <div className="bg-white text-gray-800 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Special Day</h2>
              <button 
                type="button"
                className="text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors duration-200"
                onClick={() => setIsOpen(false)}
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
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <div className="w-64 sm:w-80 md:w-96 relative overflow-hidden perspective-[1000px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      initial={{
                        opacity: 0,
                        rotateY: direction > 0 ? 15 : -15,
                        x: direction > 0 ? 100 : -100,
                      }}
                      animate={{
                        opacity: 1,
                        rotateY: 0,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        rotateY: direction > 0 ? -15 : 15,
                        x: direction > 0 ? -100 : 100,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="w-full origin-center"
                    >
                      {renderContent()}
                    </motion.div>
                  </AnimatePresence>
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
                ) : currentIndex === 0 ? (
                  <span>Welcome Page</span>
                ) : currentIndex > demoMessages.length ? (
                  <span>Final Page</span>
                ) : (
                  <>Message <span className="font-medium">{currentIndex}</span> of <span className="font-medium">{demoMessages.length}</span></>
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
      )}
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">About This Demo</h2>
        <p className="mb-4">
          This is a simplified demonstration of the FlipWish book with:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Animated 3D page transitions when navigating</li>
          <li>Confetti animation when opening the book</li>
          <li>Welcome message as the first thing you see</li>
          <li>Auto-play functionality</li>
          <li>Navigation buttons that remain visible</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleDemo;
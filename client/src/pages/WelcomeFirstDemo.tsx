import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define CSS for confetti animation
const confettiStyles = `
  @keyframes fall {
    from {
      transform: translateY(-10px) rotate(0deg);
      opacity: 1;
    }
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

const WelcomeFirstDemo = () => {
  // State for the flipbook
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // No confetti on initial open - we'll show it when going to the title page instead
  
  // Sample messages for the demo
  const messages = [
    {
      id: 1,
      content: "You've been the most inspiring friend I've ever had. Thank you for making everything so special!",
      fromName: "Emma Johnson"
    },
    {
      id: 2,
      content: "Your kindness and generosity never cease to amaze me. You've made such a positive impact on everyone around you!",
      fromName: "Alex Thompson"
    },
    {
      id: 3,
      content: "Thanks for always being there when I needed someone to talk to. Your friendship means the world to me.",
      fromName: "Michael Rodriguez"
    },
    {
      id: 4,
      content: "Your passion and enthusiasm are contagious! You inspire me to be a better person every day.",
      fromName: "Sophia Wong"
    }
  ];
  
  // Get total number of pages: welcome, title, messages, promo
  const totalPages = messages.length + 3;
  
  // Play audio when navigating
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPageFlipSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };
  
  // Auto-play effect
  useEffect(() => {
    let interval = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        goToNext();
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentPage]);
  
  // Navigation functions
  const goToNext = () => {
    setDirection(1);
    playPageFlipSound();
    
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      
      // Show confetti when going to title page (from welcome message)
      if (currentPage === 0) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    } else {
      setCurrentPage(0); // Loop back to the start
    }
  };
  
  const goToPrevious = () => {
    setDirection(-1);
    playPageFlipSound();
    
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(totalPages - 1); // Loop to the end
    }
  };
  
  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Get current page content based on index
  const renderPageContent = () => {
    // 0: Welcome message (first)
    // 1: Title/campaign page
    // 2 to messages.length+1: Message pages
    // Last page: Promo page
    
    if (currentPage === 0) {
      // Welcome Message (First Page users see)
      return (
        <Card className="overflow-hidden border border-gray-100 shadow-lg">
          <CardContent className="p-6 h-full flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-semibold text-center text-primary mb-4">Welcome to your FlipWish!</h2>
            <p className="text-center mb-4">
              You've been sent a FlipWish. Your friends, colleagues or team mates have got together to share their wishes for you today.
            </p>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500 mb-4">Use the arrows on either side to navigate through your messages</p>
            </div>
          </CardContent>
        </Card>
      );
    } else if (currentPage === 1) {
      // Title/Campaign Page (Second page)
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
    } else if (currentPage >= 2 && currentPage < messages.length + 2) {
      // Message pages
      const messageIndex = currentPage - 2;
      const message = messages[messageIndex];
      
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
      // Promotional page (last page)
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
  
  // Get current page name for the footer
  const getCurrentPageName = () => {
    if (currentPage === 0) {
      return "Welcome Page";
    } else if (currentPage === 1) {
      return "Title Page";
    } else if (currentPage >= 2 && currentPage < messages.length + 2) {
      return `Message ${currentPage - 1} of ${messages.length}`;
    } else {
      return "Final Page";
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Add style element for confetti animation */}
      <style dangerouslySetInnerHTML={{ __html: confettiStyles }} />
      
      <h1 className="text-3xl font-bold mb-6">FlipWish Book Demo</h1>
      <p className="mb-4">This demo shows the FlipWish book with the welcome message appearing first, followed by the title page.</p>
      <p className="mb-6">The navigation buttons (Auto Play and Download) remain visible at all times for easy access.</p>
      
      <Button onClick={() => setIsOpen(true)} className="mb-8">
        Open FlipWish Book
      </Button>
      
      {/* Audio element for very subtle page flip sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2619/2619-preview.mp3" preload="auto">
        Your browser does not support the audio element.
      </audio>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Confetti effect */}
          {showConfetti && (
            <div className="fixed inset-0 z-50 pointer-events-none flex">
              {/* Falling confetti pieces */}
              {[...Array(50)].map((_, i) => {
                const size = Math.random() * 10 + 5;
                const color = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 6)];
                const left = `${Math.random() * 100}%`;
                const animationDuration = `${Math.random() * 3 + 2}s`;
                const animationDelay = `${Math.random() * 2}s`;
                
                return (
                  <div 
                    key={i}
                    className={`absolute top-0 ${color} rounded-full`}
                    style={{
                      left,
                      width: `${size}px`,
                      height: `${size}px`,
                      animation: `fall ${animationDuration} ease-in forwards`,
                      animationDelay
                    }}
                  />
                );
              })}
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
                      key={currentPage}
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
                      {renderPageContent()}
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
                {getCurrentPageName()}
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
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Welcome message appears first, followed by the title page</li>
          <li>3D animated page transitions with perspective effect</li>
          <li>Plays a page turning sound effect when navigating</li>
          <li>Confetti animation when first opening the book</li>
          <li>Auto-play feature with play/pause control</li>
          <li>Clear display of who each message is from</li>
          <li>Navigation controls always visible and accessible</li>
        </ul>
      </div>
    </div>
  );
};

export default WelcomeFirstDemo;
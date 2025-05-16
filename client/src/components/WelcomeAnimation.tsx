import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WelcomeAnimationProps {
  username: string;
  onDismiss: () => void;
}

export const WelcomeAnimation = ({ username, onDismiss }: WelcomeAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 6 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Small delay before calling the parent's onDismiss to allow exit animation to complete
    setTimeout(onDismiss, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="relative max-w-md p-8 mx-4 bg-white rounded-lg shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200 
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleDismiss}
            >
              <X size={18} />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="mb-2 text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to FlipWish
              </h1>
              
              <motion.h2 
                className="mb-6 text-xl font-medium text-center text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Hello, {username}!
              </motion.h2>
              
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ 
                  delay: 0.9,
                  type: "spring",
                  damping: 10, 
                  stiffness: 100
                }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                  {username.charAt(0).toUpperCase()}
                </div>
              </motion.div>
              
              <motion.p 
                className="mb-6 text-center text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Get ready to create beautiful flipbooks filled with messages from friends and loved ones.
              </motion.p>
              
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  onClick={handleDismiss}
                >
                  Let's Get Started
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
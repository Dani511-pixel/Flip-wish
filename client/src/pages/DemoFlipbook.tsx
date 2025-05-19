import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FlipbookPreview from "@/components/FlipbookPreview";
import { ArrowLeft, Book } from "lucide-react";
import { useLocation } from "wouter";

// Sample demo messages
const demoMessages = [
  {
    id: 1,
    content: "You've been the most inspiring friend I've ever had. Thank you for making everything so special!",
    fromName: "Emma Johnson",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    collectionId: 1,
    hasVoice: null,
    voiceUrl: null
  },
  {
    id: 2,
    content: "Your kindness and generosity never cease to amaze me. You've made such a positive impact on everyone around you!",
    fromName: "Alex Thompson",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    collectionId: 1,
    hasVoice: null,
    voiceUrl: null
  },
  {
    id: 3,
    content: "Thanks for always being there when I needed someone to talk to. Your friendship means the world to me.",
    fromName: "Michael Rodriguez",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    collectionId: 1,
    hasVoice: null,
    voiceUrl: null
  },
  {
    id: 4,
    content: "Your passion and enthusiasm are contagious! You inspire me to be a better person every day.",
    fromName: "Sophia Wong",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    collectionId: 1,
    hasVoice: null,
    voiceUrl: null
  }
];

const DemoFlipbook = () => {
  const [, navigate] = useLocation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">FlipWish Demo Book</h1>
            <div className="text-gray-500 mt-1">
              <p>See the animated page turn effect in action!</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button onClick={() => setIsPreviewOpen(true)}>
              <Book className="mr-2 h-4 w-4" />
              View FlipWish Book
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">About This Demo</h2>
        <p className="mb-4">
          This is a demonstration of the FlipWish book with animated page turning effects. Click "View FlipWish Book" to see:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Animated 3D page transitions when navigating</li>
          <li>Page flip sound effects</li>
          <li>Confetti animation when opening the book</li>
          <li>Auto-play functionality</li>
          <li>Responsive design that works on all devices</li>
        </ul>
        <p>
          The navigation buttons (Auto Play and Download) remain visible at all times for easy access.
        </p>
      </div>

      {/* Flipbook Preview Modal */}
      <FlipbookPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Your Special Day"
        messages={demoMessages}
        theme="standard"
      />
    </div>
  );
};

export default DemoFlipbook;
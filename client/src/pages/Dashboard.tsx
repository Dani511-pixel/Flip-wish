import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import MessageCard from "@/components/MessageCard";
import FlipbookCard from "@/components/FlipbookCard";
import CounterCard from "@/components/CounterCard";
import { Plus } from "lucide-react";
import { MessageCollection, Flipbook, Message } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [activeCollection, setActiveCollection] = useState<number | null>(null);
  
  // Fetch user's collections
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["/api/collections"],
  });
  
  const collections: (MessageCollection & { messageCount: number })[] = collectionsData?.collections || [];
  
  // Fetch user's flipbooks
  const { data: flipbooksData, isLoading: isLoadingFlipbooks } = useQuery({
    queryKey: ["/api/flipbooks"],
  });
  
  const flipbooks: Flipbook[] = flipbooksData?.flipbooks || [];
  
  // Fetch messages for active collection
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/collections", activeCollection, "messages"],
    queryFn: async () => {
      if (!activeCollection) return { messages: [] };
      const res = await fetch(`/api/collections/${activeCollection}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: activeCollection !== null,
  });
  
  const messages: Message[] = messagesData?.messages || [];
  
  // Create flipbook mutation
  const createFlipbook = useMutation({
    mutationFn: async ({ collectionId, title, theme }: { collectionId: number; title: string; theme: string }) => {
      const res = await apiRequest("POST", "/api/flipbooks", { collectionId, title, theme });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flipbooks"] });
      toast({
        title: "Flipbook created!",
        description: "Your new flipbook has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to create flipbook",
        description: "Could not create your flipbook. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleCreateFlipbook = (collectionId: number) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      createFlipbook.mutate({
        collectionId: collection.id,
        title: collection.title,
        theme: "standard"
      });
    }
  };
  
  // If collection is selected, fetch and show messages
  const handleViewMessages = (collectionId: number) => {
    setActiveCollection(collectionId);
  };
  
  // Loading state
  if (isLoadingCollections) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // No collections state
  if (collections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to FlipWish!</h2>
          <p className="text-gray-600 mb-6">You haven't created any message collections yet.</p>
          <Link href="/create-collection">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" /> Create Your First Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Your Dashboard</h1>
        <p className="text-gray-500">Manage your message collection and create flipbooks</p>
      </div>

      {/* Active Collection */}
      {activeCollection ? (
        <CounterCard
          collection={collections.find(c => c.id === activeCollection) as (MessageCollection & { messageCount: number })}
        />
      ) : collections.length > 0 && (
        <CounterCard collection={collections[0]} />
      )}

      {/* Recent Messages */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-dark">Recent Messages</h2>
          {collections.length > 1 && (
            <div className="flex space-x-2">
              {collections.map(collection => (
                <Button 
                  key={collection.id}
                  variant={activeCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewMessages(collection.id)}
                >
                  {collection.title}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {isLoadingMessages ? (
          <div className="text-center py-10">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-sm text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.slice(0, 6).map(message => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No messages yet for this collection.</p>
            <p className="text-sm text-gray-500 mt-2">Share your collection link to start receiving messages!</p>
          </div>
        )}
      </div>

      {/* Your Flipbooks */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-dark">Your Flipbooks</h2>
          <Link href="/create-collection">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Existing Flipbooks */}
          {isLoadingFlipbooks ? (
            <div className="col-span-3 text-center py-10">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2 text-sm text-gray-600">Loading flipbooks...</p>
            </div>
          ) : (
            <>
              {flipbooks.slice(0, 2).map(flipbook => (
                <FlipbookCard 
                  key={flipbook.id} 
                  flipbook={{
                    ...flipbook,
                    messageCount: messages.length
                  }} 
                />
              ))}
              
              {/* Create New Flipbook Card */}
              <div 
                className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col justify-center items-center p-6 hover:bg-gray-100 transition cursor-pointer"
                onClick={() => activeCollection && handleCreateFlipbook(activeCollection)}
              >
                <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-primary mb-1">Start New Collection</h3>
                <p className="text-gray-500 text-sm text-center">
                  Create a new message collection for your special occasion
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Premium Features */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-dark">Premium Features</h2>
          <Button variant="link">See All Features</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Premium Feature 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-lg">
                  <span className="text-purple-600 font-accent font-semibold">Premium Design</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Luxury Themes</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upgrade to premium themes with elegant animations and custom designs.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Now</Button>
            </div>
          </div>
          
          {/* Premium Feature 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-lg">
                  <span className="text-primary font-accent font-semibold">Voice Messages</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Voice Notes</h3>
              <p className="text-gray-600 text-sm mb-4">
                Allow contributors to record voice messages that will be transcribed and playable.
              </p>
              <Button className="w-full">Upgrade Now</Button>
            </div>
          </div>
          
          {/* Premium Feature 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-lg">
                  <span className="text-amber-600 font-accent font-semibold">Print Service</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Physical Flipbooks</h3>
              <p className="text-gray-600 text-sm mb-4">
                Turn your digital flipbook into a physical keepsake delivered to your door.
              </p>
              <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

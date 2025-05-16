import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Share2, 
  Plus, 
  Clock, 
  Download,
  Copy,
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Sample data for the dashboard demo
const mockCollections = [
  {
    id: 1,
    title: "End of School Year Memories",
    type: "end-of-school",
    status: "active",
    slug: "end-of-school-2023",
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    messageCount: 42,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: 2,
    title: "Championship Basketball Team",
    type: "sporting-season",
    status: "active",
    slug: "basketball-champs-2023",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    messageCount: 18,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  }
];

const mockMessages = [
  {
    id: 1,
    content: "You've been the most inspiring teacher I've ever had. Thank you for making our final year so special!",
    fromName: "Emma Johnson",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    collectionId: 1
  },
  {
    id: 2,
    content: "Mrs. Smith, you've made math fun and engaging all year. I never thought I'd enjoy algebra, but you changed that!",
    fromName: "Alex Thompson",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    collectionId: 1
  },
  {
    id: 3,
    content: "Thanks for all the extra help during study hall. It really made a difference in my grades and confidence.",
    fromName: "Michael Rodriguez",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    collectionId: 1
  },
  {
    id: 4,
    content: "Your passion for science is contagious! The frog dissection was gross but also the coolest thing we did all year.",
    fromName: "Sophia Wong",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    collectionId: 1
  },
  {
    id: 5,
    content: "Coach, your dedication to our team is what got us through the season. Thanks for pushing us to be our best!",
    fromName: "Jason Miller",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    collectionId: 2
  },
  {
    id: 6,
    content: "Thank you for teaching us that winning isn't everything. The life lessons you've shared are what I'll remember most.",
    fromName: "Tyler Adams",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    collectionId: 2
  }
];

const Dashboard = () => {
  const { toast } = useToast();
  const [activeCollection, setActiveCollection] = useState(1); // Default to first collection
  
  // Filter messages for the active collection
  const activeCollectionMessages = mockMessages.filter(
    message => message.collectionId === activeCollection
  );
  
  // Get the current collection details
  const currentCollection = mockCollections.find(
    collection => collection.id === activeCollection
  );
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Copy link to clipboard
  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/submit/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Share this link to collect messages.",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <p className="text-gray-500">Manage your message collections and create flipbooks</p>
      </div>
      
      {/* Active Collection Stats */}
      {currentCollection && (
        <Card className="mb-8 overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentCollection.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {calculateDaysRemaining(currentCollection.deadline)} days remaining
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {currentCollection.messageCount}
                  </div>
                  <div className="text-sm text-gray-600">Messages collected</div>
                </div>
                <Button onClick={() => navigate(`/flipbook/1`)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Flipbook
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Collection Link</h3>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-50 rounded-l-md py-2 px-3 border border-r-0 border-gray-200 truncate text-sm">
                    {window.location.origin}/submit/{currentCollection.slug}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="rounded-l-none" 
                    onClick={() => copyLink(currentCollection.slug)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                
                {/* Social Sharing Buttons */}
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Share On</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-[#1DA1F2] hover:bg-[#1a94df] text-white hover:text-white border-transparent"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/submit/${currentCollection.slug}`)}&text=${encodeURIComponent(`Contribute to my ${currentCollection.title} message collection!`)}`, '_blank')}
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-[#3b5998] hover:bg-[#344e86] text-white hover:text-white border-transparent"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/submit/${currentCollection.slug}`)}`, '_blank')}
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-[#25D366] hover:bg-[#1fba57] text-white hover:text-white border-transparent"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Contribute to my ${currentCollection.title} message collection! ${window.location.origin}/submit/${currentCollection.slug}`)}`, '_blank')}
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </Button>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white hover:text-white border-transparent"
                      onClick={() => {
                        copyLink(currentCollection.slug);
                        toast({
                          title: "Instagram Link Copied",
                          description: "Link copied to clipboard. Paste in your Instagram bio or message."
                        });
                      }}
                    >
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      Instagram
                    </Button>

                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <p className="text-sm">{formatDate(currentCollection.createdAt)}</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Deadline</h3>
                  <p className="text-sm">{formatDate(currentCollection.deadline)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tab Navigation */}
      <Tabs defaultValue="messages" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          {mockCollections.length > 0 && (
            <div className="flex space-x-2 mb-4">
              {mockCollections.map(collection => (
                <Button 
                  key={collection.id}
                  variant={activeCollection === collection.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCollection(collection.id)}
                >
                  {collection.title}
                </Button>
              ))}
            </div>
          )}
          
          {activeCollectionMessages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCollectionMessages.map(message => (
                <Card key={message.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="font-medium text-primary text-sm">
                          {message.fromName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate mb-1">{message.fromName}</p>
                        <p className="text-gray-600 text-sm">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                Share your collection link with friends and family to start receiving messages.
              </p>
              <Button onClick={() => copyLink(currentCollection?.slug || "")}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Collection Link
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Message Collections</h2>
            <Link href="/create-collection">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCollections.map(collection => (
              <Card key={collection.id} className={`overflow-hidden ${activeCollection === collection.id ? 'border-primary' : ''}`}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{collection.title}</CardTitle>
                  <CardDescription className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Deadline: {formatDate(collection.deadline)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-gray-50">
                      {collection.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {collection.messageCount} messages
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, (collection.messageCount / 50) * 100)} 
                    className="h-2 mb-2" 
                  />
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button 
                    variant={activeCollection === collection.id ? "default" : "outline"}
                    size="sm" 
                    className="flex-1"
                    onClick={() => setActiveCollection(collection.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => copyLink(collection.slug)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Premium Features Teaser */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Premium Features</h2>
          <Button variant="link">See All Features</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">Premium Themes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customize your flipbook with beautiful premium designs and animations.
              </p>
              <Button className="w-full">Upgrade Now</Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <div className="rounded-full h-16 w-16 bg-white/20 flex items-center justify-center">
                <div className="rounded-full h-8 w-8 bg-white flex items-center justify-center">
                  <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">Voice Messages</h3>
              <p className="text-sm text-gray-600 mb-4">
                Allow contributors to record voice messages with automatic transcription.
              </p>
              <Button className="w-full">Upgrade Now</Button>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <Download className="h-12 w-12 text-white" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">Physical Copy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get a beautifully printed physical copy of your digital flipbook.
              </p>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
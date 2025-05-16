import { useState } from "react";
import { Link } from "wouter";
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
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {currentCollection.messageCount}
                </div>
                <div className="text-sm text-gray-600">Messages collected</div>
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
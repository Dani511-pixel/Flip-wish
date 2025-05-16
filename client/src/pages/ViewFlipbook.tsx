import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FlipbookPreview from "@/components/FlipbookPreview";
import MessageCard from "@/components/MessageCard";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Book, Calendar, MessageSquare, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ViewFlipbookProps = {
  id: number;
};

const ViewFlipbook = ({ id }: ViewFlipbookProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/flipbooks/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/flipbooks/${id}`);
      if (!res.ok) throw new Error("Failed to fetch flipbook");
      return res.json();
    },
  });

  const flipbook = data?.flipbook;
  const messages = data?.messages || [];

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your flipbook is being prepared for download.",
    });
    // This would normally trigger a download of the flipbook
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-gray-600">Loading flipbook...</p>
      </div>
    );
  }

  if (error || !flipbook) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error instanceof Error ? error.message : "Flipbook not found"}
        </div>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="outline" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark">{flipbook.title}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Created on {formatDate(flipbook.createdAt)}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button onClick={() => setIsPreviewOpen(true)}>
              <Book className="mr-2 h-4 w-4" />
              View Flipbook
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Messages</h2>
              <p className="text-gray-500 text-sm">
                {messages.length} message{messages.length !== 1 ? "s" : ""} in this flipbook
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {messages.length > 0 ? (
              messages.map((message: any) => (
                <MessageCard key={message.id} message={message} />
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No messages in this flipbook yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Flipbook Preview Modal */}
      <FlipbookPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={flipbook.title}
        messages={messages}
        theme={flipbook.theme}
      />

      {/* Premium Upgrade Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-dark mb-4">Enhance Your Flipbook</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-lg">
                  <span className="text-purple-600 font-semibold">Premium Theme</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Upgrade to Premium Theme</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enhance your flipbook with elegant animations and premium designs.
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-500 relative overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-lg">
                  <span className="text-primary font-semibold">Voice Messages</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Add Voice Message Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Let contributors record voice messages with automatic transcription.
              </p>
              <Button className="w-full">
                Enable Voice Messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewFlipbook;

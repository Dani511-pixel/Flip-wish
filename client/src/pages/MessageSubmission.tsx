import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitMessageSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MicOff, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { formatDeadline } from "@/lib/utils";

type MessageSubmissionProps = {
  slug: string;
};

type FormData = {
  content: string;
  fromName: string;
};

const MessageSubmission = ({ slug }: MessageSubmissionProps) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { data: collectionData, isLoading: isLoadingCollection } = useQuery({
    queryKey: [`/api/collections/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/collections/${slug}`);
      if (!res.ok) throw new Error("Collection not found");
      return res.json();
    },
  });

  const collection = collectionData?.collection;
  const isDeadlinePassed = collection && new Date() > new Date(collection.deadline);

  const form = useForm<FormData>({
    resolver: zodResolver(submitMessageSchema),
    defaultValues: {
      content: "",
      fromName: "",
    },
  });

  const submitMessage = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", `/api/collections/${slug}/messages`, data);
      return res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Message submitted!",
        description: "Your message has been added to the collection.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMessage.mutate(data);
  };
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentContent = form.getValues("content");
    form.setValue("content", currentContent + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoadingCollection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
        <p className="mt-4 text-gray-600">Loading message form...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          This message collection link is invalid or has been removed.
        </div>
      </div>
    );
  }

  if (isDeadlinePassed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded mb-4">
          This message collection has closed. The deadline was {formatDeadline(collection.deadline)}.
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded mb-8">
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p>Thank you for leaving a message. It's already making its way to its forever home in {collection.title} FlipWish book.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Submit Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">
          Leave a Message for {collection.title}
        </h1>
        <p className="text-gray-500">
          Your message will be added to a special flipbook that will be available after{" "}
          {formatDeadline(collection.deadline)}.
        </p>
      </div>

      {/* Message Form */}
      <Card className="bg-white rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          placeholder="Write your wishes or message here..."
                          className="min-h-[120px] pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 bottom-3 text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-5 w-5" />
                      </button>
                      
                      {showEmojiPicker && (
                        <div 
                          ref={emojiPickerRef}
                          className="absolute z-10 right-0 bottom-12 shadow-xl rounded-lg"
                        >
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={320}
                            height={400}
                            searchPlaceHolder="Search emojis..."
                            previewConfig={{ showPreview: false }}
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative pl-10 mb-6">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <MicOff className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-gray-500">
                  Want to record a voice message?{" "}
                  <a href="#" className="text-primary font-medium">
                    Upgrade the flipbook
                  </a>{" "}
                  to enable voice recording.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={submitMessage.isPending}>
                  {submitMessage.isPending ? "Submitting..." : "Submit Message"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Celebration Graphics */}
      <div className="mt-12 text-center">
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="h-24 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
              alt="Birthday greeting card"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-24 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://pixabay.com/get/g2e05a4510e896d52a3e538dbd3abdbb906f05d4e6f020063204c8c08c99ca185fb244f262a5ebe133b74aa1af3ee9b333427be8c75c77bfb6a1455bae5618c02_1280.jpg"
              alt="Celebration greeting card"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-24 bg-gray-100 rounded-lg overflow-hidden shadow-sm">
            <img
              src="https://pixabay.com/get/g66a5f5b91dd13dee7a8cb4305b0ae72bda6621ad775b9429907cb19fa7ee66031bf52bd4ea83598b1bfb736317f78281790eaf31e57896484d76175383bf4fdf_1280.jpg"
              alt="Thank you greeting card"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Join others in celebrating this special occasion with heartfelt messages.
        </p>
      </div>
    </div>
  );
};

export default MessageSubmission;

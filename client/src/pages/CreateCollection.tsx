import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Share2, QrCode } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().optional(),
  deadline: z.string().min(1, {
    message: "Please select a deadline date",
  }),
  type: z.enum(["birthday", "wedding", "graduation", "retirement", "anniversary", "end-of-school", "christmas", "sporting-season", "funeral", "leaving", "get-well", "other"]),
  collectionType: z.enum(["standard", "premium"]),
  messageGoal: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

type FormData = z.infer<typeof formSchema>;

const CreateCollection = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // Default to 14 days from now
  const [isCreated, setIsCreated] = useState(false);
  const [collectionLink, setCollectionLink] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: date?.toISOString() || "",
      type: "end-of-school",
      collectionType: "standard",
      messageGoal: undefined
    },
  });

  const onSubmit = (data: FormData) => {
    // In a real app, we would send this to the server
    console.log("Form submitted with data:", data);
    
    // For demo purposes, we'll just simulate a successful creation
    setTimeout(() => {
      // Generate a random slug
      const slug = Math.random().toString(36).substring(2, 10);
      setCollectionLink(`${window.location.origin}/submit/${slug}`);
      setIsCreated(true);
      
      toast({
        title: "Collection created!",
        description: "Your new message collection has been created successfully.",
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(collectionLink);
    toast({
      title: "Link copied!",
      description: "Share this link with your friends and family to collect messages.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your next FlipWish book</h1>
        <p className="text-gray-600">Start a FlipWish and collect meaningful messages from team members, classes and friends. Transform them into a beautiful flipbook and make someone's day.</p>
      </div>

      {!isCreated ? (
        <Card className="border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="text-2xl">Set up your FlipWish</CardTitle>
            <CardDescription>
              Tell us about who you're celebrating and what the occasion is. Set a deadline and send for free or upgrade for an extra special FlipWish experience. 
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Birthday Wishes for David" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be displayed to message contributors
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Help me celebrate my 30th birthday by sharing your favorite memory of us!"
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add context to help people know what to write
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occasion Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="end-of-school">End of School Year</option>
                            <option value="sporting-season">End of Sporting Season</option>
                            <option value="birthday">Birthday</option>
                            <option value="wedding">Wedding</option>
                            <option value="graduation">Graduation</option>
                            <option value="retirement">Retirement</option>
                            <option value="anniversary">Anniversary</option>
                            <option value="christmas">Christmas</option>
                            <option value="funeral">Funeral</option>
                            <option value="leaving">Leaving</option>
                            <option value="get-well">Get Well Soon</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Collection Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                field.onChange(selectedDate?.toISOString() || "");
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Messages can be submitted until this date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>



                <Tabs defaultValue="standard" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="text-base">Collection Plan</FormLabel>
                    <TabsList>
                      <TabsTrigger value="standard">Free</TabsTrigger>
                      <TabsTrigger value="premium" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:text-white data-[state=active]:text-white data-[state=active]:bg-gradient-to-r">Premium</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="standard" className="mt-0">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">Standard Plan</h3>
                            <p className="text-sm text-gray-500">Basic flipbook with text messages</p>
                          </div>
                          <p className="text-lg font-bold">Free</p>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Collect unlimited text messages
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Shareable link and QR code
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Standard flipbook design
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="premium" className="mt-0">
                    <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-purple-700">Premium Plan</h3>
                            <p className="text-sm text-purple-600">Enhanced flipbook with voice messages</p>
                          </div>
                          <p className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">Coming Soon</p>
                        </div>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-purple-800">All free features plus:</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Voice message recording
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Audio playback in flipbook
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Premium design templates
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Priority support
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <FormField
                  control={form.control}
                  name="collectionType"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="premium" id="premium" disabled />
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-800 font-medium">Important</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Messages can be collected until your deadline date. After that, you'll be able to create your flipbook.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full py-6 text-base"
                >
                  Create Collection
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-center">Your Collection is Ready!</CardTitle>
            <CardDescription className="text-center">
              Share the link below with friends and family to start collecting messages
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center border">
              <input 
                type="text" 
                value={collectionLink} 
                className="bg-transparent flex-1 border-none focus:outline-none text-gray-800"
                readOnly
              />
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-primary"
              >
                <Share2 className="h-4 w-4" />
                Copy
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Share Options</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </Button>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                  </Button>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.615 4.304l-3.712 17.443C19.737 22.461 19.208 23 18.425 23c-.271 0-.566-.075-.871-.229L12 18.801l-2.986 2.969a1.35 1.35 0 01-.914.393c-.23 0-.446-.064-.644-.173-.198-.109-.352-.26-.462-.453-.109-.194-.164-.386-.164-.578L7.327 15l9.935-5.905-12.243 7.855L1.175 15.13c-.51-.16-.877-.395-1.097-.704-.219-.31-.258-.661-.116-1.055L.334 12.582c.119-.324.34-.574.664-.75.324-.176.661-.242 1.014-.196l21.038 3.355c.433.057.729.196.886.417.158.221.177.48.059.776z"/>
                    </svg>
                    Telegram
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                <QrCode className="h-16 w-16 text-primary mb-2" />
                <h3 className="font-medium text-center">QR Code</h3>
                <p className="text-sm text-center text-gray-500 mb-2">Perfect for in-person events</p>
                <Button size="sm" variant="outline">Download QR Code</Button>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">What's Next?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                  <span>Share your link with friends and family to start collecting messages</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                  <span>Monitor your submissions in the dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                  <span>After your deadline, create your flipbook with the collected messages</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full sm:w-auto">Go to Homepage</Button>
            <Button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">View Dashboard</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CreateCollection;

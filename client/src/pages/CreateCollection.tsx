import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollectionSchema } from "@shared/schema";
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
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormData = {
  title: string;
  deadline: string;
  type: string;
  goal?: string;
};

const CreateCollection = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 7 days from now

  const form = useForm<FormData>({
    resolver: zodResolver(createCollectionSchema.extend({
      goal: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      type: z.string().default("standard")
    })),
    defaultValues: {
      title: "",
      deadline: date?.toISOString() || "",
      type: "standard",
      goal: ""
    },
  });

  const createCollection = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/collections", {
        ...data,
        goal: data.goal ? parseInt(data.goal) : undefined
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
      toast({
        title: "Collection created!",
        description: "Your new message collection has been created successfully.",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create collection",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createCollection.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Message Collection</CardTitle>
          <CardDescription>
            Set up a new message collection for a special occasion
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Message Collection Deadline</FormLabel>
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

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Goal (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Set a target number of messages to collect
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Collection Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="font-normal">
                            Standard (Free)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="premium" id="premium" disabled />
                          <Label htmlFor="premium" className="font-normal text-gray-500">
                            Premium with voice messages (Coming soon)
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={createCollection.isPending}
              >
                {createCollection.isPending ? "Creating..." : "Create Collection"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-sm text-gray-600">
            After creating, you'll get a shareable link and QR code
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateCollection;

 'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.string().optional(),
  link: z.string().url('Please enter a valid URL').min(1, 'Link is required'),
});

export default function CreateChallenge() {
  const createChallenge = useMutation(api.challenges.createChallenge);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: '',
      link: '',
    },
  });

  const watchedTitle = form.watch('title');
  const watchedDescription = form.watch('description');
  const watchedLink = form.watch('link');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await createChallenge({
        title: values.title,
        description: values.description,
        difficulty: values.difficulty,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        link: values.link,
      });
      form.reset();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error(error);
      // Could add a proper error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-6 py-8">
        {/* Success Message */}
        {isSuccess && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-medium">Challenge created successfully!</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl outline outline-1 outline-border/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create New Challenge</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Challenge Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Two Sum Problem, Reverse Linked List"
                            className="h-12 text-base border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1 text-xs">
                          <Lightbulb size={12} className="text-amber-500" />
                          Choose a clear, descriptive title that explains the problem
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   {/* Description Field */}
                   <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-base font-semibold">
                           Description
                         </FormLabel>
                         <FormControl>
                           <Textarea
                             placeholder="Describe the problem statement, input/output requirements, constraints, and provide examples..."
                             className="min-h-[140px] text-base border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50 resize-none"
                             {...field}
                           />
                         </FormControl>
                         <FormDescription className="flex items-center gap-1 text-xs">
                           <Lightbulb size={12} className="text-amber-500" />
                           Include problem statement, examples, and any hints or constraints
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                   {/* Link Field */}
                   <FormField
                     control={form.control}
                     name="link"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel className="text-base font-semibold">
                           Challenge Link
                         </FormLabel>
                         <FormControl>
                           <Input
                             placeholder="https://leetcode.com/problems/two-sum/"
                             className="h-12 text-base border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50"
                             {...field}
                           />
                         </FormControl>
                         <FormDescription className="flex items-center gap-1 text-xs">
                           <Lightbulb size={12} className="text-amber-500" />
                           Link to the original problem on LeetCode, HackerRank, or similar platforms
                         </FormDescription>
                         <FormMessage />
                       </FormItem>
                     )}
                   />

                  {/* Tags and Difficulty Row */}
                  <div className="grid md:grid-cols-3 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-base font-semibold">Tags</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="array, sorting, algorithm, string"
                              className="h-12 border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="flex items-center gap-1 text-xs">
                            <Lightbulb size={12} className="text-amber-500" />
                            Use relevant tags to help others find your challenge
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1 md:mt-2 md:ml-8">
                          <FormLabel className="text-base font-semibold">Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-border/50 focus:border-primary/50 transition-all duration-200 bg-background/50 ml-2.5">
                                <SelectValue placeholder="Select difficulty">
                                  {field.value ? (
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                        field.value === 'easy' ? 'bg-green-500' :
                                        field.value === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}></div>
                                      <span className="capitalize font-medium">{field.value}</span>
                                    </div>
                                  ) : (
                                    "Select difficulty"
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                                  <div>
                                    <div className="font-medium">Easy</div>
                                    <div className="text-xs text-muted-foreground">Beginner-friendly problems</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                                  <div>
                                    <div className="font-medium">Medium</div>
                                    <div className="text-xs text-muted-foreground">Moderate complexity</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="hard">
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                                  <div>
                                    <div className="font-medium">Hard</div>
                                    <div className="text-xs text-muted-foreground">Advanced problem-solving</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !form.formState.isValid}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Challenge...
                        </>
                      ) : (
                        <>
                          <Plus size={20} />
                          Create Challenge
                        </>
                      )}
                    </Button>

                     {/* Form Status */}
                     <div className="mt-4 text-center">
                       <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                         <span className={`flex items-center gap-1 ${watchedTitle.length > 0 ? 'text-green-600' : ''}`}>
                           <div className={`w-2 h-2 rounded-full ${watchedTitle.length > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                           Title
                         </span>
                         <span className={`flex items-center gap-1 ${watchedDescription.length >= 10 ? 'text-green-600' : ''}`}>
                           <div className={`w-2 h-2 rounded-full ${watchedDescription.length >= 10 ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                           Description
                         </span>
                         <span className={`flex items-center gap-1 ${watchedLink.length > 0 ? 'text-green-600' : ''}`}>
                           <div className={`w-2 h-2 rounded-full ${watchedLink.length > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                           Link
                         </span>
                         <span className={`flex items-center gap-1 ${form.formState.isValid ? 'text-green-600' : ''}`}>
                           <div className={`w-2 h-2 rounded-full ${form.formState.isValid ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                           Ready
                         </span>
                       </div>
                     </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

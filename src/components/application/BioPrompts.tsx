
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const bioPromptsSchema = z.object({
  hobbies: z.string().min(1, "Please tell us about your hobbies"),
  pets: z.string().min(1, "Please tell us about your pets"),
  // occupation: z.string().min(1, "Please tell us about your occupation"),
  lifestyle: z.string().min(1, "Please tell us about your lifestyle"),
});

type BioPromptsValues = z.infer<typeof bioPromptsSchema>;

interface BioPromptsProps {
  onPromptsSubmit: (data: BioPromptsValues) => void;
  initialData?: Partial<BioPromptsValues>;
}

export default function BioPrompts({ onPromptsSubmit, initialData }: BioPromptsProps) {
  const form = useForm<BioPromptsValues>({
    resolver: zodResolver(bioPromptsSchema),
    defaultValues: {
      hobbies: initialData?.hobbies || "",
      pets: initialData?.pets || "",
      // occupation: initialData?.occupation || "",
      lifestyle: initialData?.lifestyle || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onPromptsSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="hobbies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are your hobbies and interests?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about activities you enjoy in your free time..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have any pets? Tell us about them.</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type of pets, their ages, breed..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*         <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you do for work?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your current job, how long you've been there..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="lifestyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tell us about your lifestyle</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your typical daily routine, work schedule, social activities..."
                  className="h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

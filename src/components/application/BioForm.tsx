import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BioPrompts from "./BioPrompts";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";

const bioFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  move_in_date: z.date().optional(),
  profile_image: z.string().optional(),
  prompts: z.record(z.any()).optional(),
});

type BioFormValues = z.infer<typeof bioFormSchema>;

interface BioFormProps {
  onSubmit: (data: BioFormValues) => void;
  initialData?: Partial<BioFormValues>;
}

export default function BioForm({ onSubmit, initialData }: BioFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [promptsData, setPromptsData] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<BioFormValues>({
    resolver: zodResolver(bioFormSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      bio: initialData?.bio || "",
      move_in_date: initialData?.move_in_date || new Date(),
      profile_image: initialData?.profile_image || "",
      prompts: initialData?.prompts || {},
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: BioFormValues) => {
    try {
      const bioInfo = {
        ...data,
        profile_image: profileImage,
        prompts: promptsData,
      };

      onSubmit(bioInfo);
      toast({
        title: "Success",
        description: "Your bio information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save bio information",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

      <div className="mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2">
            {profileImage ? (
              <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-sm">No Image</span>
            )}
          </div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-file block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                {...form.register("first_name")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                {...form.register("last_name")}
                required
              />
            </div>
          </div>

{/*           <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell us a bit about yourself..."
            />
          </div> */}

          <div className="space-y-2">
            <Label>Preferred Move-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("move_in_date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("move_in_date") ? format(form.watch("move_in_date"), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={form.watch("move_in_date")}
                  onSelect={(date) => form.setValue("move_in_date", date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Tell Us About Yourself</h3>
            <BioPrompts onPromptsSubmit={setPromptsData} />
          </div>

          <Button type="submit" className="w-full" disabled={!promptsData}>
            Save and Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

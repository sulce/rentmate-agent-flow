import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileUp, Download, CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the schema for OREA Form 410
const oreaFormSchema = z.object({
  // Basic application info
  date: z.date().optional(),
  rental_address: z.string().min(1, "Address is required"),
  start_day: z.string().min(1, "Day is required"),
  start_month: z.string().min(1, "Month is required"),
  start_year: z.string().min(1, "Year is required"),
  monthly_rent: z.string().min(1, "Monthly rent is required"),
  due_day: z.string().min(1, "Due day is required"),

  // Primary applicant
  applicant1_name: z.string().min(1, "Name is required"),
  applicant1_dob: z.date().optional(),
  applicant1_sin: z.string().optional(),
  applicant1_license: z.string().optional(),
  applicant1_occupation: z.string().optional(),

  // Secondary applicant
  applicant2_name: z.string().optional(),
  applicant2_dob: z.date().optional(),
  applicant2_sin: z.string().optional(),
  applicant2_license: z.string().optional(),
  applicant2_occupation: z.string().optional(),

  // Other occupants
  occupant1_name: z.string().optional(),
  occupant1_relationship: z.string().optional(),
  occupant1_age: z.string().optional(),
  occupant2_name: z.string().optional(),
  occupant2_relationship: z.string().optional(),
  occupant2_age: z.string().optional(),
  occupant3_name: z.string().optional(),
  occupant3_relationship: z.string().optional(),
  occupant3_age: z.string().optional(),

  // Pets
  has_pets: z.boolean().default(false),
  pets_description: z.string().optional(),
  vacating_reason: z.string().optional(),

  // Residence history
  residence1_address: z.string().optional(),
  residence1_from: z.date().optional(),
  residence1_to: z.date().optional(),
  residence1_landlord: z.string().optional(),
  residence1_phone: z.string().optional(),

  residence2_address: z.string().optional(),
  residence2_from: z.date().optional(),
  residence2_to: z.date().optional(),
  residence2_landlord: z.string().optional(),
  residence2_phone: z.string().optional(),

  // Employment info - Primary applicant
  employment1_occupation: z.string().optional(),
  employment1_employer: z.string().optional(),
  employment1_address: z.string().optional(),
  employment1_phone: z.string().optional(),
  employment1_position: z.string().optional(),
  employment1_length: z.string().optional(),
  employment1_supervisor: z.string().optional(),
  employment1_salary: z.string().optional(),

  prior_employment1_occupation: z.string().optional(),
  prior_employment1_employer: z.string().optional(),
  prior_employment1_address: z.string().optional(),
  prior_employment1_phone: z.string().optional(),
  prior_employment1_position: z.string().optional(),
  prior_employment1_length: z.string().optional(),
  prior_employment1_supervisor: z.string().optional(),
  prior_employment1_salary: z.string().optional(),

  // Employment info - Spouse/Secondary applicant
  employment2_occupation: z.string().optional(),
  employment2_employer: z.string().optional(),
  employment2_address: z.string().optional(),
  employment2_phone: z.string().optional(),
  employment2_position: z.string().optional(),
  employment2_length: z.string().optional(),
  employment2_supervisor: z.string().optional(),
  employment2_salary: z.string().optional(),

  prior_employment2_occupation: z.string().optional(),
  prior_employment2_employer: z.string().optional(),
  prior_employment2_address: z.string().optional(),
  prior_employment2_phone: z.string().optional(),
  prior_employment2_position: z.string().optional(),
  prior_employment2_length: z.string().optional(),
  prior_employment2_supervisor: z.string().optional(),
  prior_employment2_salary: z.string().optional(),

  // Banking info
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  bank_address: z.string().optional(),
  chequing_account: z.string().optional(),
  savings_account: z.string().optional(),

  // Financial obligations
  obligation1_to: z.string().optional(),
  obligation1_amount: z.string().optional(),
  obligation2_to: z.string().optional(),
  obligation2_amount: z.string().optional(),

  // References
  reference1_name: z.string().optional(),
  reference1_address: z.string().optional(),
  reference1_phone: z.string().optional(),
  reference1_acquaintance: z.string().optional(),
  reference1_occupation: z.string().optional(),

  reference2_name: z.string().optional(),
  reference2_address: z.string().optional(),
  reference2_phone: z.string().optional(),
  reference2_acquaintance: z.string().optional(),
  reference2_occupation: z.string().optional(),

  // Automobiles
  auto1_make: z.string().optional(),
  auto1_model: z.string().optional(),
  auto1_year: z.string().optional(),
  auto1_license: z.string().optional(),

  auto2_make: z.string().optional(),
  auto2_model: z.string().optional(),
  auto2_year: z.string().optional(),
  auto2_license: z.string().optional(),

  // Consent and signature
  consent: z.boolean().default(false),
});

type OREAFormValues = z.infer<typeof oreaFormSchema>;

interface OREAFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function OREAForm({ onSubmit, initialData }: OREAFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("digital");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialData?.uploaded_file_name || null
  );

  // Set up form with default values or initial data
  const form = useForm<OREAFormValues>({
    resolver: zodResolver(oreaFormSchema),
    defaultValues: initialData?.digital_form_data || {
      date: new Date(),
      has_pets: false,
      consent: false,
    }
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verify file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, JPG, or PNG file.",
          variant: "destructive",
        });
        return;
      }

      // Verify file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      setFileName(file.name);
    }
  };

  // Handle upload form submission
  const handleUploadSubmit = () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      type: "uploaded",
      file: uploadedFile,
      file_name: fileName,
      uploaded_at: new Date().toISOString(),
    });

    toast({
      title: "Form uploaded",
      description: "Your OREA Form 410 has been uploaded successfully.",
    });
  };

  // Handle digital form submission
  const onDigitalFormSubmit = (data: OREAFormValues) => {
    if (!data.consent) {
      toast({
        title: "Consent required",
        description: "Please check the consent box at the bottom of the form.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      type: "digital",
      digital_form_data: data,
      completed_at: new Date().toISOString(),
    });

    toast({
      title: "Form submitted",
      description: "Your OREA Form 410 has been submitted successfully.",
    });
  };

  // Download blank form
  const downloadBlankForm = () => {
    // Assuming you have a PDF in your public assets folder
    window.open("/assets/OREA_Form_410.pdf", "_blank");
  };

  // Continuing from Part 1
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">OREA Form 410 - Rental Application</h2>
      <p className="text-gray-600">
        The Ontario Real Estate Association Form 410 is required for your rental application.
        You can either upload a completed form or fill it out digitally.
      </p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload Completed Form</TabsTrigger>
          <TabsTrigger value="digital">Fill Form Digitally</TabsTrigger>
        </TabsList>

        {/* Upload Form Option */}
        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileUp className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload your completed and signed OREA Form 410
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: PDF, JPG, PNG (max 5MB)
                  </p>

                  <div>
                    <Input
                      id="orea-form-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Label htmlFor="orea-form-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        Select File
                      </Button>
                    </Label>
                  </div>

                  {fileName && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                      <span className="text-sm text-gray-700 truncate max-w-[300px]">
                        {fileName}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileName(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={downloadBlankForm}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Blank Form
                  </Button>
                  <Button
                    onClick={handleUploadSubmit}
                    disabled={!uploadedFile}
                  >
                    Submit Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Form Option */}
        <TabsContent value="digital">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onDigitalFormSubmit)} className="space-y-8">
                  {/* Form Header & Date */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Rental Application Form</h3>
                    <div className="w-44">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Application for Rental */}
                  <div className="space-y-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="rental_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I/We hereby make application to rent</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Rental property address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="w-16">
                        <FormField
                          control={form.control}
                          name="start_day"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>from the</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Day" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-32">
                        <FormField
                          control={form.control}
                          name="start_month"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>day of</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Month" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-20">
                        <FormField
                          control={form.control}
                          name="start_year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>, 20</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="YY" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-32">
                        <FormField
                          control={form.control}
                          name="monthly_rent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>at a monthly rent of $</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Amount" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="w-16">
                        <FormField
                          control={form.control}
                          name="due_day"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>to become due and payable in advance on the</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Day" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-auto">
                        <span>day of each and every month during my tenancy.</span>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Information Sections */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Primary Applicant */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-4">1. Primary Applicant</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="applicant1_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant1_dob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
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
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant1_sin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Social Insurance No.</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Optional" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant1_license"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver's License No.</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Optional" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant1_occupation"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Current Occupation" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Secondary Applicant */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-4">2. Co-Applicant (if applicable)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="applicant2_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full Name (Optional)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant2_dob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
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
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant2_sin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Social Insurance No.</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Optional" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant2_license"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver's License No.</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Optional" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="applicant2_occupation"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Occupation</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Current Occupation (Optional)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other Occupants */}
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">3. Other Occupants</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`occupant${index}_name` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Full Name (Optional)" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`occupant${index}_relationship` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Child, Parent" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`occupant${index}_age` as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Age" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pets and Moving Reason */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="has_pets"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Do you have any pets?</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch("has_pets") && (
                      <FormField
                        control={form.control}
                        name="pets_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>If so, describe</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Type, breed, size, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="vacating_reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why are you vacating your present place of residence?</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Please explain"
                              className="resize-none h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Rest of the form sections (can be expanded as needed) */}

                  {/* Previous Residence and Employment information would go here */}

                  {/* Banking, References, and Vehicle information would go here */}

                  {/* Consent Checkbox */}
                  <div className="border-t pt-6">
                    <FormField
                      control={form.control}
                      name="consent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I/We hereby certify that the information provided in this application is true and complete. I/We authorize the landlord or their agent to obtain such credit and personal reports as deemed necessary in connection with this application. I/We understand that any false information may result in the rejection of this application.
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit">Submit Application</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
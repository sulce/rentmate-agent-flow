
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SignatureCanvas from "@/components/application/SignatureCanvas";

// Form validation schema
const formSchema = z.object({
  // Applicant Information
  applicantName: z.string().min(1, "Applicant name is required"),
  applicantAddress: z.string().min(1, "Applicant address is required"),
  applicantPhone: z.string().min(1, "Phone number is required"),
  applicantEmail: z.string().email("Invalid email address"),
  
  // Rental Property
  rentalAddress: z.string().min(1, "Rental property address is required"),
  unitNumber: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  
  // Lease Details
  leaseType: z.enum(["fixed", "month-to-month"]),
  leaseStartDate: z.string().min(1, "Lease start date is required"),
  leaseEndDate: z.string().optional(),
  rentalAmount: z.string().min(1, "Rental amount is required"),
  paymentFrequency: z.enum(["monthly", "bi-weekly", "weekly"]),
  
  // Utilities and Services
  utilities: z.object({
    electricity: z.boolean().default(false),
    heat: z.boolean().default(false),
    water: z.boolean().default(false),
    cable: z.boolean().default(false),
    internet: z.boolean().default(false),
    other: z.boolean().default(false),
  }),
  
  // Deposits
  firstMonthRent: z.boolean().default(true),
  lastMonthRent: z.boolean().default(true),
  securityDeposit: z.boolean().default(false),
  keyDeposit: z.boolean().default(false),
  
  // Additional Information
  additionalTerms: z.string().optional(),
  
  // Signature (handled separately)
  agreementAccepted: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to continue",
  }),
});

type OREAFormValues = z.infer<typeof formSchema>;

interface OREAForm410Props {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initialValues?: Partial<OREAFormValues>;
}

export default function OREAForm410({ 
  onSubmit, 
  isSubmitting = false, 
  initialValues 
}: OREAForm410Props) {
  const [activeTab, setActiveTab] = useState("applicant");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<OREAFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      leaseType: "fixed",
      paymentFrequency: "monthly",
      utilities: {
        electricity: false,
        heat: false,
        water: false,
        cable: false,
        internet: false,
        other: false,
      },
      firstMonthRent: true,
      lastMonthRent: true,
      securityDeposit: false,
      keyDeposit: false,
      agreementAccepted: false,
    },
  });
  
  const handleFormSubmit = (data: OREAFormValues) => {
    if (!signatureData) {
      form.setError("agreementAccepted", { 
        type: "manual", 
        message: "Signature is required" 
      });
      return;
    }
    
    // Combine form data with signature
    const formData = {
      ...data,
      signature: signatureData,
    };
    
    onSubmit(formData);
  };
  
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };
  
  return (
    <div className="animate-in fade-in duration-500">
      {previewMode ? (
        <div className="bg-white p-8 border border-gray-300 rounded-md mb-6">
          <FormPreview formData={form.getValues()} signatureData={signatureData} />
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={togglePreview} className="mr-2">
              Return to Edit
            </Button>
            <Button 
              onClick={form.handleSubmit(handleFormSubmit)} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">ONTARIO REAL ESTATE ASSOCIATION</h1>
              <h2 className="text-xl font-semibold mt-2">
                Residential Rental Application (Form 410)
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                © 2023 Ontario Real Estate Association
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="applicant">Applicant</TabsTrigger>
                <TabsTrigger value="property">Property</TabsTrigger>
                <TabsTrigger value="lease">Lease</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
                <TabsTrigger value="signature">Signature</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applicant" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="applicantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicant Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="applicantEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="applicantAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="applicantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("property")}>
                    Next: Property Details
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="property" className="space-y-6">
                <FormField
                  control={form.control}
                  name="rentalAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Property Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="unitNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Number (if applicable)</FormLabel>
                        <FormControl>
                          <Input placeholder="Unit #" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ON">Ontario</SelectItem>
                            <SelectItem value="BC">British Columbia</SelectItem>
                            <SelectItem value="AB">Alberta</SelectItem>
                            <SelectItem value="QC">Quebec</SelectItem>
                            <SelectItem value="MB">Manitoba</SelectItem>
                            <SelectItem value="SK">Saskatchewan</SelectItem>
                            <SelectItem value="NS">Nova Scotia</SelectItem>
                            <SelectItem value="NB">New Brunswick</SelectItem>
                            <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                            <SelectItem value="PE">Prince Edward Island</SelectItem>
                            <SelectItem value="YT">Yukon</SelectItem>
                            <SelectItem value="NT">Northwest Territories</SelectItem>
                            <SelectItem value="NU">Nunavut</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("applicant")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("lease")}>
                    Next: Lease Details
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="lease" className="space-y-6">
                <FormField
                  control={form.control}
                  name="leaseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lease Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <label htmlFor="fixed">Fixed Term</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="month-to-month" id="month-to-month" />
                            <label htmlFor="month-to-month">Month-to-Month</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="leaseStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("leaseType") === "fixed" && (
                    <FormField
                      control={form.control}
                      name="leaseEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rentalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rental Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Frequency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("property")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("terms")}>
                    Next: Terms & Conditions
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="terms" className="space-y-6">
                <div className="border border-gray-200 rounded-md p-6 space-y-6">
                  <h3 className="font-semibold text-lg">Utilities and Services</h3>
                  <p className="text-sm text-gray-600">Select which utilities and services are included in the rent:</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="utilities.electricity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Electricity</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="utilities.heat"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Heat</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="utilities.water"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Water</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="utilities.cable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Cable TV</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="utilities.internet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Internet</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="utilities.other"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Other</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-6 space-y-6">
                  <h3 className="font-semibold text-lg">Deposits Required</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstMonthRent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>First Month's Rent</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastMonthRent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Last Month's Rent</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="securityDeposit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Security Deposit</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="keyDeposit"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Key Deposit</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="additionalTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Terms and Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional terms or conditions..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any additional agreements or conditions not covered above.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("lease")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("signature")}>
                    Next: Signature
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signature" className="space-y-6">
                <div className="border border-gray-200 rounded-md p-6">
                  <h3 className="font-semibold text-lg mb-4">Signature</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    By signing below, I certify that all information provided is true and correct to the best of my knowledge.
                  </p>
                  
                  <div className="mb-6">
                    <p className="font-medium mb-2">Sign below:</p>
                    <SignatureCanvas 
                      onChange={setSignatureData} 
                      existingSignature={signatureData}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="agreementAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I confirm that all information provided is accurate and complete. I understand that providing false information may result in the rejection of my application.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("terms")}>
                    Back
                  </Button>
                  <div>
                    <Button type="button" variant="outline" onClick={togglePreview} className="mr-2">
                      Preview Form
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !form.formState.isValid || !signatureData}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      )}
    </div>
  );
}

// A preview component to show what the form will look like as a PDF
function FormPreview({ formData, signatureData }: { formData: any, signatureData: string | null }) {
  return (
    <div className="bg-white p-6 border border-gray-200 rounded-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">ONTARIO REAL ESTATE ASSOCIATION</h1>
        <h2 className="text-xl font-semibold mt-2">
          Residential Rental Application (Form 410)
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          © 2023 Ontario Real Estate Association
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Applicant Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Applicant Name</p>
              <p>{formData.applicantName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{formData.applicantEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Address</p>
              <p>{formData.applicantAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p>{formData.applicantPhone}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Rental Property</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Rental Property Address</p>
              <p>{formData.rentalAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Unit Number</p>
              <p>{formData.unitNumber || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">City</p>
              <p>{formData.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Province</p>
              <p>{formData.province}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Postal Code</p>
              <p>{formData.postalCode}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Lease Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Lease Type</p>
              <p>{formData.leaseType === "fixed" ? "Fixed Term" : "Month-to-Month"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lease Start Date</p>
              <p>{formData.leaseStartDate}</p>
            </div>
            {formData.leaseType === "fixed" && (
              <div>
                <p className="text-sm font-medium text-gray-500">Lease End Date</p>
                <p>{formData.leaseEndDate || "N/A"}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-500">Rental Amount</p>
              <p>${formData.rentalAmount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Frequency</p>
              <p>{formData.paymentFrequency}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Utilities and Services Included</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Electricity</p>
              <p>{formData.utilities.electricity ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Heat</p>
              <p>{formData.utilities.heat ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Water</p>
              <p>{formData.utilities.water ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cable TV</p>
              <p>{formData.utilities.cable ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Internet</p>
              <p>{formData.utilities.internet ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Other</p>
              <p>{formData.utilities.other ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Deposits Required</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">First Month's Rent</p>
              <p>{formData.firstMonthRent ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Month's Rent</p>
              <p>{formData.lastMonthRent ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Security Deposit</p>
              <p>{formData.securityDeposit ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Key Deposit</p>
              <p>{formData.keyDeposit ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
        
        {formData.additionalTerms && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-lg mb-4">Additional Terms and Conditions</h3>
            <p className="whitespace-pre-wrap">{formData.additionalTerms}</p>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-lg mb-4">Signature</h3>
          {signatureData ? (
            <div className="border border-gray-300 p-2 inline-block">
              <img 
                src={signatureData} 
                alt="Applicant signature" 
                className="max-h-24" 
              />
            </div>
          ) : (
            <p className="text-red-500">No signature provided</p>
          )}
        </div>
      </div>
    </div>
  );
}

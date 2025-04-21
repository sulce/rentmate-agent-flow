
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

// Define the schema for OREA Form 410
const oreaFormSchema = z.object({
  // Tenant Information
  tenant_name: z.string().min(1, "Tenant name is required"),
  tenant_address: z.string().min(1, "Tenant address is required"),
  tenant_phone: z.string().min(1, "Tenant phone is required"),
  tenant_email: z.string().email("Invalid email format"),
  
  // Property Information
  property_address: z.string().min(1, "Property address is required"),
  rental_unit: z.string().optional(),
  monthly_rent: z.string().min(1, "Monthly rent is required"),
  lease_term: z.enum(["fixed", "month-to-month"]),
  lease_start_date: z.string().min(1, "Lease start date is required"),
  lease_end_date: z.string().optional(),
  
  // Utilities
  utilities_included: z.object({
    heat: z.boolean().default(false),
    electricity: z.boolean().default(false),
    water: z.boolean().default(false),
    internet: z.boolean().default(false),
    cable: z.boolean().default(false),
    gas: z.boolean().default(false)
  }),
  
  // Rent Payment
  payment_method: z.enum(["cheque", "cash", "e_transfer", "pre_authorized", "other"]),
  payment_method_other: z.string().optional(),
  
  // Deposits
  last_month_deposit: z.string().min(1, "Last month deposit amount is required"),
  key_deposit: z.string().optional(),
  
  // Smoking policy
  smoking_permitted: z.enum(["yes", "no"]),
  
  // Pet policy
  pets_permitted: z.enum(["yes", "no", "conditional"]),
  pet_conditions: z.string().optional(),
  
  // Additional Terms
  additional_terms: z.string().optional(),
});

type OREAFormValues = z.infer<typeof oreaFormSchema>;

interface OREAForm410Props {
  onSubmit: (data: OREAFormValues) => void;
  isSubmitting?: boolean;
  initialData?: Partial<OREAFormValues>;
}

export default function OREAForm410({ onSubmit, isSubmitting = false, initialData = {} }: OREAForm410Props) {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<OREAFormValues>({
    resolver: zodResolver(oreaFormSchema),
    defaultValues: {
      tenant_name: initialData.tenant_name || "",
      tenant_address: initialData.tenant_address || "",
      tenant_phone: initialData.tenant_phone || "",
      tenant_email: initialData.tenant_email || "",
      property_address: initialData.property_address || "",
      rental_unit: initialData.rental_unit || "",
      monthly_rent: initialData.monthly_rent || "",
      lease_term: initialData.lease_term || "fixed",
      lease_start_date: initialData.lease_start_date || "",
      lease_end_date: initialData.lease_end_date || "",
      utilities_included: initialData.utilities_included || {
        heat: false,
        electricity: false,
        water: false,
        internet: false,
        cable: false,
        gas: false
      },
      payment_method: initialData.payment_method || "cheque",
      payment_method_other: initialData.payment_method_other || "",
      last_month_deposit: initialData.last_month_deposit || "",
      key_deposit: initialData.key_deposit || "",
      smoking_permitted: initialData.smoking_permitted || "no",
      pets_permitted: initialData.pets_permitted || "no",
      pet_conditions: initialData.pet_conditions || "",
      additional_terms: initialData.additional_terms || ""
    }
  });
  
  const handleFormSubmit = (values: OREAFormValues) => {
    try {
      onSubmit(values);
      toast({
        title: "Form completed",
        description: "OREA Form 410 has been successfully completed and will be processed."
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error processing your form. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-center">Ontario Residential Tenancy Agreement</CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          (Standard Form of Lease - Form 410)
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Section 1: Tenant Information */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">1. Tenant Information</h2>
              
              <FormField
                control={form.control}
                name="tenant_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name(s)</FormLabel>
                    <FormControl>
                      <Input placeholder="Full legal name(s)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tenant_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Current address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tenant_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tenant_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Section 2: Property Information */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">2. Property Information</h2>
              
              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Property Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rental_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Number (if applicable)</FormLabel>
                    <FormControl>
                      <Input placeholder="Unit number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rent Amount ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lease_term"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Lease Term</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="fixed" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Fixed Term Lease
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="month-to-month" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Month-to-Month
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lease_start_date"
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
                
                {form.watch("lease_term") === "fixed" && (
                  <FormField
                    control={form.control}
                    name="lease_end_date"
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
            </div>
            
            {/* Section 3: Utilities */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">3. Utilities Included in Rent</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="utilities_included.heat"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Heat
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities_included.electricity"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Electricity
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities_included.water"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Water
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities_included.internet"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Internet
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities_included.cable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Cable TV
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="utilities_included.gas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Gas
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Section 4: Rent Payment */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">4. Rent Payment Method</h2>
              
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cheque" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cheque
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="cash" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cash
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="e_transfer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            e-Transfer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pre_authorized" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Pre-authorized Payment
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Other
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("payment_method") === "other" && (
                <FormField
                  control={form.control}
                  name="payment_method_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Other Payment Method</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Section 5: Deposits */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">5. Deposits</h2>
              
              <FormField
                control={form.control}
                name="last_month_deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Month's Rent Deposit ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="key_deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Deposit (if applicable) ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 50.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Section 6: Smoking Policy */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">6. Smoking Policy</h2>
              
              <FormField
                control={form.control}
                name="smoking_permitted"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Is smoking permitted on the premises?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Section 7: Pet Policy */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">7. Pet Policy</h2>
              
              <FormField
                control={form.control}
                name="pets_permitted"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are pets permitted on the premises?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="conditional" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Yes, with conditions
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("pets_permitted") === "conditional" && (
                <FormField
                  control={form.control}
                  name="pet_conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Pet Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Only cats allowed, maximum 2 pets, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Section 8: Additional Terms */}
            <div className="space-y-4 border p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-4">8. Additional Terms and Conditions</h2>
              
              <FormField
                control={form.control}
                name="additional_terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Terms (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional terms or conditions you'd like to include"
                        {...field}
                        className="min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Preview Button and Submit Button */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? "Edit Form" : "Preview Form"}
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating PDF..." : "Generate PDF"}
              </Button>
            </div>
            
            {/* Preview Mode */}
            {previewMode && (
              <div className="mt-8 p-6 border rounded-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-center">Ontario Residential Tenancy Agreement</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-2">1. Tenant Information</h3>
                    <p><span className="font-medium">Name:</span> {form.getValues("tenant_name")}</p>
                    <p><span className="font-medium">Address:</span> {form.getValues("tenant_address")}</p>
                    <p><span className="font-medium">Phone:</span> {form.getValues("tenant_phone")}</p>
                    <p><span className="font-medium">Email:</span> {form.getValues("tenant_email")}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">2. Property Information</h3>
                    <p><span className="font-medium">Address:</span> {form.getValues("property_address")}</p>
                    {form.getValues("rental_unit") && <p><span className="font-medium">Unit:</span> {form.getValues("rental_unit")}</p>}
                    <p><span className="font-medium">Monthly Rent:</span> ${form.getValues("monthly_rent")}</p>
                    <p><span className="font-medium">Lease Term:</span> {form.getValues("lease_term") === "fixed" ? "Fixed Term" : "Month-to-Month"}</p>
                    <p><span className="font-medium">Start Date:</span> {form.getValues("lease_start_date")}</p>
                    {form.getValues("lease_term") === "fixed" && <p><span className="font-medium">End Date:</span> {form.getValues("lease_end_date")}</p>}
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">3. Utilities Included</h3>
                    <ul className="list-disc pl-5">
                      {form.getValues("utilities_included.heat") && <li>Heat</li>}
                      {form.getValues("utilities_included.electricity") && <li>Electricity</li>}
                      {form.getValues("utilities_included.water") && <li>Water</li>}
                      {form.getValues("utilities_included.internet") && <li>Internet</li>}
                      {form.getValues("utilities_included.cable") && <li>Cable TV</li>}
                      {form.getValues("utilities_included.gas") && <li>Gas</li>}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">4. Rent Payment Method</h3>
                    <p>
                      {form.getValues("payment_method") === "other" 
                        ? form.getValues("payment_method_other") 
                        : form.getValues("payment_method").replace('_', ' ').charAt(0).toUpperCase() + form.getValues("payment_method").replace('_', ' ').slice(1)
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">5. Deposits</h3>
                    <p><span className="font-medium">Last Month's Rent:</span> ${form.getValues("last_month_deposit")}</p>
                    {form.getValues("key_deposit") && <p><span className="font-medium">Key Deposit:</span> ${form.getValues("key_deposit")}</p>}
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">6. Smoking Policy</h3>
                    <p>Smoking is {form.getValues("smoking_permitted") === "yes" ? "permitted" : "not permitted"} on the premises.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-2">7. Pet Policy</h3>
                    {form.getValues("pets_permitted") === "yes" && <p>Pets are permitted on the premises.</p>}
                    {form.getValues("pets_permitted") === "no" && <p>Pets are not permitted on the premises.</p>}
                    {form.getValues("pets_permitted") === "conditional" && (
                      <>
                        <p>Pets are permitted with the following conditions:</p>
                        <p className="italic">{form.getValues("pet_conditions")}</p>
                      </>
                    )}
                  </div>
                  
                  {form.getValues("additional_terms") && (
                    <div>
                      <h3 className="font-bold mb-2">8. Additional Terms</h3>
                      <p className="whitespace-pre-wrap">{form.getValues("additional_terms")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

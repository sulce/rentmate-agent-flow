
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OREAForm410 from "@/components/application/OREAForm410";
import { ArrowLeft } from "lucide-react";

export default function OREAFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Call your backend API to process the form
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const data = await response.json();
      
      toast({
        title: "Form successfully submitted",
        description: "Your OREA 410 form has been successfully processed.",
      });
      
      // Return to the application process
      navigate(`/apply/${id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error processing your form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/apply/${id}`)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Application
        </Button>
        <h1 className="text-2xl font-bold">OREA Form 410</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <OREAForm410 onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}

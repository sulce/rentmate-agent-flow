import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OREAForm410 from "@/components/application/OREAForm410";
import { ArrowLeft, Download } from "lucide-react";
import { useApplication } from "@/hooks/useApplication";

export default function OREAFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateOREAForm } = useApplication(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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
      const pdfUrl = `/api/preview-pdf/${data.file_id}`;
      setPdfUrl(pdfUrl);
      
      // Save the form data and PDF URL to the application
      await updateOREAForm({
        form_data: formData,
        signed_url: pdfUrl
      });
      
      toast({
        title: "Form successfully submitted",
        description: "Your OREA 410 form has been successfully processed.",
      });
      
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

  const handleBack = () => {
    if (pdfUrl) {
      // If we have a PDF URL, we've completed the form, so navigate back to the application
      navigate(`/apply/${id}`);
    } else {
      // Otherwise, show a confirmation dialog
      if (window.confirm("You will lose your progress if you go back. Are you sure?")) {
        navigate(`/apply/${id}`);
      }
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Application
        </Button>
        <h1 className="text-2xl font-bold">OREA Form 410</h1>
      </div>
      
      {pdfUrl ? (
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-full mb-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Form Completed!</h2>
            <p className="mb-4">Your OREA Form 410 has been successfully generated.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.open(pdfUrl, '_blank')}>
                View PDF
              </Button>
              <Button variant="outline" asChild>
                <a href={pdfUrl} download="OREA_Form_410.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/apply/${id}`)}>
                Continue Application
              </Button>
            </div>
          </div>
          
          <iframe 
            src={pdfUrl} 
            className="w-full h-[600px] border rounded-lg" 
            title="OREA Form 410 Preview"
          />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <OREAForm410 onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
}

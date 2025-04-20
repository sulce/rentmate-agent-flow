import { useState } from "react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";
import OREAFormOptions from "./OREAFormOptions";

interface OREAFormProps {
  onSubmit: (data: any) => void;
}

export default function OREAForm({ onSubmit }: OREAFormProps) {
  const [formData, setFormData] = useState<any>(null);
  const { updateOREAForm, isLoading, error } = useApplication();
  const { toast } = useToast();

  const handleFormSubmit = async (data: any) => {
    try {
      setFormData(data);
      await updateOREAForm(data);
      toast({
        title: "Success",
        description: "OREA form data saved successfully.",
      });
      onSubmit(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save OREA form data",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">OREA Form 410</h2>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Please either upload your completed OREA Form 410 or fill it out online. This is the standard Ontario Real Estate Association rental application form.
        </p>
        <OREAFormOptions onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}

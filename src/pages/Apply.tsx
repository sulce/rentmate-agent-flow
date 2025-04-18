
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplicationLayout from "@/components/application/ApplicationLayout";
import BioForm from "@/components/application/BioForm";
import OREAForm from "@/components/application/OREAForm";
import DocumentUpload from "@/components/application/DocumentUpload";
import { useToast } from "@/hooks/use-toast";

type ApplicationData = {
  bioData?: any;
  oreaFormData?: any;
  documentData?: any;
};

const Apply = () => {
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [canGoNext, setCanGoNext] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBioFormSubmit = (data: any) => {
    setApplicationData((prev) => ({ ...prev, bioData: data }));
    setStep(2);
    toast({
      title: "Personal information saved",
      description: "Your personal information has been saved.",
    });
  };

  const handleOREAFormSubmit = (data: any) => {
    setApplicationData((prev) => ({ ...prev, oreaFormData: data }));
    setStep(3);
    toast({
      title: "OREA form saved",
      description: "Your OREA Form 410 has been saved.",
    });
  };

  const handleDocumentUploadSubmit = (data: any) => {
    setApplicationData((prev) => ({ ...prev, documentData: data }));
    toast({
      title: "Application submitted",
      description: "Your application has been submitted successfully.",
    });
    
    // In a real app, we would submit the data to an API here
    // For now, just navigate back to home
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {step === 1 && (
        <ApplicationLayout step={1} totalSteps={3} onNext={() => setStep(2)} canGoNext={canGoNext}>
          <BioForm onSubmit={handleBioFormSubmit} />
        </ApplicationLayout>
      )}

      {step === 2 && (
        <ApplicationLayout 
          step={2} 
          totalSteps={3} 
          onNext={() => setStep(3)} 
          onPrev={() => setStep(1)}
          canGoNext={canGoNext}
        >
          <OREAForm onSubmit={handleOREAFormSubmit} />
        </ApplicationLayout>
      )}

      {step === 3 && (
        <ApplicationLayout 
          step={3} 
          totalSteps={3} 
          onPrev={() => setStep(2)}
          canGoNext={canGoNext}
        >
          <DocumentUpload onSubmit={handleDocumentUploadSubmit} />
        </ApplicationLayout>
      )}
    </>
  );
};

export default Apply;

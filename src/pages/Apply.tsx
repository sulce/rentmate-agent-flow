import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useApplication } from "@/hooks/useApplication";
import BioForm from "@/components/application/BioForm";
import DocumentUpload from "@/components/application/DocumentUpload";
import ApplicationLayout from "@/components/application/ApplicationLayout";
import { Application, ApplicationStatus } from "@/types/application";

const Apply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [canGoNext, setCanGoNext] = useState(true);
  
  // Using the existing useApplication hook with proper typing
  const { 
    application, 
    isLoading, 
    error, 
    updateBioInfo,
    updateOREAForm, 
    uploadDocument,
    updateStatus 
  } = useApplication(id);

  useEffect(() => {
    // If there's an error, show toast and redirect
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load application: " + error,
        variant: "destructive",
      });
      navigate("/");
    }
  }, [error, navigate, toast]);

  useEffect(() => {
    // Set current step based on application progress if available
    if (application) {
      console.log("Application data loaded:", application);
      
      // If bio info exists and has required fields, move to step 2
      if (application.bio_info && 
          application.bio_info.first_name && 
          application.bio_info.last_name) {
        setCurrentStep(2);
        
        // If documents exist, move to step 3
        if (application.documents && application.documents.length > 0) {
          setCurrentStep(3);
        }
      }
    }
  }, [application]);

  // Handle bio form submission
  const handleBioSubmit = async (data: any) => {
    try {
      setCanGoNext(false);
      await updateBioInfo(data);
      setCurrentStep(2);
      setCanGoNext(true);
      toast({
        title: "Success",
        description: "Personal information saved successfully",
      });
    } catch (error) {
      console.error("Failed to save bio info:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to save personal information",
        variant: "destructive",
      });
      setCanGoNext(true);
    }
  };

  // Handle document upload submission
  const handleDocumentsSubmit = async (data: any) => {
    try {
      setCanGoNext(false);
      
      // Process file uploads
      const uploadPromises = [];
      
      // Handle paystubs (multiple files)
      if (data.paystubs && data.paystubs.length > 0) {
        for (let i = 0; i < data.paystubs.length; i++) {
          uploadPromises.push(uploadDocument(data.paystubs[i], 'paystubs'));
        }
      }
      
      // Handle government ID
      if (data.governmentId && data.governmentId.length > 0) {
        uploadPromises.push(uploadDocument(data.governmentId[0], 'governmentId'));
      }
      
      // Handle employment letter
      if (data.employmentLetter && data.employmentLetter.length > 0) {
        uploadPromises.push(uploadDocument(data.employmentLetter[0], 'employmentLetter'));
      }
      
      // Handle self-employed documents if applicable
      if (data.isSelfEmployed === 'yes') {
        if (data.noticeOfAssessment && data.noticeOfAssessment.length > 0) {
          uploadPromises.push(uploadDocument(data.noticeOfAssessment[0], 'noticeOfAssessment'));
        }
        
        if (data.t5Form && data.t5Form.length > 0) {
          uploadPromises.push(uploadDocument(data.t5Form[0], 't5Form'));
        }
        
        if (data.bankStatements && data.bankStatements.length > 0) {
          for (let i = 0; i < data.bankStatements.length; i++) {
            uploadPromises.push(uploadDocument(data.bankStatements[i], 'bankStatements'));
          }
        }
      }
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      setCurrentStep(3);
      setCanGoNext(true);
      toast({
        title: "Success",
        description: "Documents uploaded successfully",
      });
    } catch (error) {
      console.error("Failed to upload documents:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to upload documents",
        variant: "destructive",
      });
      setCanGoNext(true);
    }
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    try {
      setCanGoNext(false);
      await updateStatus("submitted" as ApplicationStatus);
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      // Navigate to a success page
      navigate("/application-submitted");
    } catch (error) {
      console.error("Failed to submit application:", error);
      toast({
        title: "Error",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message) 
          : "Failed to submit application",
        variant: "destructive",
      });
      setCanGoNext(true);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render different form content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BioForm
            initialData={application?.bio_info}
            onSubmit={handleBioSubmit}
          />
        );
      case 2:
        return (
          <DocumentUpload
            onSubmit={handleDocumentsSubmit}
            initialData={application?.documents}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>
            
            <div className="border rounded-md p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              {application?.bio_info && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p>{`${application.bio_info.first_name || ''} ${application.bio_info.last_name || ''}`}</p>
                  </div>
                  {application.bio_info.move_in_date && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Move-in Date</p>
                      <p>{new Date(application.bio_info.move_in_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
              {application?.bio_info?.bio && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-500">About</p>
                  <p className="text-sm">{application.bio_info.bio}</p>
                </div>
              )}
            </div>
            
            <div className="border rounded-md p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Documents</h3>
              {application?.documents && application.documents.length > 0 ? (
                <ul className="list-disc pl-5">
                  {application.documents.map((doc: any, index: number) => (
                    <li key={index} className="text-sm">
                      {doc.document_type || 'Document'}: {doc.document_url ? 'Uploaded' : 'Not uploaded'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded</p>
              )}
            </div>
            
            <p className="text-sm text-gray-500 text-center mt-6 mb-4">
              By submitting this application, you confirm that all the information provided is accurate and complete.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  // Display loader while application is loading
  if (isLoading && !application) {
    return (
      <ApplicationLayout
        step={1}
        totalSteps={3}
        onNext={() => {}}
        onPrev={() => {}}
        canGoNext={false}
      >
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rentmate-primary"></div>
        </div>
      </ApplicationLayout>
    );
  }

  // Use the ApplicationLayout component with the correct props
  return (
    <ApplicationLayout
      step={currentStep}
      totalSteps={3}
      onNext={handleNext}
      onPrev={handlePrev}
      canGoNext={canGoNext}
    >
      {renderStepContent()}
    </ApplicationLayout>
  );
};

export default Apply;
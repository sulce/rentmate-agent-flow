
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Application } from "@/types/application";

interface ApplicationLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  canGoNext?: boolean;
}

const ApplicationLayout = ({ 
  children, 
  step, 
  totalSteps, 
  onNext, 
  onPrev, 
  canGoNext = true 
}: ApplicationLayoutProps) => {
  const progress = (step / totalSteps) * 100;
  
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return "Personal Information";
      case 2:
        return "OREA Form & Documents";
      case 3:
        return "Review & Submit";
      default:
        return `Step ${step}`;
    }
  };

  // Save progress in local storage
  const saveProgress = (currStep: number) => {
    try {
      const applicationData: Partial<Application> = {
        last_saved_step: currStep
      };
      localStorage.setItem('applicationProgress', JSON.stringify(applicationData));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Rental Application</h1>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{getStepTitle(step)}</span>
            <span className="text-sm text-gray-500">Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card className="p-6 mb-6">
        {children}
      </Card>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => {
            onPrev();
            saveProgress(step - 1);
          }}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={() => {
            onNext();
            saveProgress(step + 1);
          }}
          disabled={!canGoNext}
        >
          {step === totalSteps ? "Submit Application" : "Next"} 
          {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationLayout;


import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApplicationLayoutProps {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext?: boolean;
}

export default function ApplicationLayout({
  children,
  step,
  totalSteps,
  onNext,
  onPrev,
  canGoNext = true,
}: ApplicationLayoutProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSaveProgress = () => {
    setSaving(true);
    
    // Simulate saving progress
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Progress Saved",
        description: "You can continue your application later.",
      });
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-rentmate-primary">
            RentMate
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Rental Application
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Please complete all sections of this application
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-rentmate-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow rounded-md p-6 mb-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <div>
            {step > 1 && onPrev && (
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveProgress}
              disabled={saving}
              className="flex items-center mr-2"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Progress"}
            </Button>
            {step < totalSteps && onNext && (
              <Button
                type="button"
                onClick={onNext}
                disabled={!canGoNext}
                className="flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === totalSteps && (
              <Button
                type="button"
                className="flex items-center"
                onClick={() => {
                  toast({
                    title: "Application Submitted",
                    description: "Your application has been submitted successfully.",
                  });
                }}
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

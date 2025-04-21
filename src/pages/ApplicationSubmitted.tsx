
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ApplicationSubmitted() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Application Submitted!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Thank you for completing your application. We've received it and will begin the review process.
        </p>
        <p className="mt-3 text-gray-600">
          You'll receive an email confirmation shortly with details about the next steps.
        </p>
        
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="w-full"
          >
            Print Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
}

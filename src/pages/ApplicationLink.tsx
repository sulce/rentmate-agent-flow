import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api/apiClient";
import { Skeleton } from "@/components/ui/skeleton";

const ApplicationLink = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [startingApp, setStartingApp] = useState(false);

  useEffect(() => {
    const validateLink = async () => {
      try {
        setIsLoading(true);
        // Make sure linkId is not undefined
        if (!linkId) {
          throw new Error("Invalid link ID");
        }

        const response = await apiClient.validateApplicationLink(linkId);
        setIsValid(response.isValid);
      } catch (error) {
        console.error("Link validation error:", error);
        toast({
          title: "Error",
          description: "Invalid or expired application link",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (linkId) {
      validateLink();
    } else {
      navigate("/");
    }
  }, [linkId, navigate, toast]);

  const handleStartApplication = async () => {
    try {
      setStartingApp(true);
      // Make sure linkId is not undefined
      if (!linkId) {
        throw new Error("Invalid link ID");
      }

      const response = await apiClient.startApplication(linkId);

      // Make sure the response contains an ID before navigation
      if (!response || !response.id) {
        throw new Error("Invalid response from API");
      }

      // Navigate to the application form page
      navigate(`/apply/${response.id}`);
    } catch (error) {
      console.error("Start application error:", error);
      toast({
        title: "Error",
        description: "Failed to start application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStartingApp(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-4 w-1/3 mx-auto mb-6" />
                <Skeleton className="h-10 w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isValid) {
    return null; // This might be causing the blank page issue
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-rentmate-primary">Rental Application</CardTitle>
            <CardDescription className="text-lg">
              You've been invited to complete a rental application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="mb-6">
                This application was shared with you by a real estate agent using RentMate.
                Complete this application to apply for your desired rental property.
              </p>
              <p className="font-medium text-gray-700 mb-2">Application Link ID: {linkId}</p>
              <p className="mb-6 text-sm text-gray-500">
                This is a secure application link. Your information will only be shared with the agent who sent you this link.
              </p>
              <Button
                size="lg"
                onClick={handleStartApplication}
                className="mt-4"
                disabled={isLoading || startingApp}
              >
                {startingApp ? "Starting Application..." : "Start Application"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplicationLink;
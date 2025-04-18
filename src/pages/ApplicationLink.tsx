
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicationLink = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would validate the linkId against the database
    // For now, we'll just check if it exists
    if (!linkId) {
      navigate("/apply");
    }
  }, [linkId, navigate]);

  const handleStartApplication = () => {
    // This would pass the linkId to the application process in a real app
    navigate("/apply");
  };

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
              <Button size="lg" onClick={handleStartApplication} className="mt-4">
                Start Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplicationLink;

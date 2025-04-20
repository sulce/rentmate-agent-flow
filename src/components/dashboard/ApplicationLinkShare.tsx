import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from "lucide-react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

export const ApplicationLinkShare = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { generateApplicationLink } = useApplication();
  const { toast } = useToast();

  const handleGenerateLink = async () => {
    try {
      setIsLoading(true);
      const response = await generateApplicationLink();
      await navigator.clipboard.writeText(response.url);
      toast({
        title: "Success",
        description: "Application link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate application link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Application Link</CardTitle>
        <CardDescription>
          Generate and share a link for applicants to start their rental application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Button
            onClick={handleGenerateLink}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              "Generating..."
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Generate Link
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

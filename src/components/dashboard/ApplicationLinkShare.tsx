
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FilePlus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const ApplicationLinkShare = () => {
  const [applicationLinkId, setApplicationLinkId] = useState("a1b2c3d4e5f6");
  const { toast } = useToast();
  const navigate = useNavigate();

  const getFullApplicationLink = () => {
    return `${window.location.origin}/apply/${applicationLinkId}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getFullApplicationLink());
    toast({
      title: "Link copied",
      description: "Application link copied to clipboard",
    });
  };

  const generateNewLink = () => {
    const newLinkId = Math.random().toString(36).substring(2, 10);
    setApplicationLinkId(newLinkId);
    toast({
      title: "New link generated",
      description: "A new application link has been generated",
    });
  };

  const viewApplicationLink = () => {
    navigate(`/apply/${applicationLinkId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Application Link</CardTitle>
        <CardDescription>
          Send this link to prospective tenants to fill out the rental application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Input value={getFullApplicationLink()} readOnly className="flex-1" />
          <Button onClick={copyLink} className="flex-shrink-0">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={generateNewLink} className="flex-shrink-0">
            <FilePlus className="h-4 w-4 mr-2" />
            Generate New Link
          </Button>
          <Button variant="secondary" onClick={viewApplicationLink} className="flex-shrink-0">
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

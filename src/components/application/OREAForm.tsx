
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileUp, FilePen, FileText } from "lucide-react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "@/components/shared/FileUploader";

interface OREAFormProps {
  onSubmit: (data: any) => void;
}

export default function OREAForm({ onSubmit }: OREAFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const { uploadDocument, isLoading, error } = useApplication();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFileChange = async (file: File) => {
    try {
      setFileName(file.name);

      // Upload the file immediately when selected
      await uploadDocument(file, "OREA_FORM");
      toast({
        title: "Success",
        description: "OREA form uploaded successfully.",
      });
      onSubmit({ uploaded_url: URL.createObjectURL(file), file_name: file.name });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload OREA form",
        variant: "destructive",
      });
    }
  };

  const handleOpenFormEditor = () => {
    navigate(`/forms/orea410/${id}`);
  };

  const handleRemoveFile = () => {
    setFileName(null);
  };

  return (
    <Tabs defaultValue="fill" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="fill">Fill Form Online</TabsTrigger>
        <TabsTrigger value="upload">Upload Completed Form</TabsTrigger>
      </TabsList>

      <TabsContent value="fill">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FilePen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fill Form Online</h3>
              <p className="text-gray-600 mb-4">
                Complete the OREA Form 410 directly in your browser - mobile friendly and accessible
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button onClick={handleOpenFormEditor}>
                  Open Form Editor
                </Button>
                <Button variant="outline" onClick={() => window.open('/api/templates/orea410_sample.pdf', '_blank')}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Sample Form
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                The completed form will be converted to a PDF that matches the official OREA Form 410 format
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardContent className="pt-6">
            <FileUploader
              id="orea-form"
              accept=".pdf"
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
              fileName={fileName}
              label="Upload your completed OREA Form 410"
              description="Already have a completed OREA form? Upload it here."
              disabled={isLoading}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

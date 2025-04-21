
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileUp, FilePen } from "lucide-react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OREAFormProps {
  onSubmit: (data: any) => void;
}

export default function OREAForm({ onSubmit }: OREAFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const { uploadDocument, isLoading, error } = useApplication();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setFileName(file.name);

        // Upload the file immediately when selected
        await uploadDocument(file, "OREA_FORM");
        toast({
          title: "Success",
          description: "OREA form uploaded successfully.",
        });
        onSubmit({ uploaded_url: "sample-url", file_name: file.name }); // In real implementation, you'd get the URL from the backend
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to upload OREA form",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenFormEditor = () => {
    navigate(`/forms/orea410/${id}`);
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload Completed Form</TabsTrigger>
        <TabsTrigger value="fill">Fill Form Online</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-600">
                  Upload your completed OREA Form 410
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF
                </p>

                <div className="mt-4">
                  <Input
                    id="orea-form"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label htmlFor="orea-form">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Uploading..." : "Select File"}
                    </Button>
                  </label>
                </div>

                {fileName && (
                  <div className="mt-4 p-2 bg-gray-50 rounded flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {fileName}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFileName(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="fill">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FilePen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fill Form Online</h3>
              <p className="text-gray-600 mb-4">
                You can fill out the OREA Form 410 directly in your browser
              </p>
              <Button onClick={handleOpenFormEditor}>
                Open Form Editor
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

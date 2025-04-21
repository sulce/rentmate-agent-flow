
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/shared/FileUploader";
import { Document } from "@/types/application";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface DocumentUploadProps {
  onSubmit: (data: any) => void;
  initialData?: Document[];
}

export const DocumentUpload = ({ onSubmit, initialData = [] }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [governmentIdFile, setGovernmentIdFile] = useState<File | null>(null);
  const [paystubFiles, setPaystubFiles] = useState<File[]>([]);
  const [employmentLetterFile, setEmploymentLetterFile] = useState<File | null>(null);
  const [noticeOfAssessmentFile, setNoticeOfAssessmentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSelfEmployed, setIsSelfEmployed] = useState<'yes' | 'no'>('no');
  const { toast } = useToast();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setDocuments(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      if (governmentIdFile) {
        formData.append('governmentId', governmentIdFile);
      }
      
      paystubFiles.forEach((file, index) => {
        formData.append(`paystub_${index}`, file);
      });
      
      if (employmentLetterFile) {
        formData.append('employmentLetter', employmentLetterFile);
      }
      
      if (isSelfEmployed === 'yes' && noticeOfAssessmentFile) {
        formData.append('noticeOfAssessment', noticeOfAssessmentFile);
      }
      
      // Call the onSubmit handler
      await onSubmit({
        governmentId: governmentIdFile ? [governmentIdFile] : [],
        paystubs: paystubFiles,
        employmentLetter: employmentLetterFile ? [employmentLetterFile] : [],
        noticeOfAssessment: noticeOfAssessmentFile ? [noticeOfAssessmentFile] : [],
        isSelfEmployed,
      });

      // Add to local documents array
      if (governmentIdFile) {
        const newDoc: Document = {
          type: 'government_id',
          url: URL.createObjectURL(governmentIdFile),
          uploaded_at: new Date().toISOString(),
          name: governmentIdFile.name
        };
        setDocuments(prev => [...prev, newDoc]);
      }

      toast({
        title: "Documents uploaded",
        description: "Your documents have been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Error",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if document of specific type exists
  const documentExists = (type: string) => {
    return documents.some(doc => doc.type === type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {documents.length > 0 && (
            <Alert className="mb-6 bg-green-50 border-green-100">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                You have already uploaded {documents.length} document(s)
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Required Documents</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Government-issued ID</label>
              <FileUploader
                id="government-id"
                onChange={(file) => setGovernmentIdFile(file)}
                fileName={governmentIdFile?.name || (documentExists('government_id') ? 'ID Document (Uploaded)' : undefined)}
                label="Upload your government-issued ID"
                description="Driver's license, passport, or other government ID"
                disabled={isSubmitting || documentExists('government_id')}
                onRemove={() => setGovernmentIdFile(null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Paystubs (2-3 recent)</label>
              <FileUploader
                id="paystubs"
                onChange={(file) => setPaystubFiles(prev => [...prev, file])}
                fileName={paystubFiles.length > 0 ? `${paystubFiles.length} file(s) selected` : undefined}
                label="Upload your recent paystubs"
                description="Last 2-3 paystubs from your employer"
                disabled={isSubmitting}
                onRemove={() => setPaystubFiles([])}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Employment Letter (Optional)</label>
              <FileUploader
                id="employment-letter"
                onChange={(file) => setEmploymentLetterFile(file)}
                fileName={employmentLetterFile?.name}
                label="Upload employment verification letter"
                description="Letter from your employer confirming employment"
                disabled={isSubmitting}
                onRemove={() => setEmploymentLetterFile(null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Are you self-employed?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="self-employed"
                    value="yes"
                    checked={isSelfEmployed === 'yes'}
                    onChange={() => setIsSelfEmployed('yes')}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="self-employed"
                    value="no"
                    checked={isSelfEmployed === 'no'}
                    onChange={() => setIsSelfEmployed('no')}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            
            {isSelfEmployed === 'yes' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Notice of Assessment</label>
                <FileUploader
                  id="notice-of-assessment"
                  onChange={(file) => setNoticeOfAssessmentFile(file)}
                  fileName={noticeOfAssessmentFile?.name}
                  label="Upload Notice of Assessment"
                  description="Your most recent tax Notice of Assessment"
                  disabled={isSubmitting}
                  onRemove={() => setNoticeOfAssessmentFile(null)}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Save Documents"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;

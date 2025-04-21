
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUploader } from "@/components/shared/FileUploader";
import { DocumentType, Document } from "@/types/application";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  applicationId: string;
  documents: Document[];
  onUploadSuccess: (document: Document) => void;
}

export const DocumentUpload = ({ applicationId, documents, onUploadSuccess }: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>(documents || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const documentTypes: { label: string; value: DocumentType; description: string }[] = [
    { 
      label: "Government ID", 
      value: "ID", 
      description: "Driver's license, passport, or other government-issued ID" 
    },
    { 
      label: "Employment Letter", 
      value: "EMPLOYMENT_LETTER", 
      description: "A letter from your employer confirming your employment" 
    },
    { 
      label: "Credit Report", 
      value: "CREDIT_REPORT", 
      description: "Your recent credit report" 
    },
    { 
      label: "Bank Statement", 
      value: "BANK_STATEMENT", 
      description: "Last 3 months of bank statements" 
    },
    { 
      label: "Reference Letter", 
      value: "REFERENCE_LETTER", 
      description: "A letter from a previous landlord or character reference" 
    },
    { 
      label: "Other Document", 
      value: "OTHER", 
      description: "Any other relevant document for your application" 
    }
  ];

  const handleUpload = async (file: File, documentType: DocumentType) => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a successful upload with a fake URL
      const fakeUrl = URL.createObjectURL(file);
      
      const newDocument: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: documentType,
        url: fakeUrl,
        uploaded_at: new Date().toISOString()
      };
      
      setUploadedDocuments(prev => [...prev, newDocument]);
      onUploadSuccess(newDocument);
      
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded.",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (file: File, documentTypeStr: string) => {
    // Convert the string to DocumentType type
    const documentType = documentTypeStr as DocumentType;
    await handleUpload(file, documentType);
  };

  const uploadNewFile = (documentType: DocumentType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleUpload(file, documentType);
      }
    };
    input.click();
  };

  const hasDocumentOfType = (type: DocumentType) => {
    return uploadedDocuments.some(doc => doc.type === type);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Upload Documents</h2>
      <p className="text-muted-foreground">
        Please upload the following documents to complete your application.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => (
          <Card key={docType.value} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{docType.label}</h3>
                <p className="text-sm text-muted-foreground">{docType.description}</p>
              </div>
              {hasDocumentOfType(docType.value) ? (
                <Badge status="success">Uploaded</Badge>
              ) : null}
            </div>
            <Button 
              variant={hasDocumentOfType(docType.value) ? "outline" : "default"}
              className="w-full mt-2"
              onClick={() => uploadNewFile(docType.value)}
              disabled={uploading}
            >
              {hasDocumentOfType(docType.value) ? "Replace" : "Upload"}
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <FileUploader
          onFileSelected={handleFileChange}
          allowedFileTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
          maxSizeMB={10}
          label="Or drag and drop files here"
          uploading={uploading}
          documentTypes={documentTypes}
        />
      </div>
    </div>
  );
};

// Custom Badge component for document status
const Badge = ({ status }: { status: "success" | "pending" | "error" }) => {
  const colors = {
    success: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status === "success" ? "Uploaded" : status === "pending" ? "Pending" : "Error"}
    </span>
  );
};

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Upload, X } from "lucide-react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const documentSchema = z.object({
  paystubs: z.instanceof(FileList).refine((files) => files.length >= 1 && files.length <= 3, {
    message: "Please upload 1-3 paystubs",
  }),
  governmentId: z.instanceof(FileList).refine((files) => files.length === 1, {
    message: "Please upload your government ID",
  }),
  employmentLetter: z.instanceof(FileList).refine((files) => files.length === 1, {
    message: "Please upload your employment letter",
  }),
  isSelfEmployed: z.string(),
  noticeOfAssessment: z.instanceof(FileList).optional(),
  t5Form: z.instanceof(FileList).optional(),
  bankStatements: z.instanceof(FileList).optional(),
});

type DocumentValues = z.infer<typeof documentSchema>;

interface DocumentUploadProps {
  onSubmit: (data: any) => void;
  initialData?: Document[];
}

export default function DocumentUpload({ onSubmit, initialData }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>(initialData || []);
  const { uploadDocument, isLoading, error } = useApplication();
  const { toast } = useToast();

  const [files, setFiles] = useState<Record<string, File[]>>({
    paystubs: [],
    governmentId: [],
    employmentLetter: [],
    noticeOfAssessment: [],
    t5Form: [],
    bankStatements: [],
  });

  const [isSelfEmployed, setIsSelfEmployed] = useState("no");

  const form = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      isSelfEmployed: "no",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      setFiles((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...fileArray],
      }));

      form.setValue(fieldName as any, e.target.files as FileList);
    }
  };

  const removeFile = (fieldName: string, index: number) => {
    const newFiles = [...files[fieldName]];
    newFiles.splice(index, 1);

    setFiles((prev) => ({
      ...prev,
      [fieldName]: newFiles,
    }));

    // Create a new FileList-like object
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));

    form.setValue(fieldName as any, dt.files);
  };

  const handleSelfEmployedChange = (value: string) => {
    setIsSelfEmployed(value);
    form.setValue("isSelfEmployed", value);
  };

  const handleFileUpload = async (file: File, type: string) => {
    try {
      await uploadDocument(file, type);
      
      const newDoc: Document = {
        name: file.name,
        type: type as DocumentType,
        file: file
      };
      
      setDocuments(prev => [...prev, newDoc]);
      
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(documents);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Document Upload</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Paystubs */}
          <FormField
            control={form.control}
            name="paystubs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paystubs (Last 2-3)</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => handleFileChange(e, "paystubs")}
                      className="input-file"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your 2-3 most recent paystubs
                </FormDescription>
                <div className="mt-2 space-y-2">
                  {files.paystubs.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("paystubs", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Government ID */}
          <FormField
            control={form.control}
            name="governmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Government ID</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "governmentId")}
                      className="input-file"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a copy of your government-issued ID (driver's license, passport, etc.)
                </FormDescription>
                <div className="mt-2 space-y-2">
                  {files.governmentId.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("governmentId", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employment Letter */}
          <FormField
            control={form.control}
            name="employmentLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Letter</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "employmentLetter")}
                      className="input-file"
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload your employment verification letter
                </FormDescription>
                <div className="mt-2 space-y-2">
                  {files.employmentLetter.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("employmentLetter", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Self-employed */}
          <FormField
            control={form.control}
            name="isSelfEmployed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you self-employed?</FormLabel>
                <Select
                  onValueChange={(value) => handleSelfEmployedChange(value)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional fields for self-employed */}
          {isSelfEmployed === "yes" && (
            <>
              {/* Notice of Assessment */}
              <FormField
                control={form.control}
                name="noticeOfAssessment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice of Assessment</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "noticeOfAssessment")}
                          className="input-file"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your most recent Notice of Assessment
                    </FormDescription>
                    <div className="mt-2 space-y-2">
                      {files.noticeOfAssessment.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("noticeOfAssessment", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* T5 Form */}
              <FormField
                control={form.control}
                name="t5Form"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>T5 Form</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "t5Form")}
                          className="input-file"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your T5 Form
                    </FormDescription>
                    <div className="mt-2 space-y-2">
                      {files.t5Form.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("t5Form", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank Statements */}
              <FormField
                control={form.control}
                name="bankStatements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Statements</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={(e) => handleFileChange(e, "bankStatements")}
                          className="input-file"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your last 2 months of bank statements
                    </FormDescription>
                    <div className="mt-2 space-y-2">
                      {files.bankStatements.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-rentmate-primary" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("bankStatements", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full">
            Save and Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

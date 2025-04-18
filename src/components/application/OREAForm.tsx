
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const oreaFormSchema = z.object({
  oreaForm: z.instanceof(File, { message: "Please upload the OREA Form 410" }),
});

type OREAFormValues = z.infer<typeof oreaFormSchema>;

interface OREAFormProps {
  onSubmit: (data: OREAFormValues) => void;
}

export default function OREAForm({ onSubmit }: OREAFormProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<OREAFormValues>({
    resolver: zodResolver(oreaFormSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("oreaForm", file);
      setFileName(file.name);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">OREA Form 410</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Please upload your completed OREA Form 410. This is the standard Ontario Real Estate Association rental application form.
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop your completed OREA Form 410, or click to browse
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
            />
            <label htmlFor="orea-form">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => document.getElementById("orea-form")?.click()}
              >
                Select File
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
                  form.resetField("oreaForm");
                  setFileName(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Button
            type="submit"
            className="w-full"
            disabled={!fileName}
          >
            Save and Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}

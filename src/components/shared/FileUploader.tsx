
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploaderProps {
  id: string;
  onChange: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  label?: string;
  description?: string;
  fileName?: string;
  className?: string;
  disabled?: boolean;
  maxSize?: number; // in MB
}

export const FileUploader = ({
  id,
  onChange,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
  label = "Upload file",
  description = "Supported formats: PDF, JPG, PNG",
  fileName,
  className,
  disabled = false,
  maxSize = 5, // Default 5MB
}: FileUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }
    
    onChange(file);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-1 text-sm text-gray-600">{label}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>

        <div className="mt-4">
          <Input
            ref={inputRef}
            id={id}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleClick}
            disabled={disabled}
          >
            {disabled ? "Uploading..." : "Select File"}
          </Button>
        </div>

        {fileName && (
          <div className="mt-4 p-2 bg-gray-50 rounded flex items-center justify-between">
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {fileName}
            </span>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

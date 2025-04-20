import { useState } from "react";
import { Button } from "./button";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
    currentImage?: string;
    onUpload: (file: File) => Promise<void>;
}

export const ImageUpload = ({ currentImage, onUpload }: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            return;
        }

        try {
            setIsUploading(true);
            setPreviewUrl(URL.createObjectURL(file));
            await onUpload(file);
        } catch (error) {
            console.error("Upload failed:", error);
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
    };

    return (
        <div className="space-y-2">
            {previewUrl ? (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                        disabled={isUploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                    >
                        <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                            {isUploading ? "Uploading..." : "Click to upload"}
                        </span>
                    </label>
                </div>
            )}
        </div>
    );
}; 
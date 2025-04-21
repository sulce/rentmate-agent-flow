
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SignatureCanvasProps {
  onChange: (signatureData: string | null) => void;
  existingSignature?: string | null;
  width?: number;
  height?: number;
}

export default function SignatureCanvas({
  onChange,
  existingSignature = null,
  width = 500,
  height = 150,
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas properties
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#000";
    setCtx(context);

    // Clear canvas and set white background
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // If there's an existing signature, draw it
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    
    // Get canvas position
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Handle mouse and touch events
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Set the starting point
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    // Get canvas position
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Handle mouse and touch events
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on touch devices
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Draw line to current position
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
    
    // Save signature as data URL
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL("image/png");
    onChange(signatureData);
  };

  const clearSignature = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
    onChange(null);
  };

  return (
    <div className="w-full">
      <div className="border border-gray-300 bg-white rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
          disabled={!hasSignature}
          className="text-sm"
        >
          Clear Signature
        </Button>
      </div>
    </div>
  );
}

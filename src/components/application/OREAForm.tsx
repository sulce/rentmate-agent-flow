
import { useState } from "react";
import OREAFormOptions from "./OREAFormOptions";

interface OREAFormProps {
  onSubmit: (data: any) => void;
}

export default function OREAForm({ onSubmit }: OREAFormProps) {
  const [formData, setFormData] = useState<any>(null);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    onSubmit(data);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">OREA Form 410</h2>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Please either upload your completed OREA Form 410 or fill it out online. This is the standard Ontario Real Estate Association rental application form.
        </p>
        <OREAFormOptions onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}

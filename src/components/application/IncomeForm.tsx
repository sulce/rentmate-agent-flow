
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { IncomeData } from "@/types/application";

interface IncomeFormProps {
  onSubmit: (data: IncomeData) => void;
  initialData?: Partial<IncomeData>;
}

export default function IncomeForm({ onSubmit, initialData = {} }: IncomeFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This is just a placeholder for now - implement the actual form later
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This form is still under development.</p>
        <Button onClick={() => onSubmit({} as IncomeData)}>
          Save and Continue
        </Button>
      </CardContent>
    </Card>
  );
}

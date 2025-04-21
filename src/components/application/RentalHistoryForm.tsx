import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RentalHistory } from "@/types/application";

interface RentalHistoryFormProps {
  onSubmit: (data: RentalHistory) => void;
  initialData?: Partial<RentalHistory>;
}

export default function RentalHistoryForm({ onSubmit, initialData = {} }: RentalHistoryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This is just a placeholder for now - implement the actual form later
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">This form is still under development.</p>
        <Button onClick={() => onSubmit({} as RentalHistory)}>
          Save and Continue
        </Button>
      </CardContent>
    </Card>
  );
}

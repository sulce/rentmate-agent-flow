import { useState } from "react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

export default function IncomeForm({ onSubmit, initialData }: IncomeFormProps) {
    const [incomeData, setIncomeData] = useState<IncomeData>(initialData || {
        employmentType: "",
        monthlyIncome: 0,
        employerName: "",
        jobTitle: "",
        employmentDuration: "",
    });

    const { updateIncome, isLoading, error } = useApplication();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateIncome(incomeData);
            onSubmit(incomeData);
            toast({
                title: "Success",
                description: "Income information updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update income information",
                variant: "destructive",
            });
        }
    };

    // ... rest of the existing code ...
} 
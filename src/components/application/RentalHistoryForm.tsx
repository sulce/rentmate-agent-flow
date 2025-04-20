import { useState } from "react";
import { useApplication } from "@/hooks/useApplication";
import { useToast } from "@/hooks/use-toast";

export default function RentalHistoryForm({ onSubmit, initialData }: RentalHistoryFormProps) {
    const [rentalHistory, setRentalHistory] = useState<RentalHistory>(initialData || {
        currentAddress: "",
        currentLandlord: "",
        currentRent: 0,
        currentDuration: "",
        previousAddress: "",
        previousLandlord: "",
        previousRent: 0,
        previousDuration: "",
    });

    const { updateRentalHistory, isLoading, error } = useApplication();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateRentalHistory(rentalHistory);
            onSubmit(rentalHistory);
            toast({
                title: "Success",
                description: "Rental history updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update rental history",
                variant: "destructive",
            });
        }
    };

    // ... rest of the existing code ...
} 
import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    className?: string;
}

const COLORS = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FFA500", "#800080", "#008000", "#000080", "#800000", "#808000",
    "#008080", "#808080", "#C0C0C0", "#FFFFFF", "#000000"
];

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-full justify-start", className)}
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: value }}
                        />
                        <span>{value}</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            className="h-8 w-8 rounded-full border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                onChange(color);
                                setOpen(false);
                            }}
                        />
                    ))}
                </div>
                <div className="mt-2">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-8"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}; 
import { User } from "lucide-react";

export const Topbar = () => {
    return (
        <div className="h-16 bg-white shadow-sm">
            <div className="h-full px-4 flex items-center justify-between">
                <div className="text-xl font-semibold">RentFlow</div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <User className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}; 
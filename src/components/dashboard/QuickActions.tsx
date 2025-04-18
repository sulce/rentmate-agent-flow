
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "addTenant":
        navigate("/apply");
        break;
      case "customizePortal":
        navigate("/settings");
        break;
      case "updateProfile":
        navigate("/profile");
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => handleQuickAction("addTenant")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Tenant
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => handleQuickAction("customizePortal")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Customize Portal
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => handleQuickAction("updateProfile")}
        >
          <User className="mr-2 h-4 w-4" />
          Update Profile
        </Button>
      </CardContent>
    </Card>
  );
};

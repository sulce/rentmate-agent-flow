
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { UserPlus, Copy, ExternalLink, FilePlus, Settings, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const applicationsData = [
  {
    id: "APP-001",
    name: "John Smith",
    date: "2023-04-18",
    status: "Complete",
    property: "123 Main St"
  },
  {
    id: "APP-002",
    name: "Sarah Johnson",
    date: "2023-04-16",
    status: "Incomplete",
    property: "456 Oak Ave"
  },
  {
    id: "APP-003",
    name: "Michael Brown",
    date: "2023-04-15",
    status: "Complete",
    property: "789 Pine Rd"
  },
  {
    id: "APP-004",
    name: "Emily Davis",
    date: "2023-04-14",
    status: "Forwarded",
    property: "101 Maple Dr"
  }
];

const Dashboard = () => {
  const [applicationLinkId, setApplicationLinkId] = useState("a1b2c3d4e5f6");
  const { toast } = useToast();
  const navigate = useNavigate();

  const getFullApplicationLink = () => {
    return `${window.location.origin}/apply/${applicationLinkId}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getFullApplicationLink());
    toast({
      title: "Link copied",
      description: "Application link copied to clipboard",
    });
  };

  const generateNewLink = () => {
    const newLinkId = Math.random().toString(36).substring(2, 10);
    setApplicationLinkId(newLinkId);
    toast({
      title: "New link generated",
      description: "A new application link has been generated",
    });
  };

  const viewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  // Add the missing viewApplicationLink function
  const viewApplicationLink = () => {
    navigate(`/apply/${applicationLinkId}`);
  };

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
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your rental applications and customize your agent portal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Applications</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">4</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Complete Applications</CardTitle>
              <CardDescription>Ready to forward</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">2</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Incomplete Applications</CardTitle>
              <CardDescription>Need follow-up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">1</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Share Application Link</CardTitle>
                <CardDescription>
                  Send this link to prospective tenants to fill out the rental application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Input value={getFullApplicationLink()} readOnly className="flex-1" />
                  <Button onClick={copyLink} className="flex-shrink-0">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={generateNewLink} className="flex-shrink-0">
                    <FilePlus className="h-4 w-4 mr-2" />
                    Generate New Link
                  </Button>
                  <Button variant="secondary" onClick={viewApplicationLink} className="flex-shrink-0">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
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
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Review and manage recent rental applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationsData.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>{application.name}</TableCell>
                    <TableCell>{application.property}</TableCell>
                    <TableCell>{new Date(application.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'Complete'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'Incomplete'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewApplication(application.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;

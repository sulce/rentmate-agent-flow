
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Application {
  id: string;
  name: string;
  date: string;
  status: string;
  property: string;
}

const applicationsData: Application[] = [
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

export const RecentApplications = () => {
  const navigate = useNavigate();

  const viewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  return (
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
  );
};

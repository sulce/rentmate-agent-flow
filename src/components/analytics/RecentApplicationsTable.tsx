
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentApplications = [
  {
    id: 1,
    tenantName: "John Smith",
    listingTitle: "Modern Downtown Apartment",
    status: "In Review",
    dateSubmitted: "2024-04-15",
  },
  {
    id: 2,
    tenantName: "Sarah Johnson",
    listingTitle: "Luxury Condo with View",
    status: "Submitted",
    dateSubmitted: "2024-04-14",
  },
  {
    id: 3,
    tenantName: "Michael Brown",
    listingTitle: "Spacious Family Home",
    status: "Forwarded",
    dateSubmitted: "2024-04-13",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Submitted":
      return "bg-blue-100 text-blue-800";
    case "In Review":
      return "bg-yellow-100 text-yellow-800";
    case "Forwarded":
      return "bg-green-100 text-green-800";
    case "Approved":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const RecentApplicationsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Listing Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.tenantName}</TableCell>
                  <TableCell>{application.listingTitle}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(application.dateSubmitted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

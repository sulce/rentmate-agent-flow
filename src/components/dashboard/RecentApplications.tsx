
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useApplication } from "@/hooks/useApplication";
import { Application, ApplicationStatus } from "@/types/application";

// Define a local interface for the applications displayed in the table
interface ApplicationDisplay {
  id: string;
  tenant_name?: string;
  status: ApplicationStatus;
  created_at: string;
  property?: string;
}

export const RecentApplications = ({ isLoading: parentLoading }: { isLoading?: boolean }) => {
  const { getApplications } = useApplication();
  const [applications, setApplications] = useState<ApplicationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await getApplications();
        // Convert the fetched applications to the display format
        const displayApplications: ApplicationDisplay[] = data.map(app => ({
          id: app.id,
          tenant_name: app.tenant_name || 'Unknown Tenant',
          status: app.status,
          created_at: app.created_at,
          property: 'Sample Property' // This is a mock value
        }));
        setApplications(displayApplications);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [getApplications]);

  const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case "submitted":
        return "secondary";
      case "in_review":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "forwarded":
        return "info";
      default:
        return "outline";
    }
  };

  if (isLoading || parentLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent applications found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.tenant_name}</TableCell>
                  <TableCell>{application.property}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

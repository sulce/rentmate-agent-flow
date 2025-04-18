
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsCardsProps {
  totalApplications: number;
  completeApplications: number;
  incompleteApplications: number;
}

export const StatisticsCards = ({ 
  totalApplications,
  completeApplications,
  incompleteApplications
}: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Applications</CardTitle>
          <CardDescription>All time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalApplications}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Complete Applications</CardTitle>
          <CardDescription>Ready to forward</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{completeApplications}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Incomplete Applications</CardTitle>
          <CardDescription>Need follow-up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{incompleteApplications}</div>
        </CardContent>
      </Card>
    </div>
  );
};

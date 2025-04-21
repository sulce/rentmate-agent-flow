
import { Card, CardContent } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export const AnalyticsSummaryCards = () => {
  const { dashboardData, isLoading, fetchDashboardData } = useAnalytics();

  useEffect(() => {
    // Fetch data when component mounts
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{dashboardData.totalApplications}</div>
          <p className="text-xs text-muted-foreground">Total Applications</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{dashboardData.forwardedApplications}</div>
          <p className="text-xs text-muted-foreground">Forwarded to Landlords</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{dashboardData.inReviewApplications}</div>
          <p className="text-xs text-muted-foreground">In Review</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">
            {formatTime(dashboardData.averageCompletionTime)}
          </div>
          <p className="text-xs text-muted-foreground">Avg. Completion Time</p>
        </CardContent>
      </Card>
    </div>
  );
};

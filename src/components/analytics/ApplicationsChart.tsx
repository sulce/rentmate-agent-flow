import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export const ApplicationsChart = () => {
  const { dashboardData, isLoading, fetchDashboardData } = useAnalytics();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading || !dashboardData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              count: {
                color: "hsl(var(--primary))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.weeklyBreakdown}>
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

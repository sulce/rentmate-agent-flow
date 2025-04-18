
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { week: "Week 1", applications: 24 },
  { week: "Week 2", applications: 18 },
  { week: "Week 3", applications: 32 },
  { week: "Week 4", applications: 27 },
];

export const ApplicationsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              applications: {
                color: "hsl(var(--primary))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="applications" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

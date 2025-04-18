
import Layout from "@/components/layout/Layout";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { ApplicationsChart } from "@/components/analytics/ApplicationsChart";
import { StatusBreakdown } from "@/components/analytics/StatusBreakdown";
import { RecentApplicationsTable } from "@/components/analytics/RecentApplicationsTable";

const AnalyticsDashboard = () => {
  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and analyze your rental application metrics
          </p>
        </div>

        <AnalyticsSummaryCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ApplicationsChart />
          <StatusBreakdown />
        </div>

        <RecentApplicationsTable />
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;

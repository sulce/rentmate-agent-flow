
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { ApplicationLinkShare } from "@/components/dashboard/ApplicationLinkShare";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-600">{error.message}</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  );
};

const Dashboard = () => {
  const { toast } = useToast();
  const { refreshData, isLoading } = useAnalytics();

  const handleRefresh = async () => {
    try {
      await refreshData();
      toast({
        title: "Success",
        description: "Analytics data refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh data",
        variant: "destructive",
      });
    }
  };

  const content = (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your rental applications and customize your agent portal
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div>
          <ApplicationLinkShare />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AnalyticsSection />
      </ErrorBoundary>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <RecentApplications isLoading={isLoading} />
        </div>
      </div>
    </div>
  );

  return <Layout>{content}</Layout>;
};

export default Dashboard;


import Layout from "@/components/layout/Layout";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { ApplicationLinkShare } from "@/components/dashboard/ApplicationLinkShare";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentApplications } from "@/components/dashboard/RecentApplications";

const Dashboard = () => {
  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your rental applications and customize your agent portal
          </p>
        </div>

        <StatisticsCards 
          totalApplications={4} 
          completeApplications={2} 
          incompleteApplications={1} 
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-2">
            <ApplicationLinkShare />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <RecentApplications />
      </div>
    </Layout>
  );
};

export default Dashboard;

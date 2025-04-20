import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api/apiClient";

const ANALYTICS_QUERY_KEY = "analytics";

export const useAnalytics = () => {
    const queryClient = useQueryClient();

    const {
        data: dashboardData,
        isLoading,
        error,
        refetch: fetchDashboardData,
    } = useQuery({
        queryKey: [ANALYTICS_QUERY_KEY],
        queryFn: () => apiClient.getDashboardAnalytics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
    });

    const {
        data: weeklyData,
        refetch: fetchWeeklyData,
    } = useQuery({
        queryKey: [ANALYTICS_QUERY_KEY, "weekly"],
        queryFn: () => apiClient.getWeeklySubmissions(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
    });

    const refreshData = async () => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_KEY] }),
            queryClient.invalidateQueries({ queryKey: [ANALYTICS_QUERY_KEY, "weekly"] }),
        ]);
    };

    return {
        dashboardData,
        weeklyData,
        isLoading,
        error,
        fetchDashboardData,
        fetchWeeklyData,
        refreshData,
    };
}; 
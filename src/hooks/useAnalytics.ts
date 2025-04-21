
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export const useAnalytics = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: async () => {
      try {
        // This is a mock for now since we don't have the actual API
        return {
          totalApplications: 24,
          forwardedApplications: 8,
          inReviewApplications: 6,
          averageCompletionTime: 75, // in minutes
          weeklyBreakdown: [
            { week: 'Week 1', count: 5 },
            { week: 'Week 2', count: 7 },
            { week: 'Week 3', count: 3 },
            { week: 'Week 4', count: 9 }
          ]
        };
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
      }
    }
  });

  const fetchDashboardData = async () => {
    return await refetch();
  };

  const refreshData = async () => {
    return await refetch();
  };

  return {
    dashboardData: data,
    isLoading,
    error,
    fetchDashboardData,
    refreshData
  };
};

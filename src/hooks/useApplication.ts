
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/apiClient";
import { Application, ApplicationStatus, IncomeData, RentalHistory } from '@/types/application';

interface ApplicationState {
    application: Application | null;
    isLoading: boolean;
    error: string | null;
}

interface ApplicationStatistics {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
}

export const useApplication = (applicationId?: string) => {
    const [state, setState] = useState<ApplicationState>({
        application: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (applicationId) {
            fetchApplication();
        }
    }, [applicationId]);

    const fetchApplication = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await apiClient.getApplication(applicationId!);
            setState(prev => ({
                ...prev,
                application: response,
                isLoading: false,
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch application',
            }));
        }
    };

    const getApplicationStatistics = async (): Promise<ApplicationStatistics> => {
        const response = await apiClient.getDashboardAnalytics();
        return {
            totalApplications: response.totalApplications,
            pendingApplications: response.submittedApplications + response.inReviewApplications,
            approvedApplications: response.approvedApplications || 0,
            rejectedApplications: response.rejectedApplications || 0,
        };
    };

    const getApplications = async (status?: ApplicationStatus) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const applications = await apiClient.getApplications(status);
            return applications;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch applications',
            }));
            throw error;
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const generateApplicationLink = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const link = await apiClient.generateApplicationLink();
            setState(prev => ({
                ...prev,
                isLoading: false,
            }));
            return link;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to generate application link',
            }));
            throw error;
        }
    };

    const updateBioInfo = async (bioInfo: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(applicationId!, {
                bio_info: bioInfo
            });
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update bio information',
            }));
            throw error;
        }
    };

    const updateRentalHistory = async (rentalHistory: RentalHistory) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(applicationId!, {
                rental_history: rentalHistory
            });
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update rental history',
            }));
            throw error;
        }
    };

    const updateIncome = async (income: IncomeData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(applicationId!, {
                income: income
            });
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update income information',
            }));
            throw error;
        }
    };

    const updateOREAForm = async (oreaForm: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(applicationId!, {
                orea_form: oreaForm
            });
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update OREA form',
            }));
            throw error;
        }
    };

    const uploadDocument = async (file: File, type: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.uploadDocument(applicationId!, file, type);
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to upload document',
            }));
            throw error;
        }
    };

    const updateStatus = async (status: ApplicationStatus) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(applicationId!, {
                status
            });
            setState(prev => ({
                ...prev,
                application: updatedApplication,
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update application status',
            }));
            throw error;
        }
    };

    return {
        ...state,
        generateApplicationLink,
        updateBioInfo,
        updateRentalHistory,
        updateIncome,
        updateOREAForm,
        uploadDocument,
        updateStatus,
        getApplicationStatistics,
        getApplications
    };
};

import { useState } from 'react';
import { apiClient } from '../lib/api/apiClient';
import { ApplicationStatus } from '../types/application';

interface ApplicationsState {
    applications: any[];
    isLoading: boolean;
    error: string | null;
}

export const useApplications = () => {
    const [state, setState] = useState<ApplicationsState>({
        applications: [],
        isLoading: false,
        error: null,
    });

    const fetchApplications = async (status?: ApplicationStatus) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const applications = await apiClient.getApplications(status);
            setState(prev => ({
                ...prev,
                applications,
                isLoading: false,
            }));
            return applications;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch applications',
            }));
            throw error;
        }
    };

    const createApplication = async (data: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const application = await apiClient.createApplication(data);
            setState(prev => ({
                ...prev,
                applications: [...prev.applications, application],
                isLoading: false,
            }));
            return application;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to create application',
            }));
            throw error;
        }
    };

    const updateApplication = async (id: string, data: any) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.updateApplication(id, data);
            setState(prev => ({
                ...prev,
                applications: prev.applications.map(app =>
                    app.id === id ? updatedApplication : app
                ),
                isLoading: false,
            }));
            return updatedApplication;
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to update application',
            }));
            throw error;
        }
    };

    const uploadDocument = async (id: string, file: File, type?: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const updatedApplication = await apiClient.uploadDocument(id, file, type);
            setState(prev => ({
                ...prev,
                applications: prev.applications.map(app =>
                    app.id === id ? updatedApplication : app
                ),
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

    return {
        ...state,
        fetchApplications,
        createApplication,
        updateApplication,
        uploadDocument,
    };
}; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api/apiClient';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    full_name: string;
    company_name: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.loginAgent(data);
            apiClient.setToken(response.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.registerAgent(data);
            apiClient.setToken(response.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to register');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await apiClient.logout();
            apiClient.setToken(null);
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to logout');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        register,
        logout,
        isLoading,
        error
    };
}; 
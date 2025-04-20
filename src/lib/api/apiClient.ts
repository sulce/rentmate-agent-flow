import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { Application, ApplicationStatus } from '@/types/application';

interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        companyName?: string;
    };
}

interface ApplicationResponse {
    id: string;
    status: string;
    bio_info: any;
    orea_form: any;
    documents: any[];
    created_at: string;
    updated_at: string;
}

interface ApiError {
    message: string;
    status?: number;
}

class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private token: string | null = null;

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        

        // Load token from localStorage
        this.token = localStorage.getItem('token');

        // Add request interceptor to attach token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle 401 errors
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    this.setToken(null);
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public setToken(token: string | null): void {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    public getToken(): string | null {
        return this.token || localStorage.getItem('token');
    }

    private async request<T>(config: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        url: string;
        data?: any;
    }): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({
                method: config.method,
                url: config.url,
                data: config.data,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw {
                    message: error.response?.data?.detail || error.message,
                    status: error.response?.status,
                } as ApiError;
            }
            throw error;
        }
    }

    public async registerAgent(data: {
        email: string;
        password: string;
        full_name: string;
        company_name: string;
    }): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.AUTH.REGISTER,
            data,
        });
        this.setToken(response.token);
        return response;
    }

    public async loginAgent(data: { email: string; password: string }): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
            data,
        });
        this.setToken(response.token);
        return response;
    }

    public async logout(): Promise<void> {
        await this.request({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        });
        this.setToken(null);
    }

    public async createApplication(data: { link_id: string }): Promise<Application> {
        return this.request<Application>({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.APPLICATIONS.BASE,
            data,
        });
    }

    public async getApplications(status?: string): Promise<Application[]> {
        const url = status
            ? `${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}?status=${status}`
            : API_CONFIG.ENDPOINTS.APPLICATIONS.BASE;
        return this.request<Application[]>({
            method: 'GET',
            url,
        });
    }

    public async getApplication(id: string): Promise<Application> {
        return this.request<Application>({
            method: 'GET',
            url: API_CONFIG.ENDPOINTS.APPLICATIONS.BY_ID(id),
        });
    }

    public async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
        return this.request<Application>({
            method: 'PUT',
            url: API_CONFIG.ENDPOINTS.APPLICATIONS.BY_ID(id),
            data,
        });
    }

    public async uploadDocument(id: string, file: File, type?: string): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);
        if (type) {
            formData.append('document_type', type);
        }

        await this.request({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.APPLICATIONS.DOCUMENTS(id),
            data: formData,
        });
    }

    public async getDashboardAnalytics(): Promise<any> {
        return this.request({
            method: 'GET',
            url: API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD,
        });
    }

    public async getWeeklySubmissions(): Promise<any> {
        return this.request({
            method: 'GET',
            url: API_CONFIG.ENDPOINTS.ANALYTICS.WEEKLY_SUBMISSIONS,
        });
    }

    public async generateApplicationLink(): Promise<{ link_id: string; url: string }> {
        return this.request({
            method: 'POST',
            url: API_CONFIG.ENDPOINTS.LINKS.GENERATE,
        });
    }

    public async validateApplicationLink(linkId: string): Promise<{ isValid: boolean }> {
        return this.request<{ isValid: boolean }>({
          method: 'GET',
          url: API_CONFIG.ENDPOINTS.LINKS.VALIDATE(linkId)
        });
      }
    
      public async startApplication(linkId: string): Promise<Application> {
        return this.request<Application>({
          method: 'POST',
          url: `${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}/start`,
          data: { link_id: linkId }
        });
      }
}

export const apiClient = ApiClient.getInstance(); 
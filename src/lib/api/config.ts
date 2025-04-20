export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/api/v1/auth/register',
            LOGIN: '/api/v1/auth/login',
            LOGOUT: '/api/v1/auth/logout',
            VERIFY_EMAIL: '/api/v1/auth/verify-email',
            RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
            FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
            RESET_PASSWORD: '/api/v1/auth/reset-password',
        },
        APPLICATIONS: {
            BASE: '/api/v1/applications',
            BY_ID: (id: string) => `/api/v1/applications/${id}`,
            DOCUMENTS: (id: string) => `/api/v1/applications/${id}/documents`,
            BY_LINK: '/api/v1/applications/by-link',
            UPDATE_STATUS: '/api/v1/applications/update-status',
        },
        LINKS: {
            GENERATE: '/api/v1/links/generate',
            VALIDATE: (linkId: string) => `/api/v1/links/validate/${linkId}`,
        },
        ANALYTICS: {
            DASHBOARD: '/api/v1/analytics/dashboard',
            WEEKLY_SUBMISSIONS: '/api/v1/analytics/weekly-submissions',
        },
    },
}; 
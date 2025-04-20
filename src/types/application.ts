export enum ApplicationStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    IN_REVIEW = 'in_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface BioInfo {
    first_name: string;
    last_name: string;
    bio?: string;
    move_in_date?: Date;
    profile_image?: string;
    prompts?: Record<string, any>;
}

export interface OREAForm {
    form_data: Record<string, any>;
    signed_url?: string;
    uploaded_url?: string;
}

export interface Document {
    type: string;
    url: string;
    uploaded_at: string;
}

export interface Application {
    id: string;
    agent_id: string;
    status: ApplicationStatus;
    bio_info: BioInfo;
    orea_form?: any;
    documents?: any[];
    created_at: string;
    updated_at: string;
}

export interface DashboardAnalytics {
    total_applications: number;
    weekly_submissions: number;
    status_breakdown: Record<ApplicationStatus, number>;
    latest_applications: Array<{
        id: string;
        tenant_name: string;
        status: ApplicationStatus;
        created_at: string;
        move_in_date: string;
    }>;
}

export interface WeeklySubmission {
    week: string;
    submissions: number;
} 
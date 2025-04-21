
export type ApplicationStatus = 
  | "draft"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "forwarded";

export interface Document {
  type: string;
  url: string;
  uploaded_at: string;
  name?: string;
}

export interface BioInfo {
  first_name: string;
  last_name: string;
  bio?: string;
  move_in_date?: string;
  profile_image?: string;
  prompts?: Record<string, string>;
}

export interface OREAForm {
  form_data?: Record<string, any>;
  signed_url?: string;
  uploaded_url?: string;
}

export interface RentalHistory {
  current_address?: string;
  current_landlord?: string;
  current_rent?: number;
  time_at_address?: string;
  reason_for_leaving?: string;
  previous_addresses?: {
    address: string;
    landlord?: string;
    rent?: number;
    time_at_address?: string;
    reason_for_leaving?: string;
  }[];
}

export interface IncomeData {
  employment_status?: 'employed' | 'self-employed' | 'student' | 'retired' | 'unemployed';
  employer?: string;
  position?: string;
  income?: number;
  income_frequency?: 'hourly' | 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  employment_length?: string;
  additional_income_sources?: {
    source: string;
    amount: number;
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  }[];
}

export interface Application {
  id: string;
  agent_id?: string;
  status: ApplicationStatus;
  bio_info?: BioInfo;
  orea_form?: OREAForm;
  documents: Document[];
  notes?: string;
  created_at: string;
  updated_at: string;
  rental_history?: RentalHistory;
  income?: IncomeData;
  last_saved_step?: number;
  tenant_name?: string;
}

export interface ApplicationDisplay {
  id: string;
  tenant_name?: string;
  status: ApplicationStatus;
  created_at: string;
  property?: string;
}


declare interface Application {
  id: string;
  status: ApplicationStatus;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  bio_info?: any;
  rental_history?: RentalHistory;
  income?: IncomeData;
  documents?: Document[];
  orea_form?: any;
  created_at: string;
  updated_at: string;
}

declare type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'forwarded'
  | 'approved'
  | 'rejected';

declare interface Document {
  id?: string;
  name: string;
  url?: string;
  file?: File;
  type: DocumentType;
  uploaded_at?: string;
}

declare type DocumentType = 
  | 'ID'
  | 'EMPLOYMENT_LETTER'
  | 'CREDIT_REPORT'
  | 'BANK_STATEMENT'
  | 'REFERENCE_LETTER'
  | 'OREA_FORM'
  | 'OTHER';

declare interface RentalHistory {
  currentAddress: string;
  currentLandlord: string;
  currentRent: number;
  currentDuration: string;
  previousAddress: string;
  previousLandlord: string;
  previousRent: number;
  previousDuration: string;
}

declare interface IncomeData {
  employmentType: string;
  monthlyIncome: number;
  employerName: string;
  jobTitle: string;
  employmentDuration: string;
}

declare interface RentalHistoryFormProps {
  onSubmit: (data: RentalHistory) => void;
  initialData?: RentalHistory;
}

declare interface IncomeFormProps {
  onSubmit: (data: IncomeData) => void;
  initialData?: IncomeData;
}

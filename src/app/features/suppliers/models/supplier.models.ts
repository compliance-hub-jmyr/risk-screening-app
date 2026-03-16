// Enums (mirror exact .ToString() values from backend)

export type SupplierStatus = 'Pending' | 'Approved' | 'Rejected' | 'UnderReview';
export type RiskLevel = 'None' | 'Low' | 'Medium' | 'High';

// Response model

export interface SupplierResponse {
  id: string;
  legalName: string;
  commercialName: string;
  taxId: string;
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
  address: string | null;
  country: string; // ISO 3166-1 alpha-2, always UPPERCASE
  annualBillingUsd: number | null;
  riskLevel: RiskLevel;
  status: SupplierStatus;
  isDeleted: boolean;
  notes: string | null;
  createdAt: string; // ISO 8601 UTC string
  updatedAt: string; // ISO 8601 UTC string
  createdBy: string | null;
  updatedBy: string | null;
}

// Request models

export interface CreateSupplierRequest {
  LegalName: string;
  CommercialName: string;
  TaxId: string;
  Country: string;
  ContactPhone?: string | null;
  ContactEmail?: string | null;
  Website?: string | null;
  Address?: string | null;
  AnnualBillingUsd?: number | null;
  Notes?: string | null;
}

export interface UpdateSupplierRequest {
  LegalName: string;
  CommercialName: string;
  TaxId: string;
  Country: string;
  ContactPhone: string | null;
  ContactEmail: string | null;
  Website: string | null;
  Address: string | null;
  AnnualBillingUsd: number | null;
  Notes: string | null;
}

// Query params

export type SupplierSortField =
  | 'legalName'
  | 'commercialName'
  | 'taxId'
  | 'country'
  | 'status'
  | 'riskLevel'
  | 'createdAt'
  | 'updatedAt';

export type SortDirection = 'ASC' | 'DESC';

export interface SupplierFilters {
  legalName?: string;
  commercialName?: string;
  taxId?: string;
  country?: string;
  status?: SupplierStatus | '';
  riskLevel?: RiskLevel | '';
}

export interface SupplierPageRequest extends SupplierFilters {
  page: number;
  size: number;
  sortBy: SupplierSortField;
  sortDirection: SortDirection;
}

export enum DoctorStatus {
  Active = 'Active',
  Expired = 'Expired',
  Suspended = 'Suspended'
}

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: DoctorStatus;
  statusName: string;
  createdDate: string;
  daysExpired?: number;
}

export interface CreateDoctorDto {
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
}

export interface UpdateDoctorDto {
  fullName: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: DoctorStatus;
}

export interface DoctorSearchDto {
  searchTerm?: string;
  status?: DoctorStatus;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

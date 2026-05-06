import { Doctor, CreateDoctorDto, UpdateDoctorDto, DoctorSearchDto, PaginationResult, DoctorStatus } from '@/types/doctor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
};

export const doctorApi = {
  // Get all doctors with search and filter
  getDoctors: async (searchDto: DoctorSearchDto = {}): Promise<PaginationResult<Doctor>> => {
    const params = new URLSearchParams();
    if (searchDto.searchTerm) params.append('searchTerm', searchDto.searchTerm);
    if (searchDto.status) params.append('status', searchDto.status);
    params.append('pageNumber', (searchDto.pageNumber || 1).toString());
    params.append('pageSize', (searchDto.pageSize || 50).toString());

    const response = await fetch(`${API_BASE_URL}/doctors?${params}`);
    return handleResponse(response);
  },

  // Get doctor by ID
  getDoctor: async (id: number): Promise<Doctor> => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
    return handleResponse(response);
  },

  // Get expired doctors
  getExpiredDoctors: async (pageNumber = 1, pageSize = 50): Promise<PaginationResult<Doctor>> => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    });
    
    const response = await fetch(`${API_BASE_URL}/doctors/expired?${params}`);
    return handleResponse(response);
  },

  // Create new doctor
  createDoctor: async (doctor: CreateDoctorDto): Promise<Doctor> => {
    const response = await fetch(`${API_BASE_URL}/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    });
    return handleResponse(response);
  },

  // Update doctor
  updateDoctor: async (id: number, doctor: UpdateDoctorDto): Promise<Doctor> => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    });
    return handleResponse(response);
  },

  // Update doctor status
  updateDoctorStatus: async (id: number, status: DoctorStatus): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    });
    await handleResponse(response);
  },

  // Delete doctor (soft delete)
  deleteDoctor: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

export { ApiError };

'use client';

import { Doctor, DoctorStatus } from '@/types/doctor';

interface DoctorTableProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: DoctorStatus) => void;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const getStatusBadgeClass = (status: DoctorStatus | string | number) => {
  // Debug logging
  console.log('getStatusBadgeClass called with:', status, typeof status);
  
  // Handle number status values
  if (typeof status === 'number') {
    switch (status) {
      case 0:
        console.log('Returning Active number badge');
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm';
      case 1:
        console.log('Returning Expired number badge');
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-300 shadow-sm';
      case 2:
        console.log('Returning Suspended number badge');
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300 shadow-sm';
      default:
        console.log('Returning default badge for unknown number:', status);
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-sm';
    }
  }
  
  // Handle string status values
  if (typeof status === 'string') {
    switch (status) {
      case 'Active':
        console.log('Returning Active badge');
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm';
      case 'Expired':
        console.log('Returning Expired badge');
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-300 shadow-sm';
      case 'Suspended':
        console.log('Returning Suspended badge');
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300 shadow-sm';
      default:
        console.log('Returning default badge for unknown string:', status);
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-sm';
    }
  }
  
  // Handle DoctorStatus enum values
  switch (status) {
    case DoctorStatus.Active:
      console.log('Returning Active enum badge');
      return 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm';
    case DoctorStatus.Expired:
      console.log('Returning Expired enum badge');
      return 'bg-gradient-to-r from-red-100 to-rose-100 text-rose-800 border border-rose-300 shadow-sm';
    case DoctorStatus.Suspended:
      console.log('Returning Suspended enum badge');
      return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300 shadow-sm';
    default:
      console.log('Returning default badge for unknown enum:', status);
      return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 shadow-sm';
  }
};

const getStatusName = (status: DoctorStatus | number | string): string => {
  // If status is already a string, return it
  if (typeof status === 'string') {
    return status;
  }
  
  // If status is a number, convert to string
  if (typeof status === 'number') {
    switch (status) {
      case 0:
        return 'Active';
      case 1:
        return 'Expired';
      case 2:
        return 'Suspended';
      default:
        return 'Unknown';
    }
  }
  
  // If status is DoctorStatus enum, convert to string
  if (status === DoctorStatus.Active) return 'Active';
  if (status === DoctorStatus.Expired) return 'Expired';
  if (status === DoctorStatus.Suspended) return 'Suspended';
  
  return 'Unknown';
};

const isExpired = (doctor: Doctor) => {
  return doctor.status === DoctorStatus.Expired || 
         (doctor.daysExpired && doctor.daysExpired > 0);
};

export default function DoctorTable({
  doctors,
  onEdit,
  onDelete,
  onStatusUpdate,
  currentPage,
  totalCount,
  pageSize,
  onPageChange
}: DoctorTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  const handleStatusChange = (id: number, newStatus: DoctorStatus) => {
    onStatusUpdate(id, newStatus);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-purple-100">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">
            Doctors ({startRecord}-{endRecord} of {totalCount})
          </h3>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      License Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr 
                      key={doctor.id} 
                      className={isExpired(doctor) ? 'bg-red-50' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {doctor.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.licenseNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doctor.licenseExpiryDate).toLocaleDateString()}
                        {doctor.daysExpired && (
                          <span className="ml-2 text-xs text-red-600">
                            ({doctor.daysExpired} days expired)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(doctor.status)}`}>
                          {getStatusName(doctor.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEdit(doctor)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Edit
                            </span>
                          </button>
                          <button
                            onClick={() => onDelete(doctor.id)}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className={`border rounded-lg p-4 ${isExpired(doctor) ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base">{doctor.fullName}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(doctor.status)}`}>
                      {getStatusName(doctor.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="text-gray-600 break-all">{doctor.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-medium text-gray-700">License:</span>
                      <span className="text-gray-600">{doctor.licenseNumber}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <span className="font-medium text-gray-700">Expiry:</span>
                      <div>
                        <span className="text-gray-600">{new Date(doctor.licenseExpiryDate).toLocaleDateString()}</span>
                        {doctor.daysExpired && (
                          <span className="ml-2 text-xs text-red-600">
                            ({doctor.daysExpired} days expired)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onEdit(doctor)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(doctor.id)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="text-sm text-gray-700 text-center sm:text-left">
              Showing {startRecord} to {endRecord} of {totalCount} results
            </div>
            <div className="flex justify-center sm:justify-end items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 sm:px-4 py-2 text-sm border border-purple-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-all duration-200 font-medium text-purple-700"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-2 sm:px-3 py-1 text-sm border rounded-md ${
                      pageNum === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 sm:px-4 py-2 text-sm border border-purple-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-all duration-200 font-medium text-purple-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

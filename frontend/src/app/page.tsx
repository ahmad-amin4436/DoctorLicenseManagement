'use client';

import { useState, useEffect } from 'react';
import { Doctor, DoctorSearchDto, DoctorStatus } from '@/types/doctor';
import { doctorApi } from '@/lib/api';
import DoctorTable from '@/components/DoctorTable';
import DoctorForm from '@/components/DoctorForm';
import SearchFilter from '@/components/SearchFilter';

export default function Home() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchDto, setSearchDto] = useState<DoctorSearchDto>({
    pageNumber: 1,
    pageSize: 50
  });
  const [totalCount, setTotalCount] = useState(0);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await doctorApi.getDoctors(searchDto);
      setDoctors(result.data);
      setTotalCount(result.totalCount);
    } catch (err: any) {
      setError(err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [searchDto]);

  const handleSearch = (newSearch: DoctorSearchDto) => {
    setSearchDto({ ...newSearch, pageNumber: 1 });
  };

  const handlePageChange = (page: number) => {
    setSearchDto(prev => ({ ...prev, pageNumber: page }));
  };

  const handleCreate = () => {
    setEditingDoctor(null);
    setShowForm(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  const handleSave = async () => {
    setShowForm(false);
    setEditingDoctor(null);
    await loadDoctors();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorApi.deleteDoctor(id);
        await loadDoctors();
      } catch (err: any) {
        setError(err.message || 'Failed to delete doctor');
      }
    }
  };

  const handleStatusUpdate = async (id: number, status: DoctorStatus) => {
    try {
      await doctorApi.updateDoctorStatus(id, status);
      await loadDoctors();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border border-purple-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0 mb-4 lg:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
                Doctor License Management
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm lg:text-base">Manage and track medical licenses efficiently</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <SearchFilter onSearch={handleSearch} />
              <button
                onClick={handleCreate}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-xs sm:text-sm lg:text-base"
              >
                <span className="flex items-center justify-center">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2 flex items-center justify-center">
                    <span className="w-2.5 h-0.5 sm:w-3 sm:h-0.5 lg:w-4 lg:h-0.5 bg-white"></span>
                    <span className="w-2.5 h-0.5 sm:w-3 sm:h-0.5 lg:w-4 lg:h-0.5 bg-white rotate-90 absolute"></span>
                  </span>
                  <span className="hidden sm:inline">Add New Doctor</span>
                  <span className="sm:hidden">Add</span>
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        ) : (
          <DoctorTable
            doctors={doctors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
            currentPage={searchDto.pageNumber || 1}
            totalCount={totalCount}
            pageSize={searchDto.pageSize || 50}
            onPageChange={handlePageChange}
          />
        )}
        {showForm && (
          <DoctorForm
            doctor={editingDoctor}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </main>
  );
}

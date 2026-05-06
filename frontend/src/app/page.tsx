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
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Doctor License Management</h1>
        
        <div className="flex justify-between items-center mb-6">
          <SearchFilter onSearch={handleSearch} />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Doctor
          </button>
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
    </main>
  );
}

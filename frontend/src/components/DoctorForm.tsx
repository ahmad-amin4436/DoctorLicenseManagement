'use client';

import { useState, useEffect } from 'react';
import { Doctor, CreateDoctorDto, UpdateDoctorDto, DoctorStatus } from '@/types/doctor';
import { doctorApi } from '@/lib/api';

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function DoctorForm({ doctor, onSave, onCancel }: DoctorFormProps) {
  const [formData, setFormData] = useState<CreateDoctorDto>({
    fullName: '',
    email: '',
    specialization: '',
    licenseNumber: '',
    licenseExpiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (doctor) {
      setFormData({
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        licenseExpiryDate: doctor.licenseExpiryDate.split('T')[0]
      });
    }
  }, [doctor]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }
    if (!formData.licenseExpiryDate) {
      newErrors.licenseExpiryDate = 'License expiry date is required';
    } else if (new Date(formData.licenseExpiryDate) <= new Date()) {
      newErrors.licenseExpiryDate = 'License expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (doctor) {
        const updateData: UpdateDoctorDto = {
          ...formData,
          status: doctor.status
        };
        await doctorApi.updateDoctor(doctor.id, updateData);
      } else {
        await doctorApi.createDoctor(formData);
      }
      
      onSave();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to save doctor' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-8 lg:top-20 mx-auto p-4 sm:p-6 border w-full max-w-md sm:w-96 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-md border border-purple-200">
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {doctor ? 'Edit Doctor' : 'Add New Doctor'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          
          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                disabled={loading}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization *
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                disabled={loading}
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
              )}
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                License Number *
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                disabled={loading}
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="licenseExpiryDate" className="block text-sm font-medium text-gray-700">
                License Expiry Date *
              </label>
              <input
                type="date"
                id="licenseExpiryDate"
                name="licenseExpiryDate"
                value={formData.licenseExpiryDate}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
                disabled={loading}
              />
              {errors.licenseExpiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.licenseExpiryDate}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-lg shadow-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 font-semibold text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? 'Saving...' : (doctor ? 'Update Doctor' : 'Create New Doctor')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

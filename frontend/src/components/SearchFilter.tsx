'use client';

import { useState } from 'react';
import { DoctorSearchDto, DoctorStatus } from '@/types/doctor';

interface SearchFilterProps {
  onSearch: (search: DoctorSearchDto) => void;
}

export default function SearchFilter({ onSearch }: SearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<DoctorStatus | ''>('');

  const handleSearch = () => {
    onSearch({
      searchTerm: searchTerm.trim() || undefined,
      status: status || undefined,
      pageNumber: 1
    });
  };

  const handleQuickSearch = (value: string) => {
    onSearch({
      searchTerm: value.trim() || undefined,
      status: status || undefined,
      pageNumber: 1
    });
  };

  const handleClear = () => {
    setSearchTerm('');
    setStatus('');
    onSearch({});
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-purple-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or License
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleQuickSearch(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter name or license number..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white text-sm sm:text-base"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as DoctorStatus);
              handleSearch();
            }}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm sm:text-base"
          >
            <option value="">All Statuses</option>
            <option value={DoctorStatus.Active}>Active</option>
            <option value={DoctorStatus.Expired}>Expired</option>
            <option value={DoctorStatus.Suspended}>Suspended</option>
          </select>
        </div>

        <div className="flex justify-start">
          <button
            onClick={handleClear}
            className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm sm:text-base"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

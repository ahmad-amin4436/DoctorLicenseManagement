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
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or License
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter name or license number..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as DoctorStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value={DoctorStatus.Active}>Active</option>
            <option value={DoctorStatus.Expired}>Expired</option>
            <option value={DoctorStatus.Suspended}>Suspended</option>
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

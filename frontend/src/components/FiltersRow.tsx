import React from 'react';
import { FiltersRowProps } from '../types/dashboard';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.5" stroke="#484831" strokeWidth="1.5" />
    <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#484831" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FiltersRow: React.FC<FiltersRowProps> = ({
  search,
  department,
  location,
  status,
  departments,
  locations,
  onSearchChange,
  onDepartmentChange,
  onLocationChange,
  onStatusChange,
}) => (
  <div className="bg-[#f3f3f3] border-2 border-[#1a1c1c] flex gap-[16px] items-center p-[18px] w-full shrink-0">
    <label htmlFor="search-roles" className="sr-only">Search roles</label>
    <div className="bg-white border-2 border-[#1a1c1c] flex gap-[8px] items-center flex-1 min-w-[200px] px-[14px] py-[10px]">
      <SearchIcon />
      <input
        id="search-roles"
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search roles..."
        className="flex-1 bg-transparent font-arimo text-[16px] text-[#484831] outline-none placeholder:text-[#484831]"
      />
    </div>

    <label htmlFor="filter-department" className="sr-only">Department</label>
    <select
      id="filter-department"
      value={department}
      onChange={(e) => onDepartmentChange(e.target.value)}
      className="bg-white border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] px-[18px] py-[10px] shrink-0 font-space font-bold text-[14px] text-[#1a1c1c] cursor-pointer outline-none"
    >
      <option value="All">Department: All</option>
      {departments.map((d) => (
        <option key={d} value={d}>
          Department: {d}
        </option>
      ))}
    </select>

    <label htmlFor="filter-location" className="sr-only">Location</label>
    <select
      id="filter-location"
      value={location}
      onChange={(e) => onLocationChange(e.target.value)}
      className="bg-white border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] px-[18px] py-[10px] shrink-0 font-space font-bold text-[14px] text-[#1a1c1c] cursor-pointer outline-none"
    >
      <option value="All">Location: All</option>
      {locations.map((l) => (
        <option key={l} value={l}>
          Location: {l}
        </option>
      ))}
    </select>

    <label htmlFor="filter-status" className="sr-only">Status</label>
    <select
      id="filter-status"
      value={status}
      onChange={(e) => onStatusChange(e.target.value)}
      className="bg-white border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] px-[18px] py-[10px] shrink-0 font-space font-bold text-[14px] text-[#1a1c1c] cursor-pointer outline-none"
    >
      <option value="All">Status: All</option>
      <option value="Open">Status: Open</option>
      <option value="Paused">Status: Paused</option>
      <option value="Closed">Status: Closed</option>
      <option value="Draft">Status: Draft</option>
    </select>
  </div>
);

export default FiltersRow;

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Position } from '../types/dashboard';
import { fetchPositions } from '../services/positionService';
import StatCard from './StatCard';
import FiltersRow from './FiltersRow';
import PositionsTable from './PositionsTable';

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <line x1="9" y1="2" x2="9" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PositionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [location, setLocation] = useState('All');
  const [status, setStatus] = useState('Open');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openCount = useMemo(
    () => positions.filter((p) => p.status.toLowerCase() === 'open').length,
    [positions]
  );

  const departments = useMemo(
    () => Array.from(new Set(positions.map((p) => p.department).filter(Boolean))),
    [positions]
  );

  const locations = useMemo(
    () => Array.from(new Set(positions.map((p) => p.location).filter(Boolean))),
    [positions]
  );

  const filteredPositions = useMemo(
    () =>
      positions
        .filter(
          (p) => search === '' || p.title.toLowerCase().includes(search.toLowerCase())
        )
        .filter((p) => department === 'All' || p.department === department)
        .filter((p) => location === 'All' || p.location === location)
        .filter(
          (p) => status === 'All' || p.status.toLowerCase() === status.toLowerCase()
        ),
    [positions, search, department, location, status]
  );

  const handleView = (id: number) => navigate(`/positions/${id}`);
  const handleNewPosition = () => navigate('/add-candidate');

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[400px]">
        <span className="font-arimo text-[16px] text-[#484831]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f9] flex flex-col gap-[32px] p-[48px] min-h-[960px] w-full">
      <div className="flex items-end justify-between shrink-0">
        <div className="flex flex-col gap-[8px]">
          <div className="font-space font-bold text-[14px] leading-[20px]">
            <span className="text-[#484831]">Home / </span>
            <span className="text-[#1a1c1c]">Positions</span>
          </div>
          <h1 className="font-hanken font-black text-[72px] text-[#1a1c1c] tracking-[-3.6px] leading-[72px] m-0">
            Positions
          </h1>
        </div>
        <button
          onClick={handleNewPosition}
          className="bg-[#ffff00] border-2 border-[#1a1c1c] drop-shadow-[4px_4px_0px_#1a1c1c] px-[26px] py-[14px] flex gap-[8px] items-center font-space font-bold text-[14px] text-[#1a1c1c] hover:bg-[#1a1c1c] hover:text-[#ffff00] shrink-0"
        >
          <PlusIcon />
          New position
        </button>
      </div>

      <div className="grid grid-cols-4 gap-[24px] shrink-0 w-full">
        <StatCard label="OPEN ROLES" value={String(openCount)} />
        <StatCard label="TOTAL APPLICANTS" value="–" />
        <StatCard label="INTERVIEWS THIS WEEK" value="–" />
        <StatCard label="TIME-TO-FILL (AVG)" value="–" suffix="days" />
      </div>

      <FiltersRow
        search={search}
        department={department}
        location={location}
        status={status}
        departments={departments}
        locations={locations}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartment}
        onLocationChange={setLocation}
        onStatusChange={setStatus}
      />

      {error && (
        <div className="rounded border border-red-300 bg-red-50 text-red-800 p-4">
          {error}
        </div>
      )}

      <PositionsTable positions={filteredPositions} onView={handleView} />
    </div>
  );
};

export default PositionsPage;

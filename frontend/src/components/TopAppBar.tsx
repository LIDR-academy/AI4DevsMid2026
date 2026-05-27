import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.5" stroke="#484831" strokeWidth="1.5" />
    <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="#484831" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" aria-hidden="true">
    <path d="M8 1C5.24 1 3 3.24 3 6v6l-2 2v1h14v-1l-2-2V6c0-2.76-2.24-5-5-5z" stroke="#1a1c1c" strokeWidth="1.5" />
    <path d="M6 17c0 1.1.9 2 2 2s2-.9 2-2" stroke="#1a1c1c" strokeWidth="1.5" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" stroke="#1a1c1c" strokeWidth="1.5" />
    <path d="M7.5 7.5C7.5 6.12 8.62 5 10 5s2.5 1.12 2.5 2.5c0 1.5-2.5 2-2.5 3.5" stroke="#1a1c1c" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="0.75" fill="#1a1c1c" />
  </svg>
);

const TopAppBar: React.FC = () => {
  const [globalSearch, setGlobalSearch] = useState('');
  const location = useLocation();

  const isRecruitmentActive =
    location.pathname.startsWith('/positions') || location.pathname === '/add-candidate';

  return (
    <header className="bg-[#f9f9f9] border-b-2 border-[#1a1c1c] fixed top-0 left-[256px] right-0 h-[64px] z-10 flex items-center justify-between px-[48px]">
      <div className="flex gap-[32px] items-center h-full">
        <div className="flex gap-[8px] items-center">
          <SearchIcon />
          <input
            type="text"
            aria-label="Global search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search..."
            className="w-[192px] bg-transparent font-arimo text-[16px] text-[#484831] outline-none placeholder:text-[#484831]"
          />
        </div>

        <nav className="flex h-full items-start" aria-label="Section navigation">
          <Link
            to="/"
            className={`flex h-full items-center px-[16px] font-space font-bold text-[14px] no-underline ${
              !isRecruitmentActive ? 'text-[#1a1c1c]' : 'text-[#484831]'
            }`}
          >
            Dashboard
          </Link>
          <div
            className={`flex h-full items-center px-[16px] font-space font-bold text-[14px] ${
              isRecruitmentActive
                ? 'bg-[#626200] border-b-2 border-[#0035c6] text-[#1a1c1c]'
                : 'text-[#484831]'
            }`}
          >
            Recruitment
          </div>
        </nav>
      </div>

      <div className="flex gap-[24px] items-center">
        <Link
          to="/add-candidate"
          className="font-space font-bold text-[14px] text-[#626200] underline"
        >
          Add Employee
        </Link>
        <div className="flex gap-[8px] items-center">
          <button className="p-[8px]" aria-label="Notifications">
            <BellIcon />
          </button>
          <button className="p-[8px]" aria-label="Help">
            <HelpIcon />
          </button>
        </div>
        <div className="bg-[#f7f7f7] border-2 border-[#1a1c1c] rounded-full w-[32px] h-[32px] overflow-hidden flex items-center justify-center shrink-0">
          <span className="font-space text-[10px] text-[#484831]">U</span>
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;

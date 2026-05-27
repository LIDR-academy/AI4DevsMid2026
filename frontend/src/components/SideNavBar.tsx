import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconPositions = () => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="18" height="17" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconApplicants = () => (
  <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="4" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="4" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M0 12c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 12c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconInterviews = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
    <rect x="1" y="3" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="13" y1="1" x2="13" y2="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="1" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconTeams = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 19c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconAnalytics = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden="true">
    <rect x="1" y="10" width="4" height="7" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="5" width="4" height="12" stroke="currentColor" strokeWidth="1.5" />
    <rect x="15" y="1" width="4" height="16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 1v2M10 17v2M1 10h2M17 10h2M3.22 3.22l1.41 1.41M15.37 15.37l1.41 1.41M3.22 16.78l1.41-1.41M15.37 4.63l1.41-1.41"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  enabled: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <IconDashboard />, enabled: true },
  { label: 'Positions', path: '/positions', icon: <IconPositions />, enabled: true },
  { label: 'Applicants', path: '/applicants', icon: <IconApplicants />, enabled: false },
  { label: 'Interviews', path: '/interviews', icon: <IconInterviews />, enabled: false },
  { label: 'Teams', path: '/teams', icon: <IconTeams />, enabled: false },
  { label: 'Analytics', path: '/analytics', icon: <IconAnalytics />, enabled: false },
];

const SideNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNewOpening = () => navigate('/add-candidate');

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="bg-[#eeeeee] border-r-2 border-[#1a1c1c] flex flex-col w-[256px] h-screen fixed left-0 top-0 z-20"
    >
      <div className="border-b-2 border-[#1a1c1c] px-[24px] pt-[24px] pb-[26px] shrink-0">
        <div className="font-hanken font-black text-[32px] text-[#1a1c1c] tracking-[-1.6px] leading-[36px] uppercase">
          LTI
        </div>
        <div className="font-space font-bold text-[14px] text-[#484831] leading-[20px]">
          HR Management
        </div>
      </div>

      <div className="border-b-2 border-[#1a1c1c] px-[16px] py-[16px] shrink-0">
        <button
          onClick={handleNewOpening}
          className="bg-[#1a1c1c] border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] w-full py-[14px] flex gap-[8px] items-center justify-center font-space font-bold text-[14px] text-white hover:bg-[#333333]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <line x1="7" y1="1" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New Opening
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex-1 pt-[16px]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            if (active) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current="page"
                  className="flex gap-[12px] items-center ml-[-4px] mr-[-4px] px-[16px] py-[14px] bg-[#ffff00] border-t-2 border-b-2 border-[#1a1c1c] font-space font-bold text-[14px] text-[#757500] no-underline"
                >
                  <span className="shrink-0 text-[#757500]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.enabled ? item.path : '#'}
                onClick={!item.enabled ? (e) => e.preventDefault() : undefined}
                className="flex gap-[12px] items-center px-[16px] py-[12px] font-space font-bold text-[14px] text-[#484831] no-underline hover:bg-[#e2e2e2]"
              >
                <span className="shrink-0 text-[#484831]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link
          to="/settings"
          onClick={(e) => e.preventDefault()}
          className="flex gap-[12px] items-center px-[16px] pb-[12px] pt-[14px] border-t-2 border-[#1a1c1c] font-space font-bold text-[14px] text-[#484831] no-underline hover:bg-[#e2e2e2] shrink-0"
        >
          <span className="shrink-0 text-[#484831]">
            <IconSettings />
          </span>
          Settings
        </Link>
      </div>
    </nav>
  );
};

export default SideNavBar;

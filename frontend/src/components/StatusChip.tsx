import React from 'react';
import { StatusChipProps } from '../types/dashboard';

const statusStyles: Record<string, string> = {
  OPEN: 'bg-[#ffff00] text-[#1a1c1c]',
  PAUSED: 'bg-[#e2e2e2] text-[#484831]',
  CLOSED: 'bg-[#1a1c1c] text-white',
  DRAFT: 'bg-white text-[#484831]',
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => (
  <span
    className={`border border-[#1a1c1c] px-[9px] py-[5px] font-space font-bold text-[12px] uppercase leading-[16px] ${statusStyles[status] ?? statusStyles.DRAFT}`}
  >
    {status}
  </span>
);

export default StatusChip;

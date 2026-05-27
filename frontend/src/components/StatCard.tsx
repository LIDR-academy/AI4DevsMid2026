import React from 'react';
import { StatCardProps } from '../types/dashboard';

const StatCard: React.FC<StatCardProps> = ({ label, value, suffix }) => (
  <div className="bg-white border-2 border-[#1a1c1c] drop-shadow-[2px_2px_0px_#1a1c1c] flex flex-col gap-[8px] px-[26px] pt-[26px] pb-[46px]">
    <span className="font-space font-bold text-[14px] text-[#484831] uppercase leading-[20px]">
      {label}
    </span>
    <div className="flex items-baseline gap-[6px]">
      <span className="font-hanken font-extrabold text-[48px] text-[#1a1c1c] tracking-[-0.96px] leading-[52px]">
        {value}
      </span>
      {suffix && (
        <span className="font-hanken font-bold text-[32px] text-[#484831] tracking-[-0.96px] leading-[36px]">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

export default StatCard;

import React from 'react';
import { ManagerCellProps } from '../types/dashboard';

const ManagerCell: React.FC<ManagerCellProps> = ({ name, avatarUrl, initials }) => (
  <div className="flex gap-[12px] items-center">
    <div className="w-[32px] h-[32px] rounded-full border border-[#1a1c1c] overflow-hidden shrink-0 bg-[#5e5e5e] flex items-center justify-center">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-space text-[12px] text-white">
          {initials ?? '?'}
        </span>
      )}
    </div>
    <span className="font-arimo text-[16px] text-[#1a1c1c] leading-normal">
      {name}
    </span>
  </div>
);

export default ManagerCell;

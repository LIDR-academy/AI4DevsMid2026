import React from 'react';
import { PipelineBarProps } from '../types/dashboard';

const PipelineBar: React.FC<PipelineBarProps> = ({ activeCount }) => (
  <div className="flex flex-col gap-[4px] items-center">
    <div className="flex gap-[4px] items-end h-[24px]">
      <div className="w-[21px] h-[24px] bg-[#ffff00] border border-[#1a1c1c]" />
      <div className="w-[21px] h-[18px] bg-[#1a1c1c]" />
      <div className="w-[21px] h-[12px] bg-[#1a1c1c]" />
      <div className="w-[21px] h-[6px] border border-[#1a1c1c] border-dashed" />
    </div>
    <span className="font-arimo font-bold text-[12px] text-[#484831] text-center whitespace-nowrap leading-[16px]">
      {activeCount} Active
    </span>
  </div>
);

export default PipelineBar;

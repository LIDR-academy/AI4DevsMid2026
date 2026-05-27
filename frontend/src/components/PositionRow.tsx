import React from 'react';
import { PositionRowProps, StatusChipStatus } from '../types/dashboard';
import StatusChip from './StatusChip';
import PipelineBar from './PipelineBar';
import ManagerCell from './ManagerCell';

const normalizeStatus = (status: string): StatusChipStatus => {
  const s = status.toUpperCase();
  if (s === 'OPEN') return 'OPEN';
  if (s === 'PAUSED') return 'PAUSED';
  if (s === 'CLOSED' || s === 'FILLED') return 'CLOSED';
  return 'DRAFT';
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const PositionRow: React.FC<PositionRowProps> = ({ position, onView }) => (
  <tr className="border-b border-[#1a1c1c]">
    <td className="border-r border-[#1a1c1c] px-[16px] py-[20px] align-top w-[231px]">
      <div className="font-arimo font-bold text-[16px] text-[#1a1c1c] leading-normal">
        {position.title}
      </div>
      <div className="font-arimo font-bold text-[12px] text-[#484831] leading-[16px]">
        {position.companyName}
      </div>
    </td>
    <td className="border-r border-[#1a1c1c] px-[16px] py-[22px] align-top w-[166px]">
      <div className="font-arimo text-[16px] text-[#1a1c1c] leading-normal">
        {position.department || '–'}
      </div>
      <div className="font-arimo font-bold text-[12px] text-[#484831] leading-[16px]">
        {position.location}
      </div>
    </td>
    <td className="border-r border-[#1a1c1c] px-[16px] py-[16px] align-middle w-[174px]">
      {position.hiringManager ? (
        <ManagerCell
          name={position.hiringManager}
          avatarUrl={position.hiringManagerAvatar}
          initials={position.hiringManagerInitials ?? getInitials(position.hiringManager)}
        />
      ) : (
        <span className="font-arimo text-[16px] text-[#484831]">–</span>
      )}
    </td>
    <td className="border-r border-[#1a1c1c] px-[16px] py-[16px] align-middle w-[128px]">
      <PipelineBar total={4} activeCount={position.activeApplicants ?? 0} />
    </td>
    <td className="border-r border-[#1a1c1c] px-[16px] py-[26px] align-middle w-[95px]">
      <StatusChip status={normalizeStatus(position.status)} />
    </td>
    <td className="px-[16px] py-[22px] align-middle w-[130px]">
      <div className="flex gap-[8px] items-center justify-end">
        <button
          onClick={() => onView(position.id)}
          aria-label={`View ${position.title}`}
          className="bg-white border border-[#1a1c1c] px-[13px] py-[5px] font-space font-bold text-[12px] text-[#1a1c1c] uppercase hover:bg-[#1a1c1c] hover:text-white"
        >
          VIEW
        </button>
        <button
          aria-label={`More actions for ${position.title}`}
          className="p-[5px] font-space font-bold text-[16px] text-[#1a1c1c] leading-none"
        >
          ···
        </button>
      </div>
    </td>
  </tr>
);

export default PositionRow;

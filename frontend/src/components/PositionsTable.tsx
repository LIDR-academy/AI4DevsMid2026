import React from 'react';
import { PositionsTableProps } from '../types/dashboard';
import PositionRow from './PositionRow';

const HEADERS = [
  { label: 'ROLE', right: false },
  { label: 'DEPT /\nLOCATION', right: false },
  { label: 'HIRING MANAGER', right: false },
  { label: 'PIPELINE', right: false },
  { label: 'STATUS', right: false },
  { label: 'ACTIONS', right: true },
];

const PositionsTable: React.FC<PositionsTableProps> = ({ positions, onView }) => (
  <div className="bg-white border-2 border-[#1a1c1c] shadow-[4px_4px_0px_0px_#1a1c1c] overflow-auto w-full">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#1a1c1c]">
          {HEADERS.map((h, i) => (
            <th
              key={h.label}
              className={`border-b-2 border-[#1a1c1c] ${i < HEADERS.length - 1 ? 'border-r border-[#1a1c1c]' : ''} px-[16px] py-[25px] font-space font-bold text-[14px] text-white tracking-[0.7px] uppercase whitespace-pre-line ${h.right ? 'text-right' : 'text-left'}`}
            >
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {positions.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-[16px] py-[32px] text-center font-arimo text-[16px] text-[#484831]"
            >
              No positions found.
            </td>
          </tr>
        ) : (
          positions.map((position) => (
            <PositionRow key={position.id} position={position} onView={onView} />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default PositionsTable;

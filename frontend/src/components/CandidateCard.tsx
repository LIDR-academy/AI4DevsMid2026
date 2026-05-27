import React from 'react';
import { BoardCandidate } from '../types/positionBoard';
import StarRating from './StarRating';

type CandidateCardProps = {
  candidate: BoardCandidate;
  columnId: number;
  onDragStart: (candidateName: string, fromStepId: number) => void;
};

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  columnId,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(candidate.fullName, columnId);
  };

  const bgClass = candidate.highlighted ? 'bg-[#ffff00]' : 'bg-[#f9f9f9]';

  return (
    <div
      role="listitem"
      draggable
      aria-label={`Candidate: ${candidate.fullName}, score ${candidate.averageScore} out of 5`}
      onDragStart={handleDragStart}
      className={`${bgClass} border-2 border-[#1a1c1c] p-[14px] flex flex-col gap-[8px] cursor-grab`}
    >
      <span className="font-space font-bold text-[14px] uppercase text-[#1a1c1c] truncate">
        {candidate.fullName}
      </span>
      <div className="border-t border-dashed border-[#c6c6c6] pt-[8px]">
        <StarRating score={candidate.averageScore} />
      </div>
    </div>
  );
};

export default CandidateCard;

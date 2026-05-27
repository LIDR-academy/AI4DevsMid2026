import React, { useState } from 'react';
import { BoardCandidate, InterviewStep } from '../types/positionBoard';
import CandidateCard from './CandidateCard';
import DropZone from './DropZone';

type KanbanColumnProps = {
  step: InterviewStep;
  candidates: BoardCandidate[];
  isLast: boolean;
  isDragActive: boolean;
  onDragStart: (candidateName: string, fromStepId: number) => void;
  onDrop: (toStepId: number) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  step,
  candidates,
  isLast,
  isDragActive,
  onDragStart,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = () => setIsDragOver(true);
  const handleDragLeave = () => setIsDragOver(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(step.id);
  };

  const headerClass = isLast
    ? 'bg-[#484831] opacity-75 text-white px-[16px] py-[12px] flex items-center justify-between'
    : 'bg-[#1a1c1c] text-white px-[16px] py-[12px] flex items-center justify-between';

  const bodyClass = `bg-[#f7f7f7] flex-1 p-[8px] flex flex-col gap-[8px] overflow-y-auto${isDragOver ? ' ring-2 ring-inset ring-[#0035c6]' : ''}`;

  return (
    <div className="w-[288px] shrink-0 border-2 border-[#1a1c1c] flex flex-col">
      <div
        role="columnheader"
        aria-label={`${step.name} column, ${candidates.length} candidates`}
        className={headerClass}
      >
        <span className="font-space font-bold text-[14px] uppercase">{step.name}</span>
        <span className="bg-white text-[#1a1c1c] font-space font-bold text-[12px] px-[8px] py-[2px]">
          {candidates.length}
        </span>
      </div>
      <div
        role="list"
        aria-label={`${step.name} candidates`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={bodyClass}
      >
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.fullName}
            candidate={candidate}
            columnId={step.id}
            onDragStart={onDragStart}
          />
        ))}
        {isDragActive && (
          <DropZone
            stepName={step.name}
            onDrop={() => onDrop(step.id)}
          />
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;

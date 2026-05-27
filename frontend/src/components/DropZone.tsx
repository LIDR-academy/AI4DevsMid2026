import React from 'react';

type DropZoneProps = {
  stepName: string;
  onDrop: () => void;
};

const DropZone: React.FC<DropZoneProps> = ({ stepName, onDrop }) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div
      role="region"
      aria-label={`Drop zone for ${stepName} stage`}
      aria-live="polite"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-[#c6c6c6] p-[16px] flex items-center justify-center bg-[#f7f7f7]"
    >
      <span className="font-space font-bold text-[10px] text-[#484831] text-center uppercase">
        DROP TO ADVANCE TO {stepName.toUpperCase()} STAGE
      </span>
    </div>
  );
};

export default DropZone;

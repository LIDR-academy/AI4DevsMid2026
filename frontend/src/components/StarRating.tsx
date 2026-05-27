import React from 'react';

type StarRatingProps = {
  score: number;
  max?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ score, max = 5 }) => {
  const filled = Math.round(score);

  return (
    <div className="flex gap-[2px]" aria-label={`${filled} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <polygon
            points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,10.5 6,8.5 2.5,10.5 3.5,7 1,4.5 4.5,4.5"
            stroke="#1a1c1c"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill={i < filled ? '#1a1c1c' : 'none'}
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

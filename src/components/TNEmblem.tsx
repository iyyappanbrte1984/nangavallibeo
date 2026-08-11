import React, { useState } from 'react';

export const TNEmblem: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {!imgError ? (
        <img
          src="/assets/tn_emblem.png"
          alt="Tamil Nadu Government Emblem"
          className="w-full h-full object-contain drop-shadow-sm"
          onError={() => {
            // Try svg asset or fallback to vector
            setImgError(true);
          }}
        />
      ) : (
        <img
          src="/assets/tn_emblem.svg"
          alt="Tamil Nadu Government Emblem"
          className="w-full h-full object-contain drop-shadow-sm"
          onError={() => {
            // Final fallback to vector SVG inline if both image paths fail
          }}
        />
      )}
    </div>
  );
};

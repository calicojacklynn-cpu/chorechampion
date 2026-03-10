import React from 'react';

export const QuestKindLogo = ({ className = "h-12 w-12" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* The Blue Shield */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <path
          d="M12 2L4 5V11C4 16.06 7.41 20.84 12 22C16.59 20.84 20 16.06 20 11V5L12 2Z"
          fill="#3B82F6" /* Tailwind blue-500 */
          stroke="#EAB308" /* Tailwind yellow-500 border */
          strokeWidth="1"
        />
        {/* The Yellow Star */}
        <path
          d="M12 7L13.5 10.5H17L14.25 12.5L15.25 16L12 14L8.75 16L9.75 12.5L7 10.5H10.5L12 7Z"
          fill="#FDE047" /* Tailwind yellow-300 */
        />
      </svg>
    </div>
  );
};

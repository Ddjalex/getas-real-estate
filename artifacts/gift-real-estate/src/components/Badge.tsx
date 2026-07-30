import React from "react";

export function GetasBadge({ className = "", size = 80 }: { className?: string; size?: number }) {
  // SVG circular text logic
  // Path for the text: starting at the left middle, arching over the top, ending at the right middle, and back around
  // Actually, standard circle path is easier:
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="48" fill="#E31E24" />
        
        {/* Inner Circle */}
        <circle cx="50" cy="50" r="32" fill="#FFFFFF" />
        
        {/* Path for text to follow */}
        <path
          id="circlePath"
          d="M 50, 50 m -39, 0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
          fill="transparent"
        />
        
        {/* Circular Text */}
        <text fill="#FFFFFF" fontSize="10.2" fontWeight="bold" letterSpacing="1.2">
          <textPath href="#circlePath" startOffset="0%">
            GETAS REAL ESTATE • GETAS REAL ESTATE •
          </textPath>
        </text>
        
        {/* Center Text */}
        <text
          x="50"
          y="57"
          fill="#E31E24"
          fontSize="24"
          fontFamily="'Playfair Display', serif"
          fontWeight="800"
          textAnchor="middle"
        >
          GRE
        </text>
      </svg>
    </div>
  );
}

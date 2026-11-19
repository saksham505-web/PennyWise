import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ text, children, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        aria-label="More information"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-[#D7ECE5]/60 hover:text-[#C5E86C] p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#C5E86C]"
      >
        {children || <Info className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2.5 bg-[#042c31] border border-[#087985] text-[#F4F3E9] text-xs rounded-lg shadow-xl backdrop-blur-md pointer-events-none">
          {title && <div className="font-bold text-[#C5E86C] mb-1">{title}</div>}
          <div className="leading-relaxed text-[#D7ECE5]">{text}</div>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#042c31] border-r border-b border-[#087985] rotate-45" />
        </div>
      )}
    </div>
  );
}

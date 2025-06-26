'use client';
import { Grid } from 'lucide-react';

interface GridIconProps {
  onClick: () => void;
}

export default function GridIcon({ onClick }: GridIconProps) {
  return (
    <button
      onClick={onClick}
      aria-label="View services"
      className="fixed bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center shadow-lg transition-all border-0 cursor-pointer"
    >
      <Grid size={30} className="text-orange-500" />
    </button>
  );
}

import { Home } from 'lucide-react';

export default function MainServiceNav({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg">
      <Home size={20} />
      <span>Main Service</span>
    </button>
  );
}
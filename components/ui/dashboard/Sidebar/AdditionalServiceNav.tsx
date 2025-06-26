import { Plus } from 'lucide-react';

export default function AdditionalServiceNav({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg">
      <Plus size={20} />
      <span>Additional Service</span>
    </button>
  );
}
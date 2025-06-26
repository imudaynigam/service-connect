export default function MainServiceButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full md:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
    >
      Main Service
    </button>
  );
}
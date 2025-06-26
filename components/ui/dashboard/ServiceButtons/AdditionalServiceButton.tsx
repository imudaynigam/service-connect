export default function AdditionalServiceButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Additional Service
      </button>
    );
  }
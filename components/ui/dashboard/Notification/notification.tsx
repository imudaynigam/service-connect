import React from 'react';
import { ArrowLeft, X } from 'lucide-react';

// Sample notification data
const notificationData = [
  {
    id: '1',
    providerName: 'sanjin__007',
    serviceType: 'Catering Service',
    date: '17/3/2023',
  },
  {
    id: '2',
    providerName: 'sanjin__007',
    serviceType: 'Stage decoration',
    date: '17/3/2023',
  },
  {
    id: '3',
    providerName: 'sanjin__007',
    serviceType: 'Cake order',
    date: '17/3/2023',
  },
  {
    id: '4',
    providerName: 'sanjin__007',
    serviceType: 'Marriage Event',
    date: '17/3/2023',
  },
  {
    id: '5',
    providerName: 'sanjin__007',
    serviceType: 'Catering Service',
    date: '17/3/2023',
  },
];

interface NotificationProps {
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ onClose }) => {
  const renderNotificationItem = (item: typeof notificationData[0]) => {
    return (
      <div
        key={item.id}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center flex-1 mb-2 sm:mb-0">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.providerName}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
            alt={item.providerName}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
              {item.providerName}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {item.serviceType}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end w-full sm:w-auto">
          <p className="text-xs text-gray-500 mb-1 sm:mb-2">
            {item.date}
          </p>
          <button className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2 sm:px-3 py-1 rounded border border-red-200 transition-colors self-start sm:self-auto">
            Click to cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notificationData.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notificationData.map(renderNotificationItem)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5V3h0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
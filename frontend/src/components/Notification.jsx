import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNotifications } from '../context/notificationContext';

const Notifications = () => {
  const { notifications, removeNotification, clearNotifications } = useNotifications();

  return (
    <aside className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg p-5 overflow-y-auto rounded-l-xl z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            className="text-red-600 hover:text-red-800 text-sm"
            onClick={clearNotifications}
          >
            Clear All
          </button>
        )}
      </div>
      <ul className="space-y-3 text-sm text-gray-800">
        {notifications.length === 0 ? (
          <li className="text-gray-500">No notifications yet.</li>
        ) : (
          notifications.map((note) => (
            <li
              key={note._id}
              className="flex justify-between items-start bg-gray-100 p-3 rounded shadow"
            >
              <div>
                <p>{note.message}</p>
                <span className="text-xs text-gray-500">{note.timestamp}</span>
              </div>
              <button
                className="ml-2 text-red-600 hover:text-red-800"
                onClick={() => removeNotification(note._id)}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default Notifications;

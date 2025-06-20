import React from 'react';

const Notifications = () => {
  return (
   <aside className="w-full h-full bg-white shadow-md p-5 overflow-y-auto">
  <h2 className="text-lg font-bold mb-4">Notifications</h2>
  <ul className="space-y-2 text-sm text-gray-700">
    <li>✅ Bed bugs complaint resolved - 1 hr ago</li>
    <li>📌 User registration requested - 2 hr ago</li>
    <li>⚠️ Bed bug complaint handling - 2 hr ago</li>
    <li>🔧 Network issue complaint res. - Today, 11:00 AM</li>
  </ul>
</aside>
  );
};

export default Notifications;

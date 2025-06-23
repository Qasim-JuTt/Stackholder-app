import React, { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Pencil, Trash2 } from 'lucide-react';

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load static slots on first render
  useEffect(() => {
    const staticSlots = [
      { day: 'Monday', startTime: '09:00', endTime: '10:00' },
      { day: 'Tuesday', startTime: '11:00', endTime: '12:30' },
      { day: 'Wednesday', startTime: '14:00', endTime: '15:00' },
    ];
    setSlots(staticSlots);
  }, []);

  const handleAddSlot = () => {
    if (!day || !startTime || !endTime) {
      setError('Please fill in all fields');
      return;
    }

    const conflict = slots.some(slot =>
      slot.day === day &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
        (endTime > slot.startTime && endTime <= slot.endTime) ||
        (startTime <= slot.startTime && endTime >= slot.endTime))
    );

    if (conflict) {
      setError('Slot conflicts with an existing one');
      return;
    }

    const newSlot = { day, startTime, endTime };
    setSlots([...slots, newSlot]);
    setDay('');
    setStartTime('');
    setEndTime('');
    setError('');
    setShowModal(false);
  };

  const handleDeleteSlot = (index) => {
    const updatedSlots = [...slots];
    updatedSlots.splice(index, 1);
    setSlots(updatedSlots);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Manage Time Slots</h2>
          <Button onClick={() => setShowModal(true)}>Add Slot</Button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md mt-6">
          <h3 className="text-xl font-medium mb-3">Defined Slots</h3>
          {slots.length === 0 ? (
            <p>No slots added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left">
                  <tr className="text-gray-500 border-b">
                    <th className="py-3 pr-4 whitespace-nowrap">Day</th>
                    <th className="py-3 pr-4 whitespace-nowrap">Start Time</th>
                    <th className="py-3 pr-4 whitespace-nowrap">End Time</th>
                    <th className="py-3 pr-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {slots.map((slot, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="py-4 pr-4 whitespace-nowrap font-medium text-gray-700">
                        {slot.day}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap text-gray-600">
                        {slot.startTime}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap text-gray-600">
                        {slot.endTime}
                      </td>
                      <td className="py-4 pr-4 text-right space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition"
                          onClick={() => console.log('Edit slot', index)}
                        >
                          <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => handleDeleteSlot(index)}
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Add Time Slot</h3>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="space-y-4">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full border p-2 rounded-xl"
              >
                <option value="">Select Day</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <InputField
                type="time"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />

              <InputField
                type="time"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <Button onClick={handleAddSlot}>Save Slot</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Slots;

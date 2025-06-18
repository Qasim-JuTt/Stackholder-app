import React, { useMemo } from "react";

// Helper to generate random color
const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;

const StakeholderCard = ({ stakeholderData }) => {
  const total = Object.values(stakeholderData).reduce(
    (sum, val) => sum + val.percentage,
    0
  );
  let cumulative = 0;

  // Generate consistent random colors per role
  const colors = useMemo(() => {
    const map = {};
    for (const role in stakeholderData) {
      map[role] = getRandomColor();
    }
    return map;
  }, [stakeholderData]);

  const segments = Object.entries(stakeholderData).map(
    ([role, { percentage }]) => {
      const start = cumulative;
      cumulative += (percentage / total) * 100;

      return (
        <circle
          key={role}
          stroke={colors[role]}
          strokeWidth="3"
          fill="transparent"
          r="16"
          cx="18"
          cy="18"
          strokeDasharray={`${(percentage / total) * 100} ${
            100 - (percentage / total) * 100
          }`}
          strokeDashoffset={100 - start}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      );
    }
  );

  return (
    <div className="bg-white rounded-xl p-4 space-y-4 w-full shadow">
      {/* Multi-Segment Pie Chart */}
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
          {segments}
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600">
          100%
        </div>
      </div>

      {/* Stakeholder Details */}
      <div className="text-xs text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
        {Object.entries(stakeholderData).map(([role, { name, percentage }]) => (
          <div key={role} className="capitalize" style={{ color: colors[role] }}>
            {name} — {percentage}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default StakeholderCard;

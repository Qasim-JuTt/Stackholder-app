import { Check, ArrowUp } from "lucide-react";

const ProjectCard = ({ projectName, completion, price, expense }) => {
  const completionColor = (value) => {
    if (value >= 75) return "bg-green-500";
    if (value >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  // 👤 Generate random avatar URL inside the component
  const randomSeed = Math.floor(Math.random() * 10000);
  const userImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 w-full max-w-sm">
      {/* Title & Avatar */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {projectName}
        </h2>
        <img
          src={userImage}
          alt="User"
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
        />
      </div>

      {/* Income (left) and Expense (right) in one row */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-left">
          <p className="text-[11px] text-gray-500">Income</p>
          <p className="text-sm font-medium text-green-600">${price}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-500">Expense</p>
          <p className="text-sm font-medium text-red-500">${expense}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${completionColor(completion)}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{completion}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

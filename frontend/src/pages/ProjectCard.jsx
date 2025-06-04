import { Check, ArrowUp } from "lucide-react";

const ProjectCard = ({ projectName, completion, userImage, price }) => {
  const completionColor = (value) => {
    if (value >= 75) return "bg-green-500";
    if (value >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

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

      {/* Project Code, Icons & Price */}
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-[2px] rounded-full font-medium">
          PROJ-101
        </span>
        <div className="bg-green-100 p-1 rounded-full">
          <Check className="w-4 h-4 text-green-600" />
        </div>
        <div className="bg-orange-100 p-1 rounded-full">
          <ArrowUp className="w-4 h-4 text-orange-500" />
        </div>
        <span className="text-base font-medium text-gray-800 ml-auto">${price}</span>
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

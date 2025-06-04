import React from "react";
import { Search } from "lucide-react";

function Navbar() {
  return (
    
    <div className="w-full bg-white px-6 py-4 flex items-center justify-between shadow-sm">
      <h2 className="text-xl font-semibold tracking-wide">STAKEHOLDER MANAGEMENT</h2>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        
        <div className="relative text-gray-400">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Profile image */}
        <img
          src="https://media.gettyimages.com/id/1317804578/photo/one-businesswoman-headshot-smiling-at-the-camera.jpg?s=612x612&w=gi&k=20&c=tFkDOWmEyqXQmUHNxkuR5TsmRVLi5VZXYm3mVsjee0E="
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
}

export default Navbar;

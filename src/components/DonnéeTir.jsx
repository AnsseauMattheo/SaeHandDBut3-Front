
import React from 'react';

const DonneTir = ({tirs, totalTirs, tirsReussi}) => {
  return (
    <div className="inline-flex items-center bg-slate-800 rounded-lg px-3 py-2 text-white text-sm font-medium">

      <div className="relative flex items-center mr-3">

        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{tirs ? Math.floor(tirs/totalTirs) + "%" : "0%"}</span>

          <div className="absolute -top-1 -left-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
            {tirsReussi ? tirsReussi : "0"}
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-blue-600 px-2 py-1 rounded text-xs">
        <span className="text-white">{tirs ? Math.floor(tirs/tirsReussi) + "%" : "0%"}</span>
      </div>
    </div>
  );
};

export default DonneTir;
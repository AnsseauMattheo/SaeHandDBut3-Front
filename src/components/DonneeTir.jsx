
import React, { useState } from 'react';

const DonneTir = ({ tirs, totalTirs = 0, tirsReussi = 0, secteur, reset, updateReset }) => {

  const [showInfo, setShowInfo] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  }

  if(reset === true && showInfo === true) {
    setShowInfo(false);
    updateReset(false);
  }

  return (
    <div className={"inline-flex items-center bg-slate-900 mouse-pointer rounded-lg px-2 py-2 text-white text-sm font-medium " + (showInfo ? " z-10" : "")} onClick={handleClick} >

      {!showInfo && (
        <>
          <div className="relative flex items-center mr-1">

            <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {totalTirs > 0 ? Math.round((tirs / totalTirs) * 100) + "%" : "0%"}
              </span>

              <div className="absolute -top-1 -left-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
                {tirs || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-blue-600 px-2 py-1 rounded text-xs">
            <span className="text-white">
              {tirs > 0 ? Math.round((tirsReussi / tirs) * 100) + "%" : "0%"}
            </span>
          </div>
        </>

      ) || (
        <div className="relative z-10 text-xs w-40">
          Secteur : {secteur || "N/A"} <br />
          Nombre de tirs : {tirs || 0} <br />
          Tirs réussis : {tirsReussi || 0} <br />
          Taux de réussite : {tirs > 0 ? Math.round((tirsReussi / tirs) * 100) + "%" : "0%"}<br />
          Nombre de tirs total : {totalTirs || 0}
          </div>
        )}


    </div>
  );
};

export default DonneTir;
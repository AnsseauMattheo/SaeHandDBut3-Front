
import React, { useState } from 'react';

const DonneTir = ({ tirs, totalTirs = 0, tirsReussi = 0, secteur, reset, updateReset, data = true }) => {

  const [showInfo, setShowInfo] = useState(false);

  if (secteur === "But vide" || secteur === "CA MB" || secteur === "Jet 7m") {
    data = true
  }

  const handleClick = () => {
    setShowInfo(!showInfo);
  }

  if (reset === true && showInfo === true) {
    setShowInfo(false);
    updateReset(false);
  }

  if (data) {
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

  }


  const tauxReussite = tirs > 0 ? (tirsReussi / tirs) * 100 : 0;

  // Taille plus marquée (60px à 160px)
  const minSize = 60;
  const maxSize = 160;
  const sizeRatio = totalTirs > 0 ? Math.min(tirs / totalTirs, 1) : 0;
  const size = minSize + (maxSize - minSize) * sizeRatio;

  // Opacité plus forte (0.6 à 1)
  const opacity = 0.6 + (tauxReussite / 100) * 0.4;

  // Couleur basée sur le taux de réussite
  let bgColor = "bg-red-500";
  if (tauxReussite >= 70) bgColor = "bg-green-500";
  else if (tauxReussite >= 40) bgColor = "bg-orange-500";

  return (
    <div
      className={`
        absolute flex items-center justify-center rounded-full
        ${bgColor}
        cursor-pointer transition-all duration-300
        hover:scale-110 hover:brightness-110
        shadow-lg shadow-black/30
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        boxShadow: `0 0 ${size / 2}px ${bgColor.replace("bg-", "").replace("-500", "")}`,
      }}
      onClick={handleClick}
      title={`Secteur ${secteur}: ${tirs} tirs, ${tauxReussite.toFixed(0)}% réussite`}
    >
      {showInfo && (
        <div className=" -top-16 left-1/2 -translate-x-1/2 z-10 bg-slate-900/95 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap border border-slate-700">
          <p><strong>Secteur :</strong> {secteur || "N/A"}</p>
          <p><strong>Tirs :</strong> {tirs || 0}</p>
          <p><strong>Réussis :</strong> {tirsReussi || 0}</p>
          <p><strong>Taux :</strong> {tirs > 0 ? Math.round(tauxReussite) + "%" : "0%"}</p>
        </div>
      )}
    </div>
  );
}

export default DonneTir;
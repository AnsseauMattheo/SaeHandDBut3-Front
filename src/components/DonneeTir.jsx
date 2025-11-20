import React, { useState } from 'react';
import chroma from "chroma-js";

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
            <div
                className={`inline-flex items-center bg-slate-900 cursor-pointer rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2 text-white text-[10px] sm:text-xs lg:text-sm font-medium ${showInfo ? " z-5 " : ""}`}
                onClick={handleClick}
            >
                {!showInfo && (
                    <>

                        <div className="flex items-center relative bg-blue-600 px-1.5 sm:pl-4 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs">
                            <span className="text-white">
                                {tirs > 0 ? Math.round((tirsReussi / tirs) * 100) + "%" : "0%"}
                            </span>
                            <div className="absolute -top-0.5 sm:-top-1 -left-0.5 sm:-left-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-700 rounded-full flex items-center justify-center text-[9px] sm:text-xs font-bold text-white border-2 border-slate-800">
                                {tirs || 0}
                            </div>
                        </div>
                    </>
                ) || (
                        <div className="relative z-10 text-[9px] sm:text-[10px] lg:text-xs w-32 sm:w-36 lg:w-40">
                            Secteur : {secteur || "N/A"} <br />
                            Nombre de tirs : {tirs || 0} <br />
                            Tirs réussis : {tirsReussi || 0} <br />
                            Taux de tirs : {totalTirs > 0 ? Math.round((tirs / totalTirs) * 100) + "%" : "0%"}<br />
                            Taux de réussite : {tirs > 0 ? Math.round((tirsReussi / tirs) * 100) + "%" : "0%"}<br />
                            Nombre de tirs total : {totalTirs || 0}
                        </div>
                    )}
            </div>
        );
    }

    const tauxReussite = tirs > 0 ? (tirsReussi / tirs) * 100 : 0;

    const minSize = 40;
    const maxSize = 100;
    const sizeRatio = totalTirs > 0 ? Math.min(tirs / totalTirs, 1) : 0;
    const size = minSize + (maxSize - minSize) * sizeRatio;

    const tauxtirsecteur = tirs > 0 ? (tirs / totalTirs) * 100 : 0;

    const scale = chroma
        .scale(["#00b91fff", "#ffbf00ff", "#ff6a00ff", "#ff0000ff"])
        .domain([0, 40]);

    const color = scale(tauxtirsecteur).hex();

    return (
        <div
            className={`    
        absolute flex items-center justify-center rounded-full
        cursor-pointer transition-all duration-300
        hover:scale-110 hover:brightness-110
        shadow-lg shadow-black/30
      `}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: `0 0 ${size / 2}px ${color.replace("bg-", "").replace("-500", "")}`,
                backgroundColor: color,
                zIndex: showInfo ? 10 : "auto",
            }}
            onClick={handleClick}
            title={`Secteur ${secteur}: ${tirs} tirs, ${tauxReussite.toFixed(0)}% réussite`}
        >
            {showInfo && (
                <div className="z-10 bg-slate-900/95 text-white text-[9px] sm:text-xs rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg whitespace-nowrap border border-slate-700">
                    <p><strong>Secteur :</strong> {secteur || "N/A"}</p>
                    <p><strong>Tirs :</strong> {tirs || 0}</p>
                    <p><strong>Réussis :</strong> {tirsReussi || 0}</p>
                    <p><strong>Taux de tirs :</strong> {totalTirs > 0 ? Math.round((tirs / totalTirs) * 100) + "%" : "0%"}</p>
                    <p><strong>Taux :</strong> {tirs > 0 ? Math.round(tauxReussite) + "%" : "0%"}</p>
                </div>
            )}
        </div>
    );
}

export default DonneTir;

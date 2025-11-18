import { useEffect, useState } from "react";
import terrainVide from "../assets/DemiTerrainVide.jpg";
import DonneTir from "./DonneeTir";
import axios from "axios";
import DonneArret from "@/components/DonneArret.jsx";

const CarteTirs = ({ datas, appui, showData = true, arret = false }) => {

    const totalCases = 150;
    const cols = 15;
    const [totalTirs, setTotalTirs] = useState(0);
    const [resetInfo, setResetInfo] = useState(false);

    useEffect(() => {
        if (datas != null) {
            let res = 0;
            datas.forEach(data => {
                data.tirs.forEach(element => {
                    res += element.tirsTotal;
                });
            });
            setTotalTirs(res)
        }
    }, [datas])

    const blocks = [
        { "pos": 19, "secteur": "9m D" }, { "pos": 23, "secteur": "9m +" }, { "pos": 27, "secteur": "9m G" },
        { "pos": 35, "secteur": appui ? "7m 9m Ext D appui" : "7m 9m Ext D suspension" }, { "pos": 38, "secteur": appui ? "Central 7m 9m appui" : "7m 9m central suspension" }, { "pos": 41, "secteur": appui ? "7m 9m Ext G appui" : "7m 9m Ext G suspension" }, { "pos": 44, "secteur": "Jet 7m" },
        { "pos": 51, "secteur": "5 6" }, { "pos": 53, "secteur": "3 4" }, { "pos": 55, "secteur": "2 3" },
        { "pos": 65, "secteur": "4 5" }, { "pos": 71, "secteur": "1 2" },
        { "pos": 79, "secteur": "ALD" }, { "pos": 87, "secteur": "ALG" },
        { "pos": 126, "secteur": "But vide" }, { "pos": 130, "secteur": "CA MB" }
    ];

    const caseToBlock = [];
    blocks.forEach((block, c, i) => {
        caseToBlock.push({ block, isFirst: i === 0 });
    });

    const blockMap = new Map();
    blocks.forEach(block => {
        blockMap.set(block.pos, block);
    });

    function caseToCoords(caseNumber, cols = 15) {
        const row = Math.ceil(caseNumber / cols);
        const col = ((caseNumber - 1) % cols) + 1;
        return { row, col };
    }

    const handleResetInfo = (e) => {
        if (e.target.id !== "map") return;
        setResetInfo(true);
    }

    return (
        <div className="relative w-full h-full">
            <img
                src={terrainVide}
                className="w-full h-full object-contain rounded-lg sm:rounded-xl lg:rounded-2xl"
                style={!showData ? { filter: "grayscale(1)" } : {}}
                alt="Terrain"
            />
            <div
                id="map"
                className="absolute inset-0 grid grid-cols-15 grid-rows-10 gap-1 sm:gap-2 lg:gap-4 p-2 sm:p-4 lg:p-6 w-full aspect-[15/10]"
                onClick={(e) => handleResetInfo(e)}
            >
                {Array.from({ length: totalCases }).map((_, i) => {
                    const caseNum = i + 1;
                    const block = blockMap.get(caseNum);

                    if (block && datas) {
                        const { row, col } = caseToCoords(caseNum, cols);
                        let infosecteur = [];

                        datas.forEach(data => {
                            data.tirs.forEach(element => {
                                if (element.secteur === block.secteur) {
                                    infosecteur.push(element);
                                }
                            });
                        });

                        let tirsTotal = 0;
                        let tirsReussi = 0;

                        infosecteur.forEach(element => {
                            tirsTotal += element.tirsTotal;
                            tirsReussi += element.tirsReussi;
                        });

                        if (infosecteur.length > 0) {
                            if(arret){
                                return (
                                    <div
                                        key={caseNum}
                                        className={`row-start-${row} col-start-${col} col-span-1 flex items-center justify-center text-white rounded bg-transparent`}
                                    >
                                        <DonneArret
                                            tirs={tirsTotal}
                                            tirsReussi={tirsReussi}
                                            totalTirs={totalTirs}
                                            secteur={block.secteur}
                                            reset={resetInfo}
                                            updateReset={setResetInfo}
                                            data={showData}
                                        />
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={caseNum}
                                    className={`row-start-${row} col-start-${col} col-span-1 flex items-center justify-center text-white rounded bg-transparent`}
                                >
                                    <DonneTir
                                        tirs={tirsTotal}
                                        tirsReussi={tirsReussi}
                                        totalTirs={totalTirs}
                                        secteur={block.secteur}
                                        reset={resetInfo}
                                        updateReset={setResetInfo}
                                        data={showData}
                                    />
                                </div>
                            );
                        } else if (showData) {
                            return (
                                <div
                                    key={caseNum}
                                    className={`row-start-${row} col-start-${col} col-span-1 flex items-center justify-center text-white rounded-lg h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 py-1 px-1 sm:py-1.5 sm:px-1.5 lg:py-2 lg:px-2 bg-slate-900 text-[9px] sm:text-xs lg:text-sm`}
                                >
                                    0
                                </div>
                            );
                        }
                    }
                    return (
                        <div
                            key={caseNum}
                            className="opacity-0 pointer-events-none"
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default CarteTirs;

import { useEffect, useState } from "react";
import terrainVide from "../assets/DemiTerrainVide.jpg";
import DonneTir from "./DonneeTir";
import axios from "axios";
import { data } from "react-router";


const CarteTirs = ({ datas, appui, showData = true }) => {

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
        console.log(e.target.id)
        if (e.target.id !== "map") return;
        setResetInfo(true);
        console.log("reset info")
    }

    return (
        <>
            <img src={terrainVide} className="object-cover rounded-2xl" style={!showData ? { filter: "grayscale(1)" } : {}} />
            <div id="map" className="absolute inset-0 grid grid-cols-15 grid-rows-10 gap-4 p-6 w-full aspect-[15/10]" onClick={(e) => handleResetInfo(e)}>
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
                            return (
                                <div
                                    key={caseNum}
                                    className={`row-start-${row} col-start-${col} col-span-1 flex items-center justify-center text-white rounded bg-transparent`}
                                >
                                    <DonneTir tirs={tirsTotal} tirsReussi={tirsReussi} totalTirs={totalTirs} secteur={block.secteur} reset={resetInfo} updateReset={setResetInfo} data={showData} />
                                </div>
                            );
                        } else if (showData) {
                            return (
                                <div
                                    key={caseNum}
                                    className={`row-start-${row} col-start-${col} col-span-1 flex items-center justify-center text-white rounded-lg h-10 w-10 py-2 px-2 bg-slate-900`}
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
        </>
    )
}

export default CarteTirs;
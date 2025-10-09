import React, { useEffect, useState } from "react";
import CarteTirs from "../components/CarteTirs.jsx";
import DonneeTir from "../components/DonneeTir.jsx";
import axios from "axios";
import ListComponent from "../components/ListComponent.jsx";
import { Label } from "../components/ui/label.jsx";
import { Switch } from "../components/ui/switch.jsx";
import { Card, CardContent } from "../components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function StatTir() {

    const [datas, setDatas] = useState([]);
    const [joueuses, setJoueuses] = useState([]);
    const [appui, setAppui] = useState(true);
    const [selectedDatas, setSelectedDatas] = useState([]);
    const [matchs, setMatchs] = useState([]);
    const [showData, setShowData] = useState(true);

    const [joueuseCategorie, setjoueuseCategorie] = useState([]);
    const [matchCategorie, setMatchCategorie] = useState([]);

    const handleAppui = () => {
        setAppui(!appui);
    }

    const handleShowData = () => {
        setShowData(!showData);
    }

    const handleInitJoueusesSelectect = (joueuseListe) => {
        let joueusecat = {}
        Object.keys(joueuseListe).forEach((key) => {
            joueusecat[key] = false;
            joueuseListe[key].forEach((item) => {
                item.selected = false;
            })
        })
        console.log("Jcat", joueusecat)
        setjoueuseCategorie(joueusecat);
    }

    const handleInitMatchsSelectect = (matchListe) => {
        let matchcat = {}
        Object.keys(matchListe).forEach((key) => {
            matchcat[key] = false;
            matchListe[key].forEach((item) => {
                item.selected = false;
            })
        })
        console.log("Mcat", matchcat)
        setMatchCategorie(matchcat);
    }

    useEffect(() => {
        axios.get("http://localhost:8080/joueuses/JoueusesParAffectation", { withCredentials: true }).then((res) => {
            setJoueuses(res.data)
            handleInitJoueusesSelectect(res.data)
        })
        axios.get("http://localhost:8080/data/getTirs", { withCredentials: true }).then((res) => {
            setDatas(res.data)
        })
        axios.get("http://localhost:8080/match/getMathchParSaisons", { withCredentials: true }).then((res) => {
            setMatchs(res.data);
            handleInitMatchsSelectect(res.data)
            console.log(res.data);
        })
    }, [])

    // Fonction pour obtenir les joueuses sélectionnées
    const getSelectedJoueuses = (joueusesObj) => {
        const selected = [];
        Object.keys(joueusesObj).forEach((key) => {
            joueusesObj[key].forEach((item) => {
                if (item.selected) {
                    selected.push(item.nom);
                }
            });
        });
        return selected;
    };

    // Fonction pour obtenir les matchs sélectionnés
    const getSelectedMatchs = (matchsObj) => {
        const selected = [];
        Object.keys(matchsObj).forEach((key) => {
            matchsObj[key].forEach((item) => {
                if (item.selected) {
                    selected.push(item.mid);
                }
            });
        });
        return selected;
    };

    // Fonction pour filtrer les données selon les joueuses ET matchs sélectionnés
    const filterDatas = (joueusesObj, matchsObj) => {
        const selectedJoueuseNoms = getSelectedJoueuses(joueusesObj);
        const selectedMatchIds = getSelectedMatchs(matchsObj);
        
        // Si aucune sélection, retourner un tableau vide
        if (selectedJoueuseNoms.length === 0 && selectedMatchIds.length === 0) {
            return [];
        }
        
        // Si seulement des joueuses sont sélectionnées
        if (selectedJoueuseNoms.length > 0 && selectedMatchIds.length === 0) {
            return datas.filter(data => 
                selectedJoueuseNoms.includes(data.joueuse)
            );
        }
        
        // Si seulement des matchs sont sélectionnés
        if (selectedJoueuseNoms.length === 0 && selectedMatchIds.length > 0) {
            const filteredData = [];
            datas.forEach(joueuseData => {
                const filteredTirs = joueuseData.tirs.filter(tir => 
                    selectedMatchIds.includes(tir.match.mid)
                );
                if (filteredTirs.length > 0) {
                    filteredData.push({
                        joueuse: joueuseData.joueuse,
                        tirs: filteredTirs
                    });
                }
            });
            return filteredData;
        }
        
        // Si les deux sont sélectionnés (joueuses ET matchs)
        const filteredData = [];
        datas.forEach(joueuseData => {
            if (selectedJoueuseNoms.includes(joueuseData.joueuse)) {
                const filteredTirs = joueuseData.tirs.filter(tir => 
                    selectedMatchIds.includes(tir.match.mid)
                );
                if (filteredTirs.length > 0) {
                    filteredData.push({
                        joueuse: joueuseData.joueuse,
                        tirs: filteredTirs
                    });
                }
            }
        });
        
        return filteredData;
    };

    const handleSelectectJoueuse = (id) => {
        const newJoueuses = { ...joueuses };

        Object.keys(newJoueuses).forEach((key) => {
            newJoueuses[key] = newJoueuses[key].map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        selected: !item.selected,
                    };
                }
                return item;
            });
        });

        setJoueuses(newJoueuses);
        // Filtrer avec les deux critères
        const filteredData = filterDatas(newJoueuses, matchs);
        setSelectedDatas(filteredData);
        console.log("Données filtrées:", filteredData);
    };

    const handleSelectectMatch = (id) => {
        console.log("select match", id)
        const newMatchs = { ...matchs };

        Object.keys(newMatchs).forEach((key) => {
            newMatchs[key] = newMatchs[key].map((item) => {
                if (item.mid === id) {
                    return {
                        ...item,
                        selected: !item.selected,
                    };
                }
                return item;
            });
        });

        setMatchs(newMatchs);
        // Filtrer avec les deux critères
        const filteredData = filterDatas(joueuses, newMatchs);
        setSelectedDatas(filteredData);
        console.log("Données filtrées:", filteredData);
    };

    const handleSelectAll = (key, isJoueuse = true) => {
        if (isJoueuse) {
            const newJoueuses = { ...joueuses };
            newJoueuses[key] = newJoueuses[key].map((item) => {
                return {
                    ...item,
                    selected: !joueuseCategorie[key],
                };
            });

            const newjoueuseCategorie = { ...joueuseCategorie };
            newjoueuseCategorie[key] = !joueuseCategorie[key];
            setjoueuseCategorie(newjoueuseCategorie);

            setJoueuses(newJoueuses);
            const filteredData = filterDatas(newJoueuses, matchs);
            setSelectedDatas(filteredData);
        } else {
            const newMatchs = { ...matchs };
            newMatchs[key] = newMatchs[key].map((item) => {
                return {
                    ...item,
                    selected: !matchCategorie[key],
                };
            });

            const newMatchCategorie = { ...matchCategorie };
            newMatchCategorie[key] = !matchCategorie[key];
            setMatchCategorie(newMatchCategorie);

            setMatchs(newMatchs);
            const filteredData = filterDatas(joueuses, newMatchs);
            setSelectedDatas(filteredData);
        }
    }

    const handleClearJoueuses = () => {
        const newJoueuses = { ...joueuses };

        Object.keys(newJoueuses).forEach((key) => {
            newJoueuses[key] = newJoueuses[key].map((item) => {
                return {
                    ...item,
                    selected: false,
                };
            });
        });

        const newjoueuseCategorie = { ...joueuseCategorie };
        Object.keys(newjoueuseCategorie).forEach((key) => {
            newjoueuseCategorie[key] = false;
        });
        setjoueuseCategorie(newjoueuseCategorie);

        setJoueuses(newJoueuses);
        const filteredData = filterDatas(newJoueuses, matchs);
        setSelectedDatas(filteredData);
    }

    const handleClearMatchs = () => {
        const newMatchs = { ...matchs };

        Object.keys(newMatchs).forEach((key) => {
            newMatchs[key] = newMatchs[key].map((item) => {
                return {
                    ...item,
                    selected: false,
                };
            });
        });

        const newMatchCategorie = { ...matchCategorie };
        Object.keys(newMatchCategorie).forEach((key) => {
            newMatchCategorie[key] = false;
        });
        setMatchCategorie(newMatchCategorie);

        setMatchs(newMatchs);
        const filteredData = filterDatas(joueuses, newMatchs);
        setSelectedDatas(filteredData);
    }

    return (
        <div className="flex justify-center" >
            <Card>
                <CardContent className="p-6 mb-7">
                    <div className="flex gap-6 h-[600px]">
                        {/* Liste des joueuses */}
                        <div className="flex flex-col items-center w-full sm:w-40 md:w-48 relative h-full">
                            <h1 className="mb-4 text-sm leading-none font-medium text-center">Joueuses</h1>
                            <div className="flex-1 w-full overflow-y-auto">
                                <ListComponent 
                                    liste={joueuses} 
                                    nom={"nom"} 
                                    id={"id"} 
                                    categorie={joueuseCategorie} 
                                    onClick={handleSelectectJoueuse} 
                                    selectAll={(key) => handleSelectAll(key, true)} 
                                />
                            </div>
                            <Button className="mt-3" onClick={handleClearJoueuses}>Clear</Button>
                        </div>

                        {/* Carte des tirs */}
                        <div className="flex-1 relative max-w-[900px] max-h-[500px]">
                            {selectedDatas.length !== 0 && (
                                <h1 className="text-center">
                                    {selectedDatas.length === 1 
                                        ? `Joueuse : ${selectedDatas[0].joueuse}`
                                        : `${selectedDatas.length} joueuses sélectionnées`
                                    }
                                </h1>
                            )}
                            <CarteTirs datas={selectedDatas} appui={appui} showData={showData} />
                            
                            <div className="flex-shrink-0 mt-4 flex flex-row items-start justify-around space-y-4">
                                <div className="mt-2 flex flex-col items-center space-y-3">
                                    <Switch
                                        id="switchAppui"
                                        checked={appui}
                                        onCheckedChange={handleAppui}
                                    />
                                    <Label htmlFor={"switchAppui"}>
                                        {appui ? "Appui " : "Suspension "}
                                    </Label>
                                </div>
                                <div className="mt-2 flex flex-col items-center space-y-3">
                                    <Switch
                                        id="switchData"
                                        checked={showData}
                                        onCheckedChange={handleShowData}
                                    />
                                    <Label htmlFor={"switchData"}>
                                        {showData ? "Data " : "Heatmap "}
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Liste des matchs */}
                        <div className="flex flex-col items-center w-full sm:w-40 md:w-48 relative h-full">
                            <h1 className="mb-4 text-sm leading-none font-medium text-center">Matchs</h1>
                            <div className="flex-1 w-full overflow-y-auto">
                                <ListComponent 
                                    liste={matchs} 
                                    nom={"nomImport"} 
                                    id={"mid"} 
                                    categorie={matchCategorie} 
                                    onClick={handleSelectectMatch} 
                                    selectAll={(key) => handleSelectAll(key, false)} 
                                />
                            </div>
                            <Button className="mt-3" onClick={handleClearMatchs}>Clear</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
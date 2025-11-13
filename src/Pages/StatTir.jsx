import React, {useEffect, useState} from "react";
import CarteTirs from "../components/CarteTirs.jsx";
import DonneeTir from "../components/DonneeTir.jsx";
import axios from "axios";
import ListComponent from "../components/ListComponent.jsx";
import {Label} from "../components/ui/label.jsx";
import {Switch} from "../components/ui/switch.jsx";
import {Card, CardContent} from "../components/ui/card.jsx";
import CarteJoueuse from "@/components/CarteJoueuse.jsx";
import {Button} from "@/components/ui/button.jsx";


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
        setMatchCategorie(matchcat);
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/JoueusesParAffectation`, {withCredentials: true}).then((res) => {
            setJoueuses(res.data)
            handleInitJoueusesSelectect(res.data)
        })
        axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getTirs`, {withCredentials: true}).then((res) => {
            setDatas(res.data)
        })
        axios.get(`${import.meta.env.VITE_SERVER_URL}/match/getMatchParSaisons`, {withCredentials: true}).then((res) => {
            setMatchs(res.data);
            handleInitMatchsSelectect(res.data)
        })
    }, [])

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

    const filterDatas = (joueusesObj, matchsObj) => {
        const selectedJoueuseNoms = getSelectedJoueuses(joueusesObj);
        const selectedMatchIds = getSelectedMatchs(matchsObj);

        if (selectedJoueuseNoms.length === 0 && selectedMatchIds.length === 0) {
            return [];
        }

        if (selectedJoueuseNoms.length > 0 && selectedMatchIds.length === 0) {
            return datas.filter(data =>
                selectedJoueuseNoms.includes(data.joueuse)
            );
        }

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
        const newJoueuses = {...joueuses};

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
        const filteredData = filterDatas(newJoueuses, matchs);
        setSelectedDatas(filteredData);
    };

    const handleSelectectMatch = (id) => {
        const newMatchs = {...matchs};

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
        const filteredData = filterDatas(joueuses, newMatchs);
        setSelectedDatas(filteredData);
    };

    const handleSelectAll = (key, isJoueuse = true) => {
        if (isJoueuse) {
            const newJoueuses = {...joueuses};
            newJoueuses[key] = newJoueuses[key].map((item) => {
                return {
                    ...item,
                    selected: !joueuseCategorie[key],
                };
            });

            const newjoueuseCategorie = {...joueuseCategorie};
            newjoueuseCategorie[key] = !joueuseCategorie[key];
            setjoueuseCategorie(newjoueuseCategorie);

            setJoueuses(newJoueuses);
            const filteredData = filterDatas(newJoueuses, matchs);
            setSelectedDatas(filteredData);
        } else {
            const newMatchs = {...matchs};
            newMatchs[key] = newMatchs[key].map((item) => {
                return {
                    ...item,
                    selected: !matchCategorie[key],
                };
            });

            const newMatchCategorie = {...matchCategorie};
            newMatchCategorie[key] = !matchCategorie[key];
            setMatchCategorie(newMatchCategorie);

            setMatchs(newMatchs);
            const filteredData = filterDatas(joueuses, newMatchs);
            setSelectedDatas(filteredData);
        }
    }

    const handleClearJoueuses = () => {
        const newJoueuses = {...joueuses};

        Object.keys(newJoueuses).forEach((key) => {
            newJoueuses[key] = newJoueuses[key].map((item) => {
                return {
                    ...item,
                    selected: false,
                };
            });
        });

        const newjoueuseCategorie = {...joueuseCategorie};
        Object.keys(newjoueuseCategorie).forEach((key) => {
            newjoueuseCategorie[key] = false;
        });
        setjoueuseCategorie(newjoueuseCategorie);

        setJoueuses(newJoueuses);
        const filteredData = filterDatas(newJoueuses, matchs);
        setSelectedDatas(filteredData);
    }

    const handleClearMatchs = () => {
        const newMatchs = {...matchs};

        Object.keys(newMatchs).forEach((key) => {
            newMatchs[key] = newMatchs[key].map((item) => {
                return {
                    ...item,
                    selected: false,
                };
            });
        });

        const newMatchCategorie = {...matchCategorie};
        Object.keys(newMatchCategorie).forEach((key) => {
            newMatchCategorie[key] = false;
        });
        setMatchCategorie(newMatchCategorie);

        setMatchs(newMatchs);
        const filteredData = filterDatas(joueuses, newMatchs);
        setSelectedDatas(filteredData);
    }

    return (
        <div className="flex justify-center px-2 sm:px-4 lg:px-6">
            <Card className="w-full max-w-7xl">
                <CardContent className="p-3 sm:p-4 lg:p-6 mb-4 sm:mb-7">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-[400px] lg:h-[600px]">
                        {/* Liste des joueuses */}
                        <div className="flex flex-col items-center w-full lg:w-40 xl:w-48 h-[300px] lg:h-full">
                            <h1 className="mb-3 sm:mb-4 text-xs sm:text-sm leading-none font-medium text-center">Joueuses</h1>
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
                            <Button className="mt-2 sm:mt-3 text-xs sm:text-sm w-full"
                                    onClick={handleClearJoueuses}>Clear</Button>
                        </div>

                        {/* Carte des tirs */}
                        <div className="flex-1 flex flex-col min-h-[400px] lg:max-w-[900px] lg:max-h-[500px]">
                            {selectedDatas.length !== 0 ? (
                                <h1 className="text-center text-sm sm:text-base ">
                                    {selectedDatas.length === 1
                                        ? `Joueuse : ${selectedDatas[0].joueuse}`
                                        : `${selectedDatas.length} joueuses sélectionnées`
                                    }
                                </h1>
                            ) : (
                                <h1 className="text-center text-sm sm:text-base ">
                                    Aucune joueuse sélectionnée
                                </h1>
                            )}
                            <div className="flex-1 relative">
                                <CarteTirs datas={selectedDatas} appui={appui} showData={showData}/>
                            </div>


                            <div
                                className="flex-shrink-0 mt-3 sm:mt-4 flex flex-row items-center justify-around gap-4 sm:gap-6">
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="switchAppui" className="text-xs sm:text-sm">
                                        Suspension
                                    </Label>
                                    <Switch
                                        id="switchAppui"
                                        checked={appui}
                                        onCheckedChange={handleAppui}
                                    />
                                    <Label htmlFor="switchAppui" className="text-xs sm:text-sm">
                                        Appui
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="switchData" className="text-xs sm:text-sm">
                                        Heatmap
                                    </Label>
                                    <Switch
                                        id="switchData"
                                        checked={showData}
                                        onCheckedChange={handleShowData}
                                    />
                                    <Label htmlFor={"switchData"} className="text-xs sm:text-sm">
                                        Data
                                    </Label>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <p style={{ display: showData ? 'none' : 'block', textAlign: 'center' }}>Plus il y a de tir, plus le cercle est gros et rouge.</p>
                            <p style={{ display: showData ? 'block' : 'none', textAlign: 'center' }}>Le % est la précision et la valeur en haut à droite est le nombre de tir par secteurs.</p>


                        </div>

                        {/* Liste des matchs */}
                        <div className="flex flex-col items-center w-full lg:w-40 xl:w-48 h-[300px] lg:h-full">
                            <h1 className="mb-3 sm:mb-4 text-xs sm:text-sm leading-none font-medium text-center">Matchs</h1>
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
                            <Button className="mt-2 sm:mt-3 text-xs sm:text-sm w-full"
                                    onClick={handleClearMatchs}>Clear</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/*}
            <div className="flex flex-col items-center w-full sm:w-40 md:w-48 relative h-full">
                <CarteJoueuse joueuse={selectedDatas[0]?.joueuse} />
            </div> */}
        </div>
    );
}

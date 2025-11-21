import axios from "axios";
import { Car } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router";
import CarteJoueuse from "../components/CarteJoueuse";
import GraphStats from "../components/GraphStats";
import RadarStats from "@/components/RadarStats.jsx";
import GraphStatsDef from "../components/GraphStatsDef";

const ProfilJoueuse = () => {

  const { id } = useParams();
  const [joueuse, setJoueuse] = useState(null);
  const [datas, setDatas] = useState(null);
  const [evalueData, setEvalueData] = useState(null);
  const [defStats, setDefStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/joueuse/${id}`, { withCredentials: true })
      .then((res) => {
        setJoueuse(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du profil :", err);
      });

    axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getJoueuse/${id}`, { withCredentials: true })
      .then((res) => {
        setDatas(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
      });

    axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/dataParAffectation`, { withCredentials: true })
      .then((res) => {
        setEvalueData(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données par affectation :", err);
      });

    axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getJoueuseDef/${id}`, { withCredentials: true })
      .then((res) => {
        setDefStats(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données défensives :", err);
      });

  }, [id]);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Profil Joueuse {joueuse ? joueuse.nom : "Chargement..."}
      </h1>

      {joueuse && datas && defStats && (
        <>
          <div className="flex flex-col lg:flex-row gap-6 w-full h-80]">
            <div className="w-full lg:w-1/4 ">
              <CarteJoueuse joueuse={joueuse.nom} affectation={joueuse.affectation.affectation} />
            </div>
            <div className="w-full lg:w-3/4 ">
              <RadarStats joueuse={joueuse.nom} evalueData={evalueData} affectation={joueuse.affectation.affectation} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GraphStats
              stats={datas.tauxTirsReussis}
              titre="Taux de tirs réussis"
            />

            <GraphStats
              stats={datas.tirsReussis}
              titre="Tirs réussis"
            />

            <GraphStats
              stats={datas.tirsTotal}
              titre="Tirs total"
            />

            <GraphStats
              stats={datas.passeD}
              titre="Passes décisives"
            />
            <GraphStats
              stats={datas.perteBalle}
              titre="Pertes de balle"
            />

            <GraphStatsDef
              defStats={defStats.defPlus}
              titre="Statistiques Défensives Plus"
            />

            <GraphStatsDef
              defStats={defStats.defMoins}
              titre="Statistiques Défensives Moins"
            />

          </div>
        </>
      )}
    </div>
  );
}

export default ProfilJoueuse;
import axios from "axios";
import {Car} from "lucide-react";
import {use, useEffect, useState} from "react";
import {useParams} from "react-router";
import CarteJoueuse from "../components/CarteJoueuse";
import GraphStats from "../components/GraphStats";
import RadarStats from "@/components/RadarStats.jsx";

const ProfilJoueuse = () => {

    const {id} = useParams();
    const [joueuse, setJoueuse] = useState(null);
    const [datas, setDatas] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/joueuse/${id}`, {withCredentials: true})
            .then((res) => {
                console.log(res.data);
                setJoueuse(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du profil :", err);
            });

        axios.get(`${import.meta.env.VITE_SERVER_URL}/data/getJoueuse/${id}`, { withCredentials: true })
            .then((res) => {
                console.log("datas", res.data);
                setDatas(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des données :", err);
            });

    }, [id]);

    console.log("Profil de la joueuse avec l'ID :", id);


 return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Profil Joueuse {joueuse ? joueuse.nom : "Chargement..."}
      </h1>
      
      {joueuse && datas && (
        <>
        <div className="flex gap-6">
          <CarteJoueuse joueuse={joueuse.nom} />
          <RadarStats joueuse={joueuse.nom}/>
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
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilJoueuse;
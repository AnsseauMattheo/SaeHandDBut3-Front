import axios from "axios";
import {Car} from "lucide-react";
import {use, useEffect, useState} from "react";
import {useParams} from "react-router";
import CarteJoueuse from "../components/CarteJoueuse";
import RadarStats from "@/components/RadarStats.jsx";

const ProfilJoueuse = () => {

    const {id} = useParams();
    const [joueuse, setJoueuse] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/joueuses/joueuse/${id}`, {withCredentials: true})
            .then((res) => {
                console.log(res.data);
                setJoueuse(res.data);
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération du profil :", err);
            });
    }, [id]);

    console.log("Profil de la joueuse avec l'ID :", id);

    return (
        <div>
            ProfilJoueuse {joueuse ? joueuse.nom : "Chargement..."}
            {joueuse && (
                <div>
                    <CarteJoueuse joueuse={joueuse.nom}/>
                    <RadarStats joueuse={joueuse.nom}/>
                </div>
            )}
        </div>
    );
}

export default ProfilJoueuse;
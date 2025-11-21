import {Route, Routes} from "react-router-dom";
import {useAuth} from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Connexion from "./Pages/Connexion.jsx";
import DashBoard from "./Pages/Base_Main.jsx";
import StatTir from "./Pages/StatTir.jsx";
import DashboardTeam from "./Pages/DashboardTeam.jsx";
import SupImport from "./Pages/SupImport.jsx";
import CreationCompte from './Pages/AjoutUtilisateur.jsx';
import Joueuses from './Pages/Joueuses.jsx';
import ProfilJoueuse from './Pages/ProfilJoueuse.jsx';
import Enclenchements from './Pages/Enclenchements';
import StatsGenerales from './Pages/Stats-generales.jsx';
import AnalyseDefensive from "@/Pages/AnalyseDefensive.jsx";
import StatistiquesMatchMain from "@/Pages/StatistiquesMatchMain.jsx";
import AnalyseGB from "@/Pages/AnalyseGB.jsx";
import StatsAvancees from './Pages/StatsAvancees.jsx';
import Competition from "@/Pages/CalendrierResultat.jsx";
import ImportFile from './Pages/ImportFile.jsx';
import Unauthorized from './Pages/Unauthorized.jsx';

function App() {
    const {user, logout} = useAuth();

    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/Connexion" element={<Connexion/>}/>
            <Route path="/" element={<Connexion/>}/>
            <Route path="/activation" element={<CreationCompte/>}/>
            <Route path="/unauthorized" element={<Unauthorized/>}/>

            {/* Routes protégées */}
            <Route
                path="/DashBoard"
                element={
                    <ProtectedRoute >
                        <DashBoard user={user} logout={logout}/>
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardTeam/>}/>
                <Route path="calendrier-resultat" element={<Competition/>}/>
                <Route path='joueuses' element={<Joueuses/>}/>
                <Route path='joueuse/:id' element={<ProfilJoueuse/>}/>
                <Route
                    path="StatTir"
                    element={
                        <ProtectedRoute>
                            <StatTir/>
                        </ProtectedRoute>
                    }
                />

                {/* Routes COACH uniquement */}

                <Route
                    path="import"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <ImportFile/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="supImport"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <SupImport/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="ajout-utilisateur"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <CreationCompte/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/stats-avancees"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <StatsAvancees/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/:matchId/statistiques/enclenchements"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <Enclenchements/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/:matchId/statistiques/generales"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <StatsGenerales/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/:matchId/statistiques/analyse-defensive"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <AnalyseDefensive/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/:matchId/statistiques"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <StatistiquesMatchMain/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="match/:matchId/statistiques/analyse-gb"
                    element={
                        <ProtectedRoute requiredRole="Coach">
                            <AnalyseGB/>
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;

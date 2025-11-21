import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatsComparaison({ statsEquipe, statsAdversaire }) {
  const rows = [
    { label: "Buts", key: "buts" },
    { label: "Arrêts", key: "arrets" },
    { label: "HC", key: "HC" },
    { label: "Efficacité au tir", key: "efficaciteTir", isPercent: true },
    { label: "Ballons joués sur GE", key: "ballonJouesSurGE" },
    { label: "Bataille GE", key: "batailleGE" },
    { label: "Nbre de possessions en attaque placée", key: "nbPossessionsPlacees" },
    { label: "Efficacité Déf 6 c 6", key: "effiDef6c6", isPercent: true },
    { label: "Efficacité Att 6 c 6", key: "effiAtt6c6", isPercent: true },
    { label: "Pertes de balles", key: "pertesBalles" },
    { label: "Neutralisations", key: "neutralisations" },
    { label: "Efficacité par possession", key: "effiPossession", isPercent: true },
    { label: "Efficacité défensive par possession", key: "effiDefPossession", isPercent: true },
    { label: "Possessions globales", key: "possessionGlobal" }
  ];

  const renderValue = (value, isPercent) => (isPercent ? `${value}%` : value);
  const arrow = (a, b) =>
    a > b ? (
      <ArrowUp className="w-4 h-4 text-green-600 inline ml-2" />
    ) : a < b ? (
      <ArrowDown className="w-4 h-4 text-red-600 inline ml-2" />
    ) : null;

  return (
    <Card className="rounded-2xl shadow p-0 overflow-hidden">
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="bg-gray-100 text-lg">
            <th className="border p-2">Comparaisons des stats clés</th>
            <th className="border p-2">Sambre</th>
            <th className="border p-2">ADV</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const eq = statsEquipe[row.key];
            const adv = statsAdversaire[row.key];
            const isPercent = row.isPercent;

            const bgEq = eq > adv ? 'bg-green-300' : eq < adv ? 'bg-red-300' : '';
            const bgAdv = adv > eq ? 'bg-green-300' : adv < eq ? 'bg-red-300' : '';

            return (
              <tr key={row.key} className="text-md">
                <td className="border p-2 bg-gray-50 text-left pl-4">{row.label}</td>

                <td className={`border p-2  ${bgEq}`}>
                  {isPercent ? `${eq}%` : eq}
                  {eq > adv ? (
                    <ArrowUp className="w-4 h-4 text-green-600 inline ml-2" />
                  ) : eq < adv ? (
                    <ArrowDown className="w-4 h-4 text-red-600 inline ml-2" />
                  ) : null}
                </td>

                <td className={`border p-2  ${bgAdv}`}>
                  {isPercent ? `${adv}%` : adv}
                  {adv > eq ? (
                    <ArrowUp className="w-4 h-4 text-green-600 inline ml-2" />
                  ) : adv < eq ? (
                    <ArrowDown className="w-4 h-4 text-red-600 inline ml-2" />
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

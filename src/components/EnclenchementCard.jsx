import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnclenchementCard = ({ stats, rank, onClick }) => {
    const getColorClasses = (percentage) => {
        if (percentage >= 50) {
            return {
                badge: 'bg-green-100 text-green-800',
            };
        }
        if (percentage >= 40) {
            return {
                badge: 'bg-orange-100 text-orange-800',
            };
        }
        if (percentage >= 20) {
            return {
                badge: 'bg-blue-100 text-blue-800',
            };
        }
        return {
            badge: 'bg-red-100 text-red-800',
        };
    };

    const colors = getColorClasses(stats.pourcentageReussite);

    return (
        <Card
            className="relative hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onClick && onClick(stats)}
        >
            {rank && (
                <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg z-2 ${
                    rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                            rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                    #{rank}
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm sm:text-base line-clamp-2">
                        {stats.enclenchement}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
            {stats.pourcentageReussite.toFixed(1)}%
          </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-xs text-gray-500">Effectués</div>
                        <div className="text-lg font-bold">{stats.effectues}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Réussis</div>
                        <div className="text-lg font-bold text-green-600">{stats.reussis}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Échecs</div>
                        <div className="text-lg font-bold text-red-600">{stats.echecs}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center transition-all duration-700"
                            style={{ width: `${stats.pourcentageReussite}%` }}
                        >
              <span className="text-[10px] font-bold text-white">
                {stats.reussis}/{stats.effectues}
              </span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{stats.reussis}/{stats.effectues}</span>
                        {/*<span>{colors.icon} {colors.label}</span>*/}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnclenchementCard;

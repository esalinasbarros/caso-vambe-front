import React, { useMemo } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface DiscoveryChannelGapsProps {
    data: {
        channel: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
}

const DiscoveryChannelGaps: React.FC<DiscoveryChannelGapsProps> = ({ data }) => {
    // Todos los canales posibles según el schema
    const allChannels = [
        'Búsqueda Orgánica',
        'Redes Sociales',
        'Prospección Directa',
        'Referimiento',
        'Partner Comercial',
        'Evento',
        'Contenido',
        'Marketplace',
        'Prueba de Producto',
    ];

    // Canales sin clientes cerrados
    const channelsWithoutCloses = useMemo(() => {
        return data.filter(item => item.count > 0 && item.closedCount === 0);
    }, [data]);

    // Canales sin ningun cliente
    const channelsWithoutDeals = useMemo(() => {
        const existingChannels = new Set(data.map(item => item.channel));
        return allChannels.filter(channel => !existingChannels.has(channel));
    }, [data]);


    const totalLost = channelsWithoutCloses.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl h-full flex flex-col">
            <div className="mb-3">
                <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                    Canales sin Cierres
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Canales con clientes pero sin cierres */}
                <div className="bg-gradient-to-br from-red-500/15 to-red-600/10 border border-red-500/30 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white">
                                Oportunidades Perdidas
                            </h4>
                        </div>
                        {channelsWithoutCloses.length > 0 && (
                            <span className="px-2 py-0.5 bg-red-500/30 text-red-300 text-xs font-bold rounded-full">
                                {channelsWithoutCloses.length}
                            </span>
                        )}
                    </div>
                    {channelsWithoutCloses.length > 0 ? (
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                            {[...channelsWithoutCloses]
                                .sort((a, b) => b.count - a.count)
                                .map((item) => (
                                    <div
                                        key={item.channel}
                                        className="bg-white/5 hover:bg-white/10 rounded-md p-2 border border-red-500/20 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-white group-hover:text-red-200 transition-colors">
                                                {item.channel}
                                            </span>
                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-bold rounded">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-green-400/80 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span>Todos los canales tienen cierres</span>
                        </div>
                    )}
                </div>

                
                <div className="bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-500/30 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-500/20 rounded-lg">
                                <XCircle className="w-4 h-4 text-orange-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white">
                                Canales No Utilizados
                            </h4>
                        </div>
                        {channelsWithoutDeals.length > 0 && (
                            <span className="px-2 py-0.5 bg-orange-500/30 text-orange-300 text-xs font-bold rounded-full">
                                {channelsWithoutDeals.length}
                            </span>
                        )}
                    </div>
                    {channelsWithoutDeals.length > 0 ? (
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                            {channelsWithoutDeals.map((channel) => (
                                <div
                                    key={channel}
                                    className="bg-white/5 hover:bg-white/10 rounded-md p-2 border border-orange-500/20 transition-all"
                                >
                                    <span className="text-xs text-white/80">{channel}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-green-400/80 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span>Todos los canales están en uso</span>
                        </div>
                    )}
                </div>
            </div>

            {(channelsWithoutCloses.length > 0 || channelsWithoutDeals.length > 0) && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-6">
                        {totalLost > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                <div>
                                    <span className="text-lg font-bold text-red-400">{totalLost}</span>
                                    <span className="text-xs text-white/60 ml-1">sin cerrar</span>
                                </div>
                            </div>
                        )}
                        {channelsWithoutDeals.length > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                                <div>
                                    <span className="text-lg font-bold text-orange-400">{channelsWithoutDeals.length}</span>
                                    <span className="text-xs text-white/60 ml-1">sin usar</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscoveryChannelGaps;


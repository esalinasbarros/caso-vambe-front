import React from 'react';

interface VendorRankingProps {
    data: {
        vendedor: string;
        totalClients: number;
        closedDeals: number;
        conversionRate: number;
    }[];
}

const VendorRanking: React.FC<VendorRankingProps> = ({ data }) => {
    const sortedVendors = [...data].sort((a, b) => b.conversionRate - a.conversionRate);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                Ranking de Vendedores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedVendors.map((vendor, index) => (
                    <div
                        key={vendor.vendedor}
                        className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">
                                {index + 1}. {vendor.vendedor}
                            </span>
                        </div>
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-white/60">Clientes:</span>
                                <span className="text-white font-medium">{vendor.totalClients}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Cerrados:</span>
                                <span className="text-green-400 font-medium">{vendor.closedDeals}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Conversión:</span>
                                <span className="text-purple-400 font-bold">
                                    {vendor.conversionRate.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorRanking;


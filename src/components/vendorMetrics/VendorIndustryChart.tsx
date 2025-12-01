import React, { useMemo, useState, useEffect } from 'react';
import {
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
} from 'recharts';
import { AlertCircle } from 'lucide-react';

interface VendorIndustryChartProps {
    data: {
        vendedor: string;
        industry: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    vendors: string[];
}

const VendorIndustryChart: React.FC<VendorIndustryChartProps> = ({ data, vendors }) => {
    const [selectedVendor, setSelectedVendor] = useState<string>(vendors.length > 0 ? vendors[0] : 'all');
    
    useEffect(() => {
        if (vendors.length > 0 && selectedVendor === 'all') {
            setSelectedVendor(vendors[0]);
        }
    }, [vendors, selectedVendor]);
    const [search, setSearch] = useState('');
    const [minCount, setMinCount] = useState(0);
    const [sortBy, setSortBy] = useState<'conversion' | 'total'>('conversion');

    const radarData = useMemo(() => {
        if (selectedVendor === 'all') return [];
        
        const query = search.trim().toLowerCase();
        let vendorData = data.filter(item => item.vendedor === selectedVendor);
        
        vendorData = vendorData.filter((item) => item.count >= minCount);
        if (query) {
            vendorData = vendorData.filter((item) => item.industry.toLowerCase().includes(query));
        }
        
        const industryMap = new Map<string, { count: number; closedCount: number }>();

        vendorData.forEach((item) => {
            const current = industryMap.get(item.industry) || { count: 0, closedCount: 0 };
            industryMap.set(item.industry, {
                count: current.count + item.count,
                closedCount: current.closedCount + item.closedCount,
            });
        });

        const result = Array.from(industryMap.entries())
            .map(([industry, data]) => ({
                industry,
                conversionRate: data.count > 0 ? (data.closedCount / data.count) * 100 : 0,
                count: data.count,
                closedCount: data.closedCount,
                fullMark: 100,
            }));

        const sorted = sortBy === 'conversion' 
            ? [...result].sort((a, b) => b.conversionRate - a.conversionRate)
            : [...result].sort((a, b) => b.count - a.count);

        return sorted.slice(0, 8); 
    }, [data, selectedVendor, search, minCount, sortBy]);

    const avgConversion =
        radarData.length > 0
            ? radarData.reduce((sum, item) => sum + item.conversionRate, 0) / radarData.length
            : 0;

    const renderLegend = () => (
        <div className="flex items-center gap-3 text-xs text-white/70">
            <div className="flex items-center gap-1">
                <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ background: 'linear-gradient(180deg, #38bdf8 0%, #a855f7 100%)' }}
                />
                <span>Conversión (%)</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="inline-block w-4 h-[2px] border-t border-dashed border-sky-300" />
                <span>Promedio {avgConversion.toFixed(1)}%</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                        Conversión por Industria por Vendedor
                    </h3>
                    <span className="text-white/60 text-xs">
                        {selectedVendor === 'all' ? 'Todos los vendedores' : `Vendedor: ${selectedVendor}`}
                    </span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                    <option value="all" className="text-black">Todos los vendedores</option>
                    {vendors.map((vendor) => (
                        <option key={vendor} value={vendor} className="text-black">
                            {vendor}
                        </option>
                    ))}
                </select>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar industria"
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400 min-w-[140px]"
                />
                <input
                    type="number"
                    min={0}
                    value={minCount}
                    onChange={(e) => setMinCount(Number(e.target.value))}
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400 w-24"
                    placeholder="Min. clientes"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'conversion' | 'total')}
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                    <option value="conversion" className="text-black">
                        Ordenar por conversión
                    </option>
                    <option value="total" className="text-black">
                        Ordenar por volumen
                    </option>
                </select>
            </div>

            {selectedVendor !== 'all' && radarData.length > 0 ? (
                <div style={{ width: '100%', height: '450px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                            <PolarGrid 
                                stroke="rgba(255,255,255,0.25)" 
                                strokeWidth={1.5}
                            />
                            <PolarAngleAxis
                                dataKey="industry"
                                tick={{ fill: '#ffffff', fontSize: 12, fontWeight: 500 }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5 }}
                            />
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, 100]}
                                tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 500 }}
                                tickFormatter={(v) => `${v}%`}
                                stroke="rgba(255,255,255,0.3)"
                            />
                            <Radar
                                name="Conversión"
                                dataKey="conversionRate"
                                stroke="#60a5fa"
                                strokeWidth={4}
                                fill="none"
                                dot={{ fill: '#60a5fa', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const conversionValue = payload[0].value as number || 0;
                                        return (
                                            <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                                <p className="font-semibold text-white mb-2">Industria: {label}</p>
                                                <p className="text-sm text-white/80">
                                                    <span className="font-bold text-blue-400">{conversionValue.toFixed(1)}%</span>
                                                    <span className="text-white/60"> Conversión</span>
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}
                                iconType="line"
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[450px] flex items-center justify-center text-white/40">
                    <p>Selecciona un vendedor para ver el diagrama web</p>
                </div>
            )}

            {selectedVendor !== 'all' && radarData.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                    <div>{renderLegend()}</div>
                    <div className="text-xs text-white/60 flex gap-3 flex-wrap">
                        {radarData.map((item) => (
                            <div
                                key={item.industry}
                                className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                            >
                                {item.industry}: {item.closedCount}/{item.count} cerrados ({item.conversionRate.toFixed(1)}%)
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorIndustryChart;


import React, { useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList,
} from 'recharts';
import { Search } from 'lucide-react';

interface DiscoveryBreakdownProps {
    data: {
        channel: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
}

const DiscoveryBreakdown: React.FC<DiscoveryBreakdownProps> = ({ data }) => {
    const [search, setSearch] = useState('');
    const [minCount, setMinCount] = useState(0);

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data
            .filter((item) => item.count >= minCount)
            .filter((item) => (query ? item.channel.toLowerCase().includes(query) : true))
            .sort((a, b) => b.count - a.count);
    }, [data, minCount, search]);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                    <Search className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-lime-400">
                        Rendimiento por Canal
                    </h3>
                    <p className="text-white/60 text-xs">Clientes por canal de descubrimiento</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar canal"
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 min-w-[140px]"
                />
                <input
                    type="number"
                    min={0}
                    value={minCount}
                    onChange={(e) => setMinCount(Number(e.target.value))}
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 w-24"
                    placeholder="Min. clientes"
                />
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="channel"
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const countValue = payload.find(p => p.dataKey === 'count')?.value as number || 0;
                                    const closedValue = payload.find(p => p.dataKey === 'closedCount')?.value as number || 0;
                                    const conversionValue = payload.find(p => p.dataKey === 'conversionRate')?.value as number || 0;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-2">Canal: {label}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-blue-400">{countValue}</span>
                                                <span className="text-white/60"> Total Clientes</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-green-400">{closedValue}</span>
                                                <span className="text-white/60"> Cerrados</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-yellow-400">{conversionValue.toFixed(1)}%</span>
                                                <span className="text-white/60"> Tasa Conversión</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '11px', color: '#ffffff', paddingTop: '10px' }}
                            iconType="circle"
                        />
                        <Bar dataKey="count" name="Total" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                        <Bar dataKey="closedCount" name="Cerrados" radius={[4, 4, 0, 0]} fill="#34d399">
                            <LabelList
                                dataKey="conversionRate"
                                position="top"
                                formatter={(value: any) => typeof value === 'number' ? `${value.toFixed(1)}%` : ''}
                                fill="#fbbf24"
                                fontSize={10}
                                fontWeight="bold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {filteredData.map((item) => (
                    <div
                        key={item.channel}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10"
                    >
                        <span className="text-white/70">{item.channel}:</span>
                        <span className="text-white font-semibold">{item.count}</span>
                        <span className="text-white/50">({item.conversionRate.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoveryBreakdown;

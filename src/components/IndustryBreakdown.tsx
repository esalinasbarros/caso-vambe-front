import React, { useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    ReferenceLine,
} from 'recharts';

interface IndustryBreakdownProps {
    data: {
        industry: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
}

const IndustryBreakdown: React.FC<IndustryBreakdownProps> = ({ data }) => {
    const [search, setSearch] = useState('');
    const [minCount, setMinCount] = useState(0);
    const [sortBy, setSortBy] = useState<'conversion' | 'total'>('conversion');

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        return data
            .filter((item) => item.count >= minCount)
            .filter((item) => (query ? item.industry.toLowerCase().includes(query) : true));
    }, [data, minCount, search]);

    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) =>
            sortBy === 'conversion' ? b.conversionRate - a.conversionRate : b.count - a.count
        );
    }, [filteredData, sortBy]);

    const avgConversion =
        sortedData.length > 0
            ? sortedData.reduce((sum, item) => sum + item.conversionRate, 0) / sortedData.length
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                        Rendimiento por Industria
                    </h3>
                    <span className="text-white/60 text-xs">Total vs cerrados · Conversión</span>
                </div>
                <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="h-[380px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData} margin={{ top: 30, right: 20, left: 10, bottom: 40 }}>
                        <defs>
                            <linearGradient id="industryConv" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.75} />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.95} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="industry"
                            angle={-25}
                            textAnchor="end"
                            dy={5}
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            height={60}
                            interval={0}
                        />
                        <YAxis
                            dataKey="conversionRate"
                            type="number"
                            domain={[0, 100]}
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    const conversionValue = item.conversionRate || 0;
                                    const countValue = item.count || 0;
                                    const closedValue = item.closedCount || 0;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-2">Industria: {label}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-blue-400">{countValue}</span>
                                                <span className="text-white/60"> Total</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-green-400">{closedValue}</span>
                                                <span className="text-white/60"> Cerrados</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-yellow-400">{conversionValue.toFixed(1)}%</span>
                                                <span className="text-white/60"> Conversión</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <ReferenceLine
                            y={avgConversion}
                            stroke="#38bdf8"
                            strokeDasharray="4 4"
                            label={{
                                value: `Promedio ${avgConversion.toFixed(1)}%`,
                                position: 'right',
                                fill: '#e2e8f0',
                                fontSize: 11,
                            }}
                        />

                        <Bar
                            dataKey="conversionRate"
                            name="Conversión (%)"
                            fill="url(#industryConv)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                        >
                            <LabelList
                                dataKey="conversionRate"
                                position="top"
                                formatter={(value) => typeof value === 'number' ? `${value.toFixed(1)}%` : String(value ?? '')}
                                fill="#e2e8f0"
                                fontSize={11}
                                className="font-semibold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-col gap-2">
                <div>{renderLegend()}</div>
                <div className="text-xs text-white/60 flex gap-3 flex-wrap">
                    {sortedData.map((item) => (
                        <div
                            key={item.industry}
                            className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70"
                        >
                            {item.industry}: {item.closedCount}/{item.count} cerrados
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IndustryBreakdown;

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { AlertCircle } from 'lucide-react';

interface PainPointChartProps {
    data: {
        painPoint: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
}

const PainPointChart: React.FC<PainPointChartProps> = ({ data }) => {
    const COLORS = [
        '#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fb923c',
        '#fbbf24', '#22d3ee', '#f87171', '#84cc16', '#ec4899'
    ];

    const chartData = data.slice(0, 8).map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
    }));

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-orange-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                        Problemas Principales
                    </h3>
                    <p className="text-white/60 text-xs">Distribución de problemas por frecuencia</p>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            type="number"
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="painPoint"
                            width={95}
                            tick={{ fill: '#ffffff', fontSize: 10 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const countValue = payload.find(p => p.dataKey === 'count')?.value as number || 0;
                                    const closedValue = payload.find(p => p.dataKey === 'closedCount')?.value as number || 0;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-2">Problema: {label}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-orange-400">{countValue}</span>
                                                <span className="text-white/60"> Total</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-green-400">{closedValue}</span>
                                                <span className="text-white/60"> Cerrados</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="count" name="Total" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {chartData.map((item, index) => (
                    <div
                        key={item.painPoint}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/70">{item.painPoint}:</span>
                        <span className="text-white font-semibold">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PainPointChart;


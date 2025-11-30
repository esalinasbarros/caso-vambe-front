import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Puzzle } from 'lucide-react';

interface UsefulAddonsChartProps {
    data: {
        addon: string;
        count: number;
    }[];
}

const UsefulAddonsChart: React.FC<UsefulAddonsChartProps> = ({ data }) => {
    const COLORS = [
        '#60a5fa',
        '#a78bfa',
        '#34d399',
        '#f472b6',
        '#fb923c',
        '#fbbf24',
        '#22d3ee',
    ];

    const allAddons = [
        "Llamadas en vambe",
        "Comentarios en instagram",
        "Generador de PDF con IA",
        "Gmail: Envio de correaos con IA",
        "Razones de perdida en tickets",
        "NPS con IA",
        "Formulas Matematicas con IA"
    ];

    const chartData = useMemo(() => {
        return allAddons.map((addon, index) => {
            const existing = data.find(item => item.addon === addon);
            return {
                addon,
                count: existing?.count || 0,
                color: COLORS[index % COLORS.length],
            };
        });
    }, [data]);

    const total = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                    <Puzzle className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Addons Más "Útiles" segun necesidades de clientes
                    </h3>
                    <p className="text-white/60 text-xs">Métricas de addons más "útiles" segun necesidades de clientes</p>
                </div>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="addon"
                            tick={{ fill: '#ffffff', fontSize: 10 }}
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
                                    const value = payload[0].value as number;
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-2">{label}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-purple-400">{value}</span>
                                                <span className="text-white/60"> ventas </span>
                                                <span className="text-yellow-400 font-semibold">({percentage}%)</span>
                                            </p>
                                            <p className="text-xs text-white/50 mt-1 pt-1 border-t border-white/10">
                                                Total: <span className="text-cyan-400 font-semibold">{total}</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar 
                            dataKey="count" 
                            radius={[4, 4, 0, 0]}
                            shape={(props: any) => {
                                const { payload, x, y, width, height } = props;
                                const index = chartData.findIndex(d => d.addon === payload.addon);
                                const color = chartData[index]?.color || '#a78bfa';
                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={color}
                                        rx={4}
                                        ry={4}
                                    />
                                );
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {chartData.map((item) => {
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                    return (
                        <div
                            key={item.addon}
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10"
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-white/70">{item.addon}:</span>
                            <span className="text-white font-semibold">{item.count}</span>
                            <span className="text-white/50">({percentage}%)</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsefulAddonsChart;


import React from 'react';
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
import { TrendingUp } from 'lucide-react';

interface VolumeChartProps {
    data: {
        volumeRange: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
    const COLORS = {
        '0-50': '#60a5fa',
        '51-100': '#a78bfa',
        '101-200': '#34d399',
        '201-500': '#f472b6',
        '500+': '#fb923c',
    };

    const chartData = data.map((item) => ({
        ...item,
        color: COLORS[item.volumeRange as keyof typeof COLORS] || '#94a3b8',
    }));

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Distribución por Volumen
                    </h3>
                    <p className="text-white/60 text-xs">Clientes por rango de interacciones</p>
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
                            dataKey="volumeRange"
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
                                            <p className="font-semibold text-white mb-2">Rango: {label}</p>
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
                {chartData.map((item) => (
                    <div
                        key={item.volumeRange}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/70">{item.volumeRange}:</span>
                        <span className="text-white font-semibold">{item.count}</span>
                        <span className="text-white/50">({item.conversionRate.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolumeChart;


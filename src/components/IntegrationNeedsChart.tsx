import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Plug, Code, Database, Cloud } from 'lucide-react';

interface IntegrationNeedsChartProps {
    data: {
        integrationNeed: string;
        count: number;
    }[];
}

const IntegrationNeedsChart: React.FC<IntegrationNeedsChartProps> = ({ data }) => {
    
    const COLORS = [
        '#60a5fa', // blue-400
        '#a78bfa', // violet-400
        '#34d399', // emerald-400
        '#f472b6', // pink-400
        '#fb923c', // orange-400
        '#fbbf24', // amber-400
        '#22d3ee', // cyan-400
        '#f87171', // red-400
    ];

    // Filtrar y preparar datos (excluir N/A si hay otros datos)
    const chartData = useMemo(() => {
        const filtered = data.filter(item => item.integrationNeed && item.integrationNeed !== 'N/A');
        const naData = data.find(item => item.integrationNeed === 'N/A' || !item.integrationNeed);
        
        const result = filtered.length > 0 ? filtered : (naData ? [naData] : []);
        return result.map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length],
        }));
    }, [data]);

    const total = useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    // Función para obtener el icono según el tipo de integración
    const getIcon = (need: string) => {
        const lower = need.toLowerCase();
        if (lower.includes('api') || lower.includes('sdk')) return <Code className="w-4 h-4" />;
        if (lower.includes('crm')) return <Database className="w-4 h-4" />;
        if (lower.includes('erp')) return <Cloud className="w-4 h-4" />;
        return <Plug className="w-4 h-4" />;
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
            return (
                <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                    <p className="font-semibold text-white mb-1">{data.name}</p>
                    <p className="text-sm text-white/80">
                        <span className="font-bold text-blue-400">{data.value}</span> clientes ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // No mostrar etiquetas muy pequeñas

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={11}
                fontWeight={600}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (chartData.length === 0) {
        return (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-2xl">
                <div className="text-center py-8">
                    <Plug className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">No hay datos de necesidades de integración</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl">
            <div className="mb-4">
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Necesidades de Integración
                </h3>
                <p className="text-white/60 text-xs mt-1">
                    Necesidades de integración requeridas por clientes que no se cerraron
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Gráfico de Dona */}
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={CustomLabel}
                                outerRadius={100}
                                innerRadius={50}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Lista de necesidades */}
                <div className="flex flex-col justify-center">
                    <div className="space-y-2">
                        {chartData
                            .sort((a, b) => b.count - a.count)
                            .map((item, index) => {
                                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                                return (
                                    <div
                                        key={item.integrationNeed}
                                        className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="p-1.5 rounded-lg"
                                                    style={{ backgroundColor: `${item.color}20` }}
                                                >
                                                    <div style={{ color: item.color }}>
                                                        {getIcon(item.integrationNeed)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                        {item.integrationNeed}
                                                    </p>
                                                    <p className="text-xs text-white/50">{percentage}% del total</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold" style={{ color: item.color }}>
                                                    {item.count}
                                                </p>
                                                <p className="text-xs text-white/50">clientes</p>
                                            </div>
                                        </div>
                                        {/* Barra de progreso */}
                                        <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70">Total de clientes pendientes:</span>
                            <span className="text-xl font-bold text-white">{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationNeedsChart;


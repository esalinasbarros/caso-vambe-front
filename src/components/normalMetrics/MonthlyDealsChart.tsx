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
} from 'recharts';
import { Calendar } from 'lucide-react';

interface MonthlyDealsChartProps {
    data: {
        month: string;
        closedDeals: number;
        notClosedDeals: number;
    }[];
}

const MonthlyDealsChart: React.FC<MonthlyDealsChartProps> = ({ data }) => {
    const formatMonth = (month: string) => {
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'short' });
    };

    const chartData = data.map((item) => ({
        ...item,
        monthFormatted: formatMonth(item.month),
    }));

    if (chartData.length === 0) {
        return null;
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Clientes por Mes
                    </h3>
                    <p className="text-white/60 text-xs">Cerrados vs No Cerrados</p>
                </div>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="monthFormatted"
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const closedValue = payload.find(p => p.dataKey === 'closedDeals')?.value as number || 0;
                                    const notClosedValue = payload.find(p => p.dataKey === 'notClosedDeals')?.value as number || 0;
                                    const total = closedValue + notClosedValue;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-2">{label}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-green-400">{closedValue}</span>
                                                <span className="text-white/60"> Cerrados</span>
                                            </p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-red-400">{notClosedValue}</span>
                                                <span className="text-white/60"> No Cerrados</span>
                                            </p>
                                            <p className="text-sm text-white/80 mt-1 pt-1 border-t border-white/10">
                                                <span className="font-bold text-white">{total}</span>
                                                <span className="text-white/60"> Total</span>
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
                        <Bar dataKey="closedDeals" name="Cerrados" radius={[4, 4, 0, 0]} fill="#34d399" />
                        <Bar dataKey="notClosedDeals" name="No Cerrados" radius={[4, 4, 0, 0]} fill="#f87171" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyDealsChart;


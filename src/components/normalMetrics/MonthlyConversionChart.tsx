import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MonthlyConversionChartProps {
    data: {
        month: string;
        conversionRate: number;
    }[];
}

const MonthlyConversionChart: React.FC<MonthlyConversionChartProps> = ({ data }) => {
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
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Tasa de Conversión por Mes
                    </h3>
                    <p className="text-white/60 text-xs">Evolución mensual</p>
                </div>
            </div>

            <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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
                            domain={[0, 100]}
                            tick={{ fill: '#ffffff', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const value = payload[0].value as number;
                                    return (
                                        <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                            <p className="font-semibold text-white mb-1">{payload[0].payload.monthFormatted}</p>
                                            <p className="text-sm text-white/80">
                                                <span className="font-bold text-purple-400">{value.toFixed(1)}%</span>
                                                <span className="text-white/60"> Conversión</span>
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="conversionRate"
                            stroke="#a78bfa"
                            strokeWidth={3}
                            dot={{ fill: '#a78bfa', r: 5 }}
                            activeDot={{ r: 7, fill: '#c084fc' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyConversionChart;


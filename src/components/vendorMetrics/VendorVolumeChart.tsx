import React, { useMemo, useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface VendorVolumeChartProps {
    data: {
        vendedor: string;
        volumeRange: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    vendors: string[];
}

const VendorVolumeChart: React.FC<VendorVolumeChartProps> = ({ data, vendors }) => {
    const [selectedVendor, setSelectedVendor] = useState<string>(vendors.length > 0 ? vendors[0] : 'all');
    
    useEffect(() => {
        if (vendors.length > 0 && selectedVendor === 'all') {
            setSelectedVendor(vendors[0]);
        }
    }, [vendors, selectedVendor]);
    
    const [minCount, setMinCount] = useState(0);

    const volumeOrder = ['0-50', '51-100', '101-200', '201-500', '500+'];

    const chartData = useMemo(() => {
        if (selectedVendor === 'all') return [];
        
        let vendorData = data.filter(item => item.vendedor === selectedVendor);
        
        vendorData = vendorData.filter((item) => item.count >= minCount);
        
        const volumeMap = new Map<string, { count: number; closedCount: number }>();

        vendorData.forEach((item) => {
            const current = volumeMap.get(item.volumeRange) || { count: 0, closedCount: 0 };
            volumeMap.set(item.volumeRange, {
                count: current.count + item.count,
                closedCount: current.closedCount + item.closedCount,
            });
        });

        return volumeOrder.map((volumeRange) => {
            const volumeData = volumeMap.get(volumeRange) || { count: 0, closedCount: 0 };
            return {
                volumeRange,
                conversionRate: volumeData.count > 0 ? (volumeData.closedCount / volumeData.count) * 100 : 0,
                count: volumeData.count,
                closedCount: volumeData.closedCount,
            };
        });
    }, [data, selectedVendor, minCount]);

    const avgConversion =
        chartData.length > 0
            ? chartData.reduce((sum, item) => sum + item.conversionRate, 0) / chartData.length
            : 0;

    const COLORS = ['#3b82f6', '#06b6d4', '#60a5fa', '#22d3ee', '#38bdf8'];

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Conversión por Volumen por Vendedor
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
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-400"
                >
                    <option value="all" className="text-black">Todos los vendedores</option>
                    {vendors.map((vendor) => (
                        <option key={vendor} value={vendor} className="text-black">
                            {vendor}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    min={0}
                    value={minCount}
                    onChange={(e) => setMinCount(Number(e.target.value))}
                    className="bg-white/5 border border-white/15 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-400 w-24"
                    placeholder="Min. clientes"
                />
            </div>

            {selectedVendor !== 'all' ? (
                <div style={{ width: '100%', height: '450px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                tick={{ fill: '#ffffff', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <YAxis
                                type="category"
                                dataKey="volumeRange"
                                width={80}
                                tick={{ fill: '#ffffff', fontSize: 11 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const conversionValue = payload[0].value as number || 0;
                                        return (
                                            <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                                <p className="font-semibold text-white mb-2">Rango: {label}</p>
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
                                wrapperStyle={{ fontSize: '11px', color: '#ffffff', paddingTop: '10px' }}
                                iconType="circle"
                            />
                            <Bar dataKey="conversionRate" name="Tasa de Conversión" radius={[0, 4, 4, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[450px] flex items-center justify-center text-white/40">
                    <p>Selecciona un vendedor para ver el gráfico</p>
                </div>
            )}

            {selectedVendor !== 'all' && (
                <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-xs text-white/70">
                        <span>Promedio de conversión: <strong className="text-blue-400">{avgConversion.toFixed(1)}%</strong></span>
                    </div>
                    <div className="text-xs text-white/60 flex gap-3 flex-wrap">
                        {chartData.map((item, index) => (
                            <div
                                key={item.volumeRange}
                                className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center gap-1.5"
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span>{item.volumeRange}:</span>
                                <span className="font-semibold">{item.closedCount}/{item.count}</span>
                                <span>({item.conversionRate.toFixed(1)}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorVolumeChart;


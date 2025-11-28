import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface VendorPerformanceChartProps {
    data: {
        vendedor: string;
        totalClients: number;
        closedDeals: number;
        conversionRate: number;
    }[];
}

const VendorPerformanceChart: React.FC<VendorPerformanceChartProps> = ({ data }) => {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 shadow-lg h-full">
            <h3 className="text-base font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">Desempeño por Vendedor</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 45 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="vendedor" 
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tick={{ fill: '#ffffff', fontSize: 10, fontWeight: 500 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        dy={5}
                    />
                    <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#ffffff', fontSize: 10 }}
                        width={30}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                const totalValue = payload.find(p => p.dataKey === 'totalClients')?.value as number || 0;
                                const closedValue = payload.find(p => p.dataKey === 'closedDeals')?.value as number || 0;
                                return (
                                    <div className="bg-slate-900/95 border border-white/20 rounded-lg p-3 shadow-xl">
                                        <p className="font-semibold text-white mb-2">{label}</p>
                                        <p className="text-sm text-white/80">
                                            <span className="font-bold text-blue-400">{totalValue}</span>
                                            <span className="text-white/60"> Total Clientes</span>
                                        </p>
                                        <p className="text-sm text-white/80">
                                            <span className="font-bold text-purple-400">{closedValue}</span>
                                            <span className="text-white/60"> Cerrados</span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} iconSize={8} />
                    <Bar dataKey="totalClients" fill="#0ea5e9" name="Total Clientes" radius={[3, 3, 0, 0]}>
                        <LabelList 
                            dataKey="totalClients" 
                            position="top" 
                            fill="#ffffff" 
                            fontSize={10} 
                            fontWeight="bold"
                            offset={5}
                        />
                    </Bar>
                    <Bar dataKey="closedDeals" fill="#d946ef" name="Cerrados" radius={[3, 3, 0, 0]}>
                        <LabelList 
                            dataKey="closedDeals" 
                            position="top" 
                            fill="#ffffff" 
                            fontSize={10} 
                            fontWeight="bold"
                            offset={5}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VendorPerformanceChart;

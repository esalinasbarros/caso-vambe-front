import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, gradient }) => {
    return (
        <div className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-3 shadow-lg bg-gradient-to-br text-white ${gradient} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-white/30`}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-[11px] font-medium uppercase tracking-wide truncate">{title}</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <p className="text-2xl font-bold leading-none">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-0.5">
                                <span className={`text-[10px] font-medium ${trend.isPositive ? 'text-green-300' : 'text-red-300'}`}>
                                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-white/80 bg-white/10 p-2 rounded-lg flex-shrink-0">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
                </div>
            </div>
        </div>
    );
};

export default StatCard;

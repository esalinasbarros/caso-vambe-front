import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getCacheStatus, clearCache } from '../../services/api';

interface CacheStatus {
    total: number;
    cached: number;
    lastUpdated: string | null;
}

const CacheManager: React.FC = () => {
    const [status, setStatus] = useState<CacheStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [clearing, setClearing] = useState(false);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const data = await getCacheStatus();
            setStatus(data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClearCache = async () => {
        if (!confirm('Estas seguro de que quieres limpiar el cache? Esto forzara nuevas llamadas a GPT.')) {
            return;
        }
        try {
            setClearing(true);
            await clearCache();
            await fetchStatus();
        } catch (error) {
            alert('Error al limpiar el cache');
        } finally {
            setClearing(false);
        }
    };

    if (!status) {
        return null;
    }

    const cachePercentage = status.total > 0 ? Math.round((status.cached / status.total) * 100) : 0;
    const isComplete = status.cached === status.total && status.total > 0;

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                        <Database className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Gestion de Cache
                        </h3>
                        <p className="text-white/60 text-xs">Estado de categorizaciones guardadas</p>
                    </div>
                </div>
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/15 transition-all disabled:opacity-50"
                    title="Actualizar estado"
                >
                    <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">Total Clientes</div>
                        <div className="text-2xl font-bold text-white">{status.total}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">En Cache</div>
                        <div className="text-2xl font-bold text-green-400">{status.cached}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">Cobertura</div>
                        <div className="text-2xl font-bold text-blue-400">{cachePercentage}%</div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isComplete ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-orange-400" />
                            )}
                            <span className="text-sm text-white/70">
                                {isComplete ? 'Cache completo' : `${status.total - status.cached} clientes pendientes`}
                            </span>
                        </div>
                        {status.lastUpdated && (
                            <span className="text-xs text-white/50">
                                {new Date(status.lastUpdated).toLocaleString('es-ES')}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleClearCache}
                        disabled={clearing || status.cached === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Trash2 className="w-4 h-4" />
                        {clearing ? 'Limpiando...' : 'Limpiar Cache'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CacheManager;


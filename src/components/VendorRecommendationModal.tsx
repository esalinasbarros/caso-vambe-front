import { useState } from 'react';
import { X, Loader2, UserCheck } from 'lucide-react';
import { getVendorRecommendation } from '../services/api';

interface VendorRecommendationModalProps {
  onClose: () => void;
}

const VendorRecommendationModal = ({ onClose }: VendorRecommendationModalProps) => {
  const [clientDescription, setClientDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{ industry: string; vendors: { vendedor: string; totalClients: number; closedDeals: number; conversionRate: number }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientDescription.trim()) {
      setError('Por favor, describe al cliente potencial');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const result = await getVendorRecommendation(clientDescription);
      setRecommendation(result);
    } catch (err) {
      setError('Error al obtener la recomendacion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 rounded-lg">
            <UserCheck className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Recomendación de Vendedor</h3>
            <p className="text-white/60 text-sm">Describe el cliente potencial para obtener una recomendación</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
              Descripción del cliente potencial
            </label>
            <textarea
              id="description"
              value={clientDescription}
              onChange={(e) => setClientDescription(e.target.value)}
              placeholder="Ej: Empresa de retail con 50 empleados, necesita solución de pagos online, urgencia alta, presupuesto medio..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-sky-400 resize-none"
              rows={6}
              disabled={loading}
            />
            <p className="text-xs text-white/50 mt-1">
              Incluye información sobre industria, tamaño, necesidades, urgencia, presupuesto, etc.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {recommendation && (
            <div className="bg-gradient-to-r from-sky-500/20 to-fuchsia-500/20 border border-sky-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-400" />
                Vendedores Recomendados
              </h4>
              <div className="mb-3 pb-3 border-b border-white/10">
                <p className="text-sm text-white/70">Industria detectada:</p>
                <p className="text-lg font-bold text-white">{recommendation.industry}</p>
              </div>
              {recommendation.vendors.length > 0 ? (
                <div className="space-y-2">
                  {recommendation.vendors.map((vendor, index) => (
                    <div
                      key={vendor.vendedor}
                      className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' :
                            'bg-white/10 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-semibold text-white">{vendor.vendedor}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-400">
                            {vendor.conversionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                        <div>
                          <span>Clientes: </span>
                          <span className="text-white font-medium">{vendor.totalClients}</span>
                        </div>
                        <div>
                          <span>Cerrados: </span>
                          <span className="text-green-400 font-medium">{vendor.closedDeals}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70 text-sm">
                  No se encontraron vendedores con experiencia en esta industria.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !clientDescription.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Analizando...' : 'Obtener Recomendación'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRecommendationModal;

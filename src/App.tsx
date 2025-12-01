import { useEffect, useState, useCallback } from 'react';
import { TrendingUp, Users, CheckCircle, Loader2, UserCheck } from 'lucide-react';
import StatCard from './components/common/StatCard';
import ClientList from './components/common/ClientList';
import VendorPerformanceChart from './components/vendorMetrics/VendorPerformanceChart';
import VendorRanking from './components/vendorMetrics/VendorRanking';
import ClientDetailModal from './components/modals/ClientDetailModal';
import IndustryBreakdown from './components/normalMetrics/IndustryBreakdown';
import DiscoveryBreakdown from './components/normalMetrics/DiscoveryBreakdown';
import DiscoveryChannelGaps from './components/normalMetrics/DiscoveryChannelGaps';
import IntegrationNeedsChart from './components/normalMetrics/IntegrationNeedsChart';
import PainPointChart from './components/normalMetrics/PainPointChart';
import VendorIndustryChart from './components/vendorMetrics/VendorIndustryChart';
import VendorPainPointChart from './components/vendorMetrics/VendorPainPointChart';
import VendorVolumeChart from './components/vendorMetrics/VendorVolumeChart';
import VolumeChart from './components/normalMetrics/VolumeChart';
import SolutionPartChart from './components/normalMetrics/SolutionPartChart';
import UsefulAddonsChart from './components/normalMetrics/UsefulAddonsChart';
import MonthlyDealsChart from './components/normalMetrics/MonthlyDealsChart';
import MonthlyConversionChart from './components/normalMetrics/MonthlyConversionChart';
import CacheManager from './components/common/CacheManager';
import VendorRecommendationModal from './components/modals/VendorRecommendationModal';
import { getBasicMetrics, getAdvancedMetrics } from './services/api';
import { Metrics, CategorizedClient } from './types';

function App() {
  const [categorizedClients, setCategorizedClients] = useState<CategorizedClient[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAdvanced, setLoadingAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<CategorizedClient | null>(null);
  const [showVendorRecommendation, setShowVendorRecommendation] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Función helper para generar opciones de meses
  const generateMonthOptions = () => {
    const months: string[] = [];
    
    // Generar todos los meses del 2024
    for (let i = 1; i <= 12; i++) {
      const month = String(i).padStart(2, '0');
      months.push(`2024-${month}`);
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  // Función helper para formatear mes para mostrar
  const formatMonthLabel = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const formatted = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    // Capitalizar primera letra
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const fetchBasicMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const basicMetricsData = await getBasicMetrics(selectedMonth);
      setMetrics(basicMetricsData as Metrics);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos. Asegurate de que el backend este corriendo.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchBasicMetrics();
    // Resetear métricas avanzadas cuando cambie el mes para evitar inconsistencias
    setCategorizedClients([]);
    setMetrics((prev) => {
      if (!prev) return null;
      // Mantener solo las métricas básicas (overview y byVendor)
      return {
        overview: prev.overview,
        byVendor: prev.byVendor,
      } as Metrics;
    });
  }, [selectedMonth, fetchBasicMetrics]);

  const handleLoadAdvancedMetrics = async (forceRefresh: boolean = false) => {
    try {
      setLoadingAdvanced(true);
      const { metrics: advancedMetricsData, categorizedClients: clientsData } = await getAdvancedMetrics(forceRefresh, selectedMonth);
      setMetrics((prev) => ({
        ...prev,
        ...advancedMetricsData,
      } as Metrics));
      setCategorizedClients(clientsData);
    } catch (err) {
    } finally {
      setLoadingAdvanced(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-white/70 text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 shadow-2xl max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Error de Conexión</h2>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl mt-6"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">Vambe Analytics</span>
              </h1>
              <p className="text-white/60 text-sm">
                Panel de categorización automática y métricas de clientes
              </p>
            </div>
            <button
              onClick={() => setShowVendorRecommendation(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <UserCheck className="w-4 h-4" />
              Recomendar Vendedor
            </button>
          </div>
          
          {/* Selector de Mes */}
          <div className="flex items-center gap-3">
            <label htmlFor="month-select" className="text-white/70 text-sm font-medium">
              Filtrar por mes:
            </label>
            <select
              id="month-select"
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value || null)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
            >
              <option value="" className="text-black">Todos los meses</option>
              {monthOptions.map((month) => (
                <option key={month} value={month} className="text-black">
                  {formatMonthLabel(month)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 animate-slide-up">
          <StatCard
            title="Total Clientes"
            value={metrics?.overview.totalClients || 0}
            icon={<Users className="w-5 h-5" />}
            gradient="from-blue-600 to-blue-400"
          />
          <StatCard
            title="Negocios Cerrados"
            value={metrics?.overview.closedDeals || 0}
            icon={<CheckCircle className="w-5 h-5" />}
            gradient="from-green-600 to-green-400"
          />
          <StatCard
            title="Tasa de Conversión"
            value={`${metrics?.overview.conversionRate.toFixed(1) || 0}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            gradient="from-purple-600 to-purple-400"
          />
        </div>

        {/* Gráficos de Métricas por Mes */}
        {metrics && metrics.timeSeriesData && metrics.timeSeriesData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <MonthlyDealsChart 
              data={metrics.timeSeriesData.map(item => ({
                month: item.month,
                closedDeals: item.closedDeals,
                notClosedDeals: item.notClosedDeals || (item.totalClients - item.closedDeals),
              }))} 
            />
            <MonthlyConversionChart 
              data={metrics.timeSeriesData.map(item => ({
                month: item.month,
                conversionRate: item.conversionRate,
              }))} 
            />
          </div>
        )}

        {metrics && metrics.byVendor.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <VendorPerformanceChart data={metrics.byVendor} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <VendorRanking data={metrics.byVendor} />
            </div>
          </div>
        )}

        {(!metrics?.byIndustry || metrics.byIndustry.length === 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-dashed border-white/20 p-6 shadow-2xl text-center">
                <h3 className="text-lg font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                  Métricas Avanzadas
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  Carga métricas detalladas basadas en categorización por IA (industria, canales, problemas, etc.)
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleLoadAdvancedMetrics(false)}
                    disabled={loadingAdvanced}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {loadingAdvanced && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loadingAdvanced ? 'Cargando...' : 'Cargar desde Caché'}
                  </button>
                  <button
                    onClick={() => handleLoadAdvancedMetrics(true)}
                    disabled={loadingAdvanced}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {loadingAdvanced && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loadingAdvanced ? 'Cargando...' : 'Recargar Todo'}
                  </button>
                </div>
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.26s' }}>
              <CacheManager />
            </div>
          </div>
        )}

        {metrics && metrics.byIndustry && metrics.byIndustry.length > 0 && (
          <div className="animate-slide-up mb-4" style={{ animationDelay: '0.25s' }}>
            <IndustryBreakdown data={metrics.byIndustry} />
          </div>
        )}

        {metrics && metrics.byDiscoveryChannel && metrics.byDiscoveryChannel.length > 0 && (
          <div className="animate-slide-up mb-4" style={{ animationDelay: '0.3s' }}>
            <DiscoveryBreakdown data={metrics.byDiscoveryChannel} />
          </div>
        )}

        {/* Sección de Análisis por Vendedor */}
        {metrics && ((metrics.byVendorIndustry && metrics.byVendorIndustry.length > 0) || (metrics.byVendorPainPoint && metrics.byVendorPainPoint.length > 0) || (metrics.byVendorVolume && metrics.byVendorVolume.length > 0)) && (
          <div className="mb-4">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                Análisis por Vendedor
              </h2>
              <p className="text-white/60 text-sm mt-1">Métricas de conversión segmentadas por vendedor</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {metrics && metrics.byVendorIndustry && metrics.byVendorIndustry.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.32s' }}>
                  <VendorIndustryChart 
                    data={metrics.byVendorIndustry} 
                    vendors={metrics.byVendor.map(v => v.vendedor)}
                  />
                </div>
              )}

              {metrics && metrics.byVendorPainPoint && metrics.byVendorPainPoint.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.33s' }}>
                  <VendorPainPointChart 
                    data={metrics.byVendorPainPoint} 
                    vendors={metrics.byVendor.map(v => v.vendedor)}
                  />
                </div>
              )}

              {metrics && metrics.byVendorVolume && metrics.byVendorVolume.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.34s' }}>
                  <VendorVolumeChart 
                    data={metrics.byVendorVolume} 
                    vendors={metrics.byVendor.map(v => v.vendedor)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {metrics && metrics.byPainPoint && metrics.byPainPoint.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
              <PainPointChart data={metrics.byPainPoint} />
            </div>
          )}

          {metrics && metrics.byDiscoveryChannel && metrics.byDiscoveryChannel.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.36s' }}>
              <DiscoveryChannelGaps data={metrics.byDiscoveryChannel} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {metrics && metrics.byIntegrationNeeds && metrics.byIntegrationNeeds.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.37s' }}>
              <IntegrationNeedsChart data={metrics.byIntegrationNeeds} />
            </div>
          )}

          {metrics && metrics.byVolume && metrics.byVolume.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.38s' }}>
              <VolumeChart data={metrics.byVolume} />
            </div>
          )}
        </div>

        {metrics && metrics.bySolutionPart && metrics.bySolutionPart.length > 0 && (
          <div className="animate-slide-up mb-4" style={{ animationDelay: '0.39s' }}>
            <SolutionPartChart data={metrics.bySolutionPart} />
          </div>
        )}

        {metrics && metrics.byUsefulAddons && metrics.byUsefulAddons.length > 0 && (
          <div className="animate-slide-up mb-4" style={{ animationDelay: '0.4s' }}>
            <UsefulAddonsChart data={metrics.byUsefulAddons} />
          </div>
        )}

        {categorizedClients.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <p className="text-white/70 text-xs uppercase tracking-wider">Datos listos</p>
                <h3 className="text-lg font-bold text-white">Clientes categorizados ({categorizedClients.length})</h3>
              </div>
              <ClientList clients={categorizedClients} onClientClick={(client) => setSelectedClient(client)} />
            </div>
          </div>
        )}

        {selectedClient && (
          <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
        )}

        {showVendorRecommendation && (
          <VendorRecommendationModal onClose={() => setShowVendorRecommendation(false)} />
        )}

        <div className="mt-6 text-center text-white/40 text-xs">
          <p>Vambe Analytics Dashboard • Categorización automática con LLM</p>
        </div>
      </div>
    </div>
  );
}

export default App;

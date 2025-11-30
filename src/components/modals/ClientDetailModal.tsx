import { X } from 'lucide-react';
import { CategorizedClient } from '../../types';

interface ClientDetailModalProps {
  client: CategorizedClient;
  onClose: () => void;
}

const ClientDetailModal = ({ client, onClose }: ClientDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div>
            <p className="text-white/60 text-xs uppercase tracking-wider">Cliente</p>
            <h3 className="text-2xl font-bold text-white">{client.nombre}</h3>
            <p className="text-white/60 text-sm">{client.correo}</p>
            <p className="text-white/60 text-sm">Vendedor: {client.vendedor}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DetailCard label="Industria" value={client.categories.industry} />
          <DetailCard label="Nicho" value={client.categories.nicheIndustry} />
          <DetailCard label="Tamaño de empresa" value={client.categories.companySize} />
          <DetailCard label="Problema principal" value={client.categories.painPoint} />
          <DetailCard label="Canal de descubrimiento" value={client.categories.discoveryChannel} />
          <DetailCard
            label="Canal específico"
            value={client.categories.nicheDiscoveryChannel || 'N/A'}
          />
          <DetailCard label="Descripción del Problema" value={client.categories.painPointDescription || 'N/A'} />
          <DetailCard label="Señal de presupuesto" value={client.categories.budgetIndicator} />
          <DetailCard label="Volumen estimado" value={client.categories.estimatedVolume} />
          <DetailCard
            label="Necesidades de integración"
            value={client.categories.integrationNeeds || 'N/A'}
          />
          <DetailCard
            label="Parte de solución"
            value={client.categories.solutionPart || 'N/A'}
          />
          <DetailCard
            label="Addons vendidos"
            value={client.categories.usefulAddons && client.categories.usefulAddons.length > 0 
              ? client.categories.usefulAddons.join(', ') 
              : 'Ninguno'}
          />
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-lg text-white/70 text-sm max-h-40 overflow-y-auto">
          <p className="text-white font-semibold mb-2">Transcripción</p>
          <p className="whitespace-pre-wrap">{client.transcripcion}</p>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
    <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
    <p className="text-white font-semibold text-sm">{value}</p>
  </div>
);

export default ClientDetailModal;

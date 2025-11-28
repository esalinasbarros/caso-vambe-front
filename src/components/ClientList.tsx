import React, { useState, useMemo } from 'react';
import { CategorizedClient } from '../types';

interface ClientListProps {
    clients: CategorizedClient[];
    onClientClick?: (client: CategorizedClient, index: number) => void;
}

const getCategory = (client: CategorizedClient, category: keyof CategorizedClient['categories']) => {
    return client.categories?.[category] || 'N/A';
};

const ClientList: React.FC<ClientListProps> = ({ clients, onClientClick }) => {
    const [filter, setFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedVendor, setSelectedVendor] = useState('all');

    const categorizedClients = clients;

    const { industries, vendors } = useMemo(() => {
        const inds = new Set<string | number>();
        const vends = new Set<string>();
        
        categorizedClients.forEach(c => {
            const industry = getCategory(c, 'industry');
            const industryValue = Array.isArray(industry) ? industry.join(', ') : industry;
            inds.add(industryValue);
            vends.add(c.vendedor);
        });

        return {
            industries: Array.from(inds).sort(),
            vendors: Array.from(vends).sort()
        };
    }, [categorizedClients]);

    const filteredClients = useMemo(() => {
        return categorizedClients.filter(client => {
            const matchesSearch = 
                client.nombre.toLowerCase().includes(filter.toLowerCase()) ||
                client.correo.toLowerCase().includes(filter.toLowerCase()) ||
                client.vendedor.toLowerCase().includes(filter.toLowerCase());

            const matchesName = nameFilter === '' || client.nombre.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesEmail = emailFilter === '' || client.correo.toLowerCase().includes(emailFilter.toLowerCase());
            const matchesIndustry = selectedIndustry === 'all' || getCategory(client, 'industry') === selectedIndustry;
            const matchesVendor = selectedVendor === 'all' || client.vendedor === selectedVendor;

            return matchesSearch && matchesName && matchesEmail && matchesIndustry && matchesVendor;
        });
    }, [categorizedClients, filter, nameFilter, emailFilter, selectedIndustry, selectedVendor]);


    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl flex flex-col h-full">
            <div className="p-4 border-b border-white/10 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-fuchsia-400">
                        Clientes & Categorización ({filteredClients.length})
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                        <input 
                            type="text" 
                            placeholder="Filtrar por nombre"
                            className="bg-white/5 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500 min-w-[150px]"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Filtrar por correo"
                            className="bg-white/5 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500 min-w-[150px]"
                            value={emailFilter}
                            onChange={(e) => setEmailFilter(e.target.value)}
                        />
                        <select 
                            className="bg-white/5 border border-white/20 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                        >
                            <option value="all">Todas las Industrias</option>
                            {industries.map(i => <option key={i} value={i} className="text-black">{i}</option>)}
                        </select>
                        <select 
                            className="bg-white/5 border border-white/20 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                        >
                            <option value="all">Todos los Vendedores</option>
                            {vendors.map(v => <option key={v} value={v} className="text-black">{v}</option>)}
                        </select>
                        
                        

                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            className="bg-white/5 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-500 min-w-[150px]"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                    <thead className="bg-white/5">
                        <tr className="text-left">
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Cliente</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Industria</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Nicho</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Problema</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Descripción del Problema</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Vendedor</th>
                            <th className="px-4 py-3 font-semibold text-white/70 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredClients.map((client, index) => (
                            <tr 
                                key={index}
                                onClick={() => onClientClick?.(client, index)}
                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="px-4 py-2">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-white group-hover:text-sky-300 transition-colors">{client.nombre}</span>
                                        <span className="text-[10px] text-white/50">{client.correo}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-white/80">{getCategory(client, 'industry')}</td>
                                <td className="px-4 py-2 text-white/80">{getCategory(client, 'nicheIndustry')}</td>
                                <td className="px-4 py-2 text-white/80 truncate max-w-[150px]" title={getCategory(client, 'painPoint') as string}>
                                    {getCategory(client, 'painPoint')}
                                </td>
                                <td className="px-4 py-2 text-white/80 truncate max-w-[200px]" title={String(getCategory(client, 'painPointDescription'))}>
                                    {getCategory(client, 'painPointDescription')}
                                </td>
                                <td className="px-4 py-2">
                                    <span className="text-white/70">{client.vendedor}</span>
                                </td>
                                <td className="px-4 py-2">
                                    {client.closed === 1 ? (
                                        <span className="text-green-400 font-medium">Cerrado</span>
                                    ) : (
                                        <span className="text-white/40">○ Pendiente</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;

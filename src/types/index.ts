// Literalmente los mismos types del backend

export interface Client {
    nombre: string;
    correo: string;
    telefono: string;
    fecha: string;
    vendedor: string;
    closed: number;
    transcripcion: string;
}

export interface CategorizedClient extends Client {
    categories: ClientCategories;
}

export interface ClientCategories {
    industry: string;           // Industria general
    nicheIndustry: string;      // Nicho o subindustria
    companySize: string;           // Tamaño de la empresa (pequeña, mediana, grande)
    painPoint: string;             // Problema principal que enfrenta
    painPointDescription: string;   // Descripción del problema principal
    discoveryChannel: string;      // Cómo descubrieron Vambe
    nicheDiscoveryChannel: string; // Canal específico o detalle de descubrimiento
    urgency: string;               // Nivel de urgencia de la solución
    budgetIndicator: string;       // Indicador de presupuesto (implícito)
    estimatedVolume: number;       // Volumen estimado de clientes
    integrationNeeds: string;      // Necesidades de integración (ej. API, SDK, etc.)
    byVolume: string;
    solutionPart: string[];       // Parte de solución (ahora es un array)
    usefulAddons: string[];
}

export interface Metrics {
    overview: {
        totalClients: number;
        closedDeals: number;
        conversionRate: number;
        averageInteractionVolume: number;
    };
    byVendor: {
        vendedor: string;
        totalClients: number;
        closedDeals: number;
        conversionRate: number;
    }[];
    byIndustry: {
        industry: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byDiscoveryChannel: {
        channel: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byVendorIndustry: {
        vendedor: string;
        industry: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byVendorPainPoint: {
        vendedor: string;
        painPoint: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byVendorVolume: {
        vendedor: string;
        volumeRange: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byIntegrationNeeds: {
        integrationNeed: string;
        count: number;
    }[];
    byPainPoint: {
        painPoint: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byVolume: {
        volumeRange: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    bySolutionPart: {
        solutionPart: string;
        count: number;
        closedCount: number;
        conversionRate: number;
    }[];
    byUsefulAddons: {
        addon: string;
        count: number;
    }[];
    timeSeriesData: {
        month: string;
        totalClients: number;
        closedDeals: number;
        notClosedDeals: number;
        conversionRate: number;
    }[];
}

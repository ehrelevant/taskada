export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  iconUrl?: string | null;
}

export interface FeaturedService {
  serviceId: string;
  serviceName: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  initialCost: number;
  avgRating: number;
  reviewCount: number;
}

export interface SearchResult {
  serviceId: string;
  serviceName: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  initialCost: number;
  avgRating: number;
  reviewCount: number;
}

export interface ServiceDetails {
  id: string;
  initialCost: number;
  isEnabled: boolean;
  serviceTypeId: string;
  serviceTypeName: string;
  providerName: string;
  providerAvatar?: string | null;
  avgRating: number;
  reviewCount: number;
}

export interface CreateServicePayload {
  serviceTypeId: string;
  initialCost: number;
  isEnabled: boolean;
}

export interface ProviderService {
  id: string;
  initialCost: string;
  isEnabled: boolean;
  serviceType: {
    id: string;
    name: string;
    iconUrl?: string;
  };
}

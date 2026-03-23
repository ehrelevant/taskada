import { Droplets, Sparkles, Wrench } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type ServiceType = 'Car Mechanic' | 'Plumbing' | 'Cleaning';

export const SERVICE_TYPE_ICONS: Partial<Record<ServiceType, LucideIcon>> = {
  'Car Mechanic': Wrench,
  Plumbing: Droplets,
  Cleaning: Sparkles,
};

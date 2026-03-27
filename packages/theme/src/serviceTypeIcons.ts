import {
  Bug,
  Droplets,
  Flower2,
  Hammer,
  PaintRoller,
  Refrigerator,
  Sparkles,
  Truck,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type ServiceType =
  | 'Car Mechanic'
  | 'Plumbing'
  | 'Electrical'
  | 'Cleaning'
  | 'Carpentry'
  | 'Painting'
  | 'AC Repair'
  | 'Pest Control'
  | 'Appliance Repair'
  | 'Moving'
  | 'Gardening';

export const SERVICE_TYPE_ICONS: Partial<Record<ServiceType, LucideIcon>> = {
  'Car Mechanic': Wrench,
  Plumbing: Droplets,
  Electrical: Zap,
  Cleaning: Sparkles,
  Carpentry: Hammer,
  Painting: PaintRoller,
  'AC Repair': Wind,
  'Pest Control': Bug,
  'Appliance Repair': Refrigerator,
  Moving: Truck,
  Gardening: Flower2,
};

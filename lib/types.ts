export type HabitColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink';

export type HabitIconName =
  | 'Book'
  | 'BookOpen'
  | 'Dumbbell'
  | 'Droplet'
  | 'Brain'
  | 'Coffee'
  | 'Bed'
  | 'Heart'
  | 'Leaf'
  | 'Music'
  | 'Pencil'
  | 'Sun'
  | 'Moon'
  | 'Apple'
  | 'Bike'
  | 'Footprints'
  | 'Code'
  | 'Camera'
  | 'PenTool'
  | 'Sparkles'
  | 'Flame'
  | 'Mountain'
  | 'Wind'
  | 'CupSoda'
  | 'Salad'
  | 'PiggyBank'
  | 'Smile'
  | 'Phone'
  | 'Laptop'
  | 'Star';

export interface Habit {
  id: string;
  name: string;
  iconName: HabitIconName;
  color: HabitColor;
  createdAt: string;
}

export interface ColorOption {
  name: HabitColor;
  swatchClass: string;
  ringClass: string;
  bgSoftClass: string;
  textClass: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { name: 'red',    swatchClass: 'bg-red-500',    ringClass: 'ring-red-500',    bgSoftClass: 'bg-red-100',    textClass: 'text-red-700' },
  { name: 'orange', swatchClass: 'bg-orange-500', ringClass: 'ring-orange-500', bgSoftClass: 'bg-orange-100', textClass: 'text-orange-700' },
  { name: 'amber',  swatchClass: 'bg-amber-500',  ringClass: 'ring-amber-500',  bgSoftClass: 'bg-amber-100',  textClass: 'text-amber-700' },
  { name: 'green',  swatchClass: 'bg-green-500',  ringClass: 'ring-green-500',  bgSoftClass: 'bg-green-100',  textClass: 'text-green-700' },
  { name: 'teal',   swatchClass: 'bg-teal-500',   ringClass: 'ring-teal-500',   bgSoftClass: 'bg-teal-100',   textClass: 'text-teal-700' },
  { name: 'blue',   swatchClass: 'bg-blue-500',   ringClass: 'ring-blue-500',   bgSoftClass: 'bg-blue-100',   textClass: 'text-blue-700' },
  { name: 'purple', swatchClass: 'bg-purple-500', ringClass: 'ring-purple-500', bgSoftClass: 'bg-purple-100', textClass: 'text-purple-700' },
  { name: 'pink',   swatchClass: 'bg-pink-500',   ringClass: 'ring-pink-500',   bgSoftClass: 'bg-pink-100',   textClass: 'text-pink-700' },
];

export const ICON_OPTIONS: HabitIconName[] = [
  'Book', 'BookOpen', 'Dumbbell', 'Droplet', 'Brain', 'Coffee',
  'Bed', 'Heart', 'Leaf', 'Music', 'Pencil', 'Sun',
  'Moon', 'Apple', 'Bike', 'Footprints', 'Code', 'Camera',
  'PenTool', 'Sparkles', 'Flame', 'Mountain', 'Wind', 'CupSoda',
  'Salad', 'PiggyBank', 'Smile', 'Phone', 'Laptop', 'Star',
];

export const NAME_MAX_LENGTH = 40;

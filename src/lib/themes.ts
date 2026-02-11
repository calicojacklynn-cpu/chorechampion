
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210, 15%, 92%), hsl(210, 20%, 96%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(220, 50%, 10%), hsl(210, 90%, 30%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(20, 20%, 12%), hsl(30, 90%, 40%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 25%, 10%), hsl(100, 80%, 30%))',
  },
];

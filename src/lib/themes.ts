
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(195, 78%, 55%), hsl(220, 80%, 65%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(25, 95%, 70%), hsl(350, 90%, 75%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 40%, 45%), hsl(90, 50%, 55%))',
  },
  {
    name: 'Amethyst',
    className: 'theme-amethyst',
    gradient: 'linear-gradient(to right, hsl(270, 70%, 70%), hsl(300, 70%, 80%))',
  },
  {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(45, 100%, 65%), hsl(20, 100%, 65%))',
  },
  {
    name: 'Ocean',
    className: 'theme-ocean',
    gradient: 'linear-gradient(to right, hsl(210, 50%, 20%), hsl(190, 60%, 50%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 70%, 65%), hsl(170, 60%, 70%))',
  },
  {
    name: 'Coral',
    className: 'theme-coral',
    gradient: 'linear-gradient(to right, hsl(16, 100%, 65%), hsl(0, 100%, 70%))',
  },
  {
    name: 'Ruby',
    className: 'theme-ruby',
    gradient: 'linear-gradient(to right, hsl(350, 80%, 55%), hsl(10, 85%, 60%))',
  },
  {
    name: 'Emerald',
    className: 'theme-emerald',
    gradient: 'linear-gradient(to right, hsl(145, 63%, 42%), hsl(165, 70%, 50%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(210, 20%, 45%), hsl(220, 25%, 65%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 80%, 80%), hsl(10, 80%, 85%))',
  },
];


export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(195, 78%, 78%), hsl(48, 90%, 60%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(25, 95%, 70%), hsl(320, 80%, 70%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 40%, 60%), hsl(90, 40%, 60%))',
  },
  {
    name: 'Amethyst',
    className: 'theme-amethyst',
    gradient: 'linear-gradient(to right, hsl(270, 70%, 75%), hsl(290, 70%, 85%))',
  },
  {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(45, 100%, 70%), hsl(20, 100%, 70%))',
  },
  {
    name: 'Midnight',
    className: 'theme-midnight',
    gradient: 'linear-gradient(to right, hsl(240, 50%, 25%), hsl(260, 60%, 45%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 70%, 70%), hsl(170, 70%, 80%))',
  },
  {
    name: 'Coral',
    className: 'theme-coral',
    gradient: 'linear-gradient(to right, hsl(16, 100%, 70%), hsl(0, 100%, 75%))',
  },
  {
    name: 'Ruby',
    className: 'theme-ruby',
    gradient: 'linear-gradient(to right, hsl(350, 80%, 60%), hsl(340, 90%, 70%))',
  },
  {
    name: 'Emerald',
    className: 'theme-emerald',
    gradient: 'linear-gradient(to right, hsl(145, 63%, 49%), hsl(160, 80%, 55%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(210, 20%, 50%), hsl(220, 20%, 65%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 80%, 85%), hsl(350, 80%, 90%))',
  },
];

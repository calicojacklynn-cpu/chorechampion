
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(195, 78%, 65%), hsl(220, 80%, 75%))',
  },
  {
    name: 'Sunset',
    className: 'theme-sunset',
    gradient: 'linear-gradient(to right, hsl(25, 95%, 70%), hsl(350, 90%, 70%))',
  },
  {
    name: 'Forest',
    className: 'theme-forest',
    gradient: 'linear-gradient(to right, hsl(120, 40%, 50%), hsl(80, 50%, 60%))',
  },
  {
    name: 'Amethyst',
    className: 'theme-amethyst',
    gradient: 'linear-gradient(to right, hsl(270, 70%, 75%), hsl(300, 70%, 80%))',
  },
  {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(45, 100%, 70%), hsl(15, 100%, 65%))',
  },
  {
    name: 'Midnight',
    className: 'theme-midnight',
    gradient: 'linear-gradient(to right, hsl(240, 40%, 20%), hsl(280, 50%, 30%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 70%, 70%), hsl(180, 60%, 75%))',
  },
  {
    name: 'Coral',
    className: 'theme-coral',
    gradient: 'linear-gradient(to right, hsl(16, 100%, 70%), hsl(350, 100%, 75%))',
  },
  {
    name: 'Ruby',
    className: 'theme-ruby',
    gradient: 'linear-gradient(to right, hsl(350, 80%, 60%), hsl(0, 85%, 65%))',
  },
  {
    name: 'Emerald',
    className: 'theme-emerald',
    gradient: 'linear-gradient(to right, hsl(145, 63%, 45%), hsl(165, 70%, 55%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(210, 20%, 45%), hsl(220, 25%, 65%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(340, 80%, 85%), hsl(0, 80%, 90%))',
  },
];

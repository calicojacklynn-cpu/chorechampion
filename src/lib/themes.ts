
export type Theme = {
  name: string;
  className: string;
  gradient: string;
};

export const themes: Theme[] = [
  {
    name: 'Default',
    className: 'theme-default',
    gradient: 'linear-gradient(to right, hsl(210, 20%, 98%), hsl(210, 15%, 92%))',
  },
  {
    name: 'Slate',
    className: 'theme-slate',
    gradient: 'linear-gradient(to right, hsl(220, 15%, 15%), hsl(220, 10%, 30%))',
  },
  {
    name: 'Sky',
    className: 'theme-sky',
    gradient: 'linear-gradient(to right, hsl(200, 30%, 95%), hsl(190, 40%, 85%))',
  },
  {
    name: 'Rose',
    className: 'theme-rose',
    gradient: 'linear-gradient(to right, hsl(350, 40%, 95%), hsl(340, 30%, 85%))',
  },
  {
    name: 'Mint',
    className: 'theme-mint',
    gradient: 'linear-gradient(to right, hsl(150, 30%, 95%), hsl(160, 40%, 85%))',
  },
   {
    name: 'Sunrise',
    className: 'theme-sunrise',
    gradient: 'linear-gradient(to right, hsl(40, 50%, 95%), hsl(30, 60%, 85%))',
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
  {
    name: 'Royal',
    className: 'theme-royal',
    gradient: 'linear-gradient(to right, hsl(260, 30%, 15%), hsl(250, 50%, 40%))',
  },
  {
    name: 'Candy',
    className: 'theme-candy',
    gradient: 'linear-gradient(to right, hsl(330, 90%, 60%), hsl(20, 90%, 60%))',
  },
    {
    name: 'Matrix',
    className: 'theme-matrix',
    gradient: 'linear-gradient(to right, hsl(120, 100%, 5%), hsl(120, 50%, 20%))',
  },
];

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.questkind.app',
  appName: 'QuestKind',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;

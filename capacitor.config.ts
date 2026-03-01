import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.surfproject.app',
  appName: 'Surf Forecast',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

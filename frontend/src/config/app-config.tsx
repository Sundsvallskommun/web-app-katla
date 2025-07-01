export interface AppConfig {
  applicationName: string;
}

export const appConfig: AppConfig = {
  applicationName: process.env.NEXT_PUBLIC_APP_NAME || 'appen',
};

export interface AppConfig {
  applicationName: string;
}

export const appConfig: AppConfig = {
  applicationName: process.env.NEXT_PUBLIC_APPLICATION_NAME || 'appen',
};

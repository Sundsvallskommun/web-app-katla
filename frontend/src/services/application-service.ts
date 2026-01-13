export const getApplicationEnvironment = () => (process.env.NEXT_PUBLIC_ENVIRONMENT === 'TEST' ? 'TEST' : null);

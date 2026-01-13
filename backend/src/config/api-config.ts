//Subscribed APIS as lowercased
export const APIS = [
  {
    name: 'simulatorserver',
    version: '2.0',
  },
  {
    name: 'citizen',
    version: '3.0',
  },
  {
    name: 'case-data',
    version: '11.5',
  },
  {
    name: 'employee',
    version: '2.0',
  },
  {
    name: 'messaging',
    version: '7.0',
  },
] as const;

export function apiServiceName(name: string): string {
  const api = APIS.find(a => a.name === name);
  return api ? `${api.name}/${api.version}` : name;
}
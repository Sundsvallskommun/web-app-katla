export enum ErrandStatus {
  ArendeInkommit = 'Ärende inskickat',
  UnderGranskning = 'Under granskning',
  VantarPaKomplettering = 'Väntar på komplettering',
  InterntAterkoppling = 'Internt återkoppling',
  UnderUtredning = 'Under utredning',
  UnderBeslut = 'Under beslut',
  Beslutad = 'Beslutad',
  BeslutVerkstallt = 'Beslut verkställt',
  BeslutOverklagat = 'Beslut överklagat',
  ArendeAvslutat = 'Ärende avslutat',
  Tilldelat = 'Tilldelat',
  Utkast = 'Utkast',
  HanterasIAnnatSystem = 'Hanteras i annat system',
  ArendetAvvisas = 'Ärendet avvisas',
  Parkerad = 'Parkerad',
}

export const STATUS_LABEL_SV: Record<ErrandStatus, string> = {
  [ErrandStatus.ArendeInkommit]: 'Ärende inskickat',
  [ErrandStatus.UnderGranskning]: 'Under granskning',
  [ErrandStatus.VantarPaKomplettering]: 'Väntar på komplettering',
  [ErrandStatus.InterntAterkoppling]: 'Internt återkoppling',
  [ErrandStatus.UnderUtredning]: 'Under utredning',
  [ErrandStatus.UnderBeslut]: 'Under beslut',
  [ErrandStatus.Beslutad]: 'Beslutad',
  [ErrandStatus.BeslutVerkstallt]: 'Beslut verkställt',
  [ErrandStatus.BeslutOverklagat]: 'Beslut överklagat',
  [ErrandStatus.ArendeAvslutat]: 'Ärende avslutat',
  [ErrandStatus.Tilldelat]: 'Tilldelat',
  [ErrandStatus.Utkast]: 'Utkast',
  [ErrandStatus.HanterasIAnnatSystem]: 'Hanteras i annat system',
  [ErrandStatus.ArendetAvvisas]: 'Ärendet avvisas',
  [ErrandStatus.Parkerad]: 'Parkerad',
};

export const STATUS_ALIASES: Record<string, ErrandStatus> = {
  'Ärende inkommit': ErrandStatus.ArendeInkommit,
  'Ärende inskickat': ErrandStatus.ArendeInkommit,
  'Under granskning': ErrandStatus.UnderGranskning,
  'Väntar på komplettering': ErrandStatus.VantarPaKomplettering,
  'Internt återkoppling': ErrandStatus.InterntAterkoppling,
  'Under utredning': ErrandStatus.UnderUtredning,
  'Under beslut': ErrandStatus.UnderBeslut,
  Beslutad: ErrandStatus.Beslutad,
  'Beslut verkställt': ErrandStatus.BeslutVerkstallt,
  'Beslut överklagat': ErrandStatus.BeslutOverklagat,
  'Ärende avslutat': ErrandStatus.ArendeAvslutat,
  Tilldelat: ErrandStatus.Tilldelat,
  Utkast: ErrandStatus.Utkast,
  'Hanteras i annat system': ErrandStatus.HanterasIAnnatSystem,
  'Ärendet avvisas': ErrandStatus.ArendetAvvisas,
  Parkerad: ErrandStatus.Parkerad,
};

export function normalizeStatus(s?: string): ErrandStatus | undefined {
  if (!s) return;
  const t = s.normalize('NFC').trim();
  return STATUS_ALIASES[t] as ErrandStatus | undefined;
}

export interface ApiErrandStatus {
  statusType?: string;
  description?: string;
  created?: string;
}

export enum ErrandStatusType {
  ArendeInkommit = 'Ärende inkommit',
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

export const STATUS_LABEL_SV: Record<ErrandStatusType, string> = {
  [ErrandStatusType.ArendeInkommit]: 'Ärende inkommit',
  [ErrandStatusType.UnderGranskning]: 'Under granskning',
  [ErrandStatusType.VantarPaKomplettering]: 'Väntar på komplettering',
  [ErrandStatusType.InterntAterkoppling]: 'Internt återkoppling',
  [ErrandStatusType.UnderUtredning]: 'Under utredning',
  [ErrandStatusType.UnderBeslut]: 'Under beslut',
  [ErrandStatusType.Beslutad]: 'Beslutad',
  [ErrandStatusType.BeslutVerkstallt]: 'Beslut verkställt',
  [ErrandStatusType.BeslutOverklagat]: 'Beslut överklagat',
  [ErrandStatusType.ArendeAvslutat]: 'Ärende avslutat',
  [ErrandStatusType.Tilldelat]: 'Tilldelat',
  [ErrandStatusType.Utkast]: 'Utkast',
  [ErrandStatusType.HanterasIAnnatSystem]: 'Hanteras i annat system',
  [ErrandStatusType.ArendetAvvisas]: 'Ärendet avvisas',
  [ErrandStatusType.Parkerad]: 'Parkerad',
};

export const STATUS_ALIASES: Partial<Record<ErrandStatusType, string>> = {
  [ErrandStatusType.ArendeInkommit]: 'Ärende inskickat',
};

export function displayStatus(s?: ErrandStatus): ErrandStatus {
  console.log('Displaying status:', s);
  if (!s || !s.statusType) {
    return { statusType: 'Ärende inskickat' as ErrandStatusType };
  }
  if (s?.statusType && STATUS_ALIASES[s.statusType]) {
    return { statusType: STATUS_ALIASES[s.statusType] as ErrandStatusType };
  }
  return { statusType: s.statusType };
}

export function normalizeStatus(status: ErrandStatus): ErrandStatus {
  console.log('Normalizing status:', status);
  if (!status.statusType) {
    return { ...status, statusType: ErrandStatusType.ArendeInkommit };
  }
  return { ...status, statusType: (STATUS_LABEL_SV[status.statusType] as ErrandStatusType) || status.statusType };
}

export interface ErrandStatus {
  statusType?: ErrandStatusType;
  description?: string;
  created?: string;
}

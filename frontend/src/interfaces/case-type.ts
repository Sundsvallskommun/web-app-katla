export enum FTCaseType {
  PARATRANSIT = 'PARATRANSIT',
  PARATRANSIT_CHANGE = 'PARATRANSIT_CHANGE',
  PARATRANSIT_RENEWAL = 'PARATRANSIT_RENEWAL',
  PARATRANSIT_NATIONAL = 'PARATRANSIT_NATIONAL',
  PARATRANSIT_NATIONAL_RENEWAL = 'PARATRANSIT_NATIONAL_RENEWAL',
  PARATRANSIT_RIAK = 'PARATRANSIT_RIAK',
  PARATRANSIT_BUS_CARD = 'PARATRANSIT_BUS_CARD',
}

export enum FTCaseLabel {
  PARATRANSIT = 'Ny anmälan om färdtjänst',
  PARATRANSIT_CHANGE = 'Anmälan om förändring av insatser',
  PARATRANSIT_RENEWAL = 'Anmälan om fortsatt färdtjänst',
  PARATRANSIT_NATIONAL = 'Ny anmälan om riksfärdtjänst',
  PARATRANSIT_NATIONAL_RENEWAL = 'Ny anmälan om fortsatt riksfärdtjänst',
  PARATRANSIT_RIAK = 'Ny anmälan om RIAK',
  PARATRANSIT_BUS_CARD = 'Ny anmälan om busskort',
}

export const getCaseLabels = (): Record<FTCaseType, string> => ({
  [FTCaseType.PARATRANSIT]: FTCaseLabel.PARATRANSIT,
  [FTCaseType.PARATRANSIT_CHANGE]: FTCaseLabel.PARATRANSIT_CHANGE,
  [FTCaseType.PARATRANSIT_RENEWAL]: FTCaseLabel.PARATRANSIT_RENEWAL,
  [FTCaseType.PARATRANSIT_NATIONAL]: FTCaseLabel.PARATRANSIT_NATIONAL,
  [FTCaseType.PARATRANSIT_NATIONAL_RENEWAL]: FTCaseLabel.PARATRANSIT_NATIONAL_RENEWAL,
  [FTCaseType.PARATRANSIT_RIAK]: FTCaseLabel.PARATRANSIT_RIAK,
  [FTCaseType.PARATRANSIT_BUS_CARD]: FTCaseLabel.PARATRANSIT_BUS_CARD,
});

export const getCaseShortLabels = (): Record<FTCaseType, string> => ({
  [FTCaseType.PARATRANSIT]: 'Ny färdtjänst',
  [FTCaseType.PARATRANSIT_CHANGE]: 'Ändring av färdtjänst',
  [FTCaseType.PARATRANSIT_RENEWAL]: 'Förnyelse av färdtjänst',
  [FTCaseType.PARATRANSIT_NATIONAL]: 'Ny riksfärdtjänst',
  [FTCaseType.PARATRANSIT_NATIONAL_RENEWAL]: 'Förnyelse av riksfärdtjänst',
  [FTCaseType.PARATRANSIT_RIAK]: 'Ny RIAK',
  [FTCaseType.PARATRANSIT_BUS_CARD]: 'Nytt busskort',
});
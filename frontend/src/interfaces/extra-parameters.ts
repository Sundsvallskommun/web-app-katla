export type GenericExtraParameters = { [key: string]: string };

export interface ExtraParameter {
  key: string;
  displayName?: string;
  values?: string[];
}

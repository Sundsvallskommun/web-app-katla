export interface Notification {
  id?: string;
  municipalityId?: string;
  namespace?: string;
  created: string;
  modified?: string;
  ownerFullName?: string;
  ownerId: string;
  createdBy?: string;
  createdByFullName?: string;
  type: string;
  description: string;
  content?: string;
  expires?: string;
  acknowledged?: boolean;
  globalAcknowledged?: boolean;
  errandId: number;
  errandNumber?: string;
}

import { Asset } from '@interfaces/asset';
import { emptyErrandList, ErrandsData, IErrand } from '@interfaces/errand';
import { UiPhase } from '@interfaces/errand-phase';
import { ErrandStatus, getStatusKeys, ongoingStatuses } from '@interfaces/errand-status';
import { MessageNode } from '@interfaces/message';
import { Notification as CaseDataNotification } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { Admin, emptyUser } from '@services/user-service';
import { createContext } from 'react';

export interface AppContextInterface {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  user: User;
  setUser: (user: User) => void;

  avatar: string;
  setAvatar: (avatar: string) => void;

  errand: IErrand;
  setErrand: (errand: IErrand) => void;

  conversation: MessageNode[];
  setConversation: (conversation: MessageNode[]) => void;

  assets: Asset[];
  setAssets: (assets: Asset[]) => void;

  municipalityId: string;
  setMunicipalityId: (municipalityId: string) => void;

  selectedErrandStatuses: ErrandStatus[];
  setSelectedErrandStatuses: (selectedErrandStatuses: ErrandStatus[]) => void;

  notifications: CaseDataNotification[];
  setNotifications: (notifications: CaseDataNotification[]) => void;

  errands: ErrandsData;
  setErrands: (errands: ErrandsData) => void;

  ongoingErrands: ErrandsData;
  setOngoingErrands: (errands: ErrandsData) => void;

  suspendedErrands: ErrandsData;
  setSuspendedErrands: (errands: ErrandsData) => void;

  assignedErrands: ErrandsData;
  setAssignedErrands: (errands: ErrandsData) => void;

  draftErrands: ErrandsData;
  setDraftErrands: (errands: ErrandsData) => void;

  closedErrands: ErrandsData;
  setClosedErrands: (errands: ErrandsData) => void;

  sidebarLabel: string;
  setSidebarLabel: (sidebarLabel: string) => void;

  administrators: Admin[];
  setAdministrators: (admins: Admin[]) => void;

  uiPhase: UiPhase;
  setUiPhase: (phase: UiPhase) => void;
}

export const AppContext = createContext<AppContextInterface>({
  isLoading: false,
  setIsLoading: () => {},

  user: emptyUser,
  setUser: () => {},

  avatar: '',
  setAvatar: () => {},

  errand: {} as IErrand,
  setErrand: () => {},

  conversation: [],
  setConversation: () => {},

  assets: [],
  setAssets: () => {},

  municipalityId: '',
  setMunicipalityId: () => {},

  selectedErrandStatuses: getStatusKeys(ongoingStatuses) as ErrandStatus[],
  setSelectedErrandStatuses: () => {},

  notifications: [],
  setNotifications: () => {},

  errands: emptyErrandList,
  setErrands: () => {},

  ongoingErrands: emptyErrandList,
  setOngoingErrands: () => {},

  suspendedErrands: emptyErrandList,
  setSuspendedErrands: () => {},

  assignedErrands: emptyErrandList,
  setAssignedErrands: () => {},

  draftErrands: emptyErrandList,
  setDraftErrands: () => {},

  closedErrands: emptyErrandList,
  setClosedErrands: () => {},

  sidebarLabel: '',
  setSidebarLabel: () => {},

  administrators: [],
  setAdministrators: () => {},

  uiPhase: UiPhase.inkommet,
  setUiPhase: () => {},
});

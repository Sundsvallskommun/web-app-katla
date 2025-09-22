import { Asset } from '@interfaces/asset';
import { ErrandsData, IErrand } from '@interfaces/errand';
import { UiPhase } from '@interfaces/errand-phase';
import { ErrandStatus } from '@interfaces/errand-status';
import { MessageNode } from '@interfaces/message';
import { Notification as CaseDataNotification } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { emptyErrandList } from '@services/casedata-errand-service';
import { Admin, emptyUser } from '@services/user-service';
import { createContext } from 'react';

export interface AppContextInterface {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  subPage: string;
  setSubPage: (subPage: string) => void;

  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;

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

  newErrands: ErrandsData;
  setNewErrands: (errands: ErrandsData) => void;

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

  subPage: '',
  setSubPage: () => {},

  isLoggedIn: false,
  setIsLoggedIn: () => {},

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

  selectedErrandStatuses: [ErrandStatus.ArendeInkommit],
  setSelectedErrandStatuses: () => {},

  notifications: [],
  setNotifications: () => {},

  errands: emptyErrandList,
  setErrands: () => {},

  newErrands: emptyErrandList,
  setNewErrands: () => {},

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

import { Asset } from '@interfaces/asset';
import { IErrand } from '@interfaces/errand';
import { UiPhase } from '@interfaces/errand-phase';
import { Notification as CaseDataNotification } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { MessageNode } from '@services/casedata-message-service';
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

  messages: MessageNode[];
  setMessages: (messages: MessageNode[]) => void;

  messageTree: MessageNode[];
  setMessageTree: (messages: MessageNode[]) => void;

  assets: Asset[];
  setAssets: (assets: Asset[]) => void;

  municipalityId: string;
  setMunicipalityId: (municipalityId: string) => void;

  selectedErrandStatuses: string[];
  setSelectedErrandStatuses: (selectedErrandStatuses: string[]) => void;

  notifications: CaseDataNotification[];
  setNotifications: (notifications: CaseDataNotification[]) => void;

  // errands: ErrandsData;
  // setErrands: (errands: ErrandsData) => void;

  // newErrands: ErrandsData;
  // setNewErrands: (errands: ErrandsData) => void;

  // ongoingErrands: ErrandsData;
  // setOngoingErrands: (errands: ErrandsData) => void;

  // suspendedErrands: ErrandsData;
  // setSuspendedErrands: (errands: ErrandsData) => void;

  // assignedErrands: ErrandsData;
  // setAssignedErrands: (errands: ErrandsData) => void;

  // closedErrands: ErrandsData;
  // setClosedErrands: (errands: ErrandsData) => void;

  sidebarLabel: string;
  setSidebarLabel: (sidebarLabel: string) => void;

  administrators: Admin[];
  setAdministrators: (admins: Admin[]) => void;

  isCookieConsentOpen: boolean;
  setIsCookieConsentOpen: (isOpen: boolean) => void;

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

  messages: [],
  setMessages: () => {},

  messageTree: [],
  setMessageTree: () => {},

  assets: [],
  setAssets: () => {},

  municipalityId: '',
  setMunicipalityId: () => {},

  selectedErrandStatuses: ['ArendeInkommit'],
  setSelectedErrandStatuses: () => {},

  notifications: [],
  setNotifications: () => {},

  // errands: emptyErrandList,
  // setErrands: () => {},

  // newErrands: emptyErrandList,
  // setNewErrands: () => {},

  // ongoingErrands: emptyErrandList,
  // setOngoingErrands: () => {},

  // suspendedErrands: emptyErrandList,
  // setSuspendedErrands: () => {},

  // assignedErrands: emptyErrandList,
  // setAssignedErrands: () => {},

  // closedErrands: emptyErrandList,
  // setClosedErrands: () => {},

  sidebarLabel: '',
  setSidebarLabel: () => {},

  administrators: [],
  setAdministrators: () => {},

  isCookieConsentOpen: true,
  setIsCookieConsentOpen: () => {},

  uiPhase: UiPhase.inkommet,
  setUiPhase: () => {},
});

import { Asset } from '@interfaces/asset';
import { IErrand } from '@interfaces/errand';
import { UiPhase } from '@interfaces/errand-phase';
import { Notification as CaseDataNotification } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { MessageNode } from '@services/casedata-message-service';
import { Admin, emptyUser } from '@services/user-service';
import { ReactNode, useState } from 'react';
import { AppContext } from './app-context-interface';

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subPage, setSubPage] = useState('');
  const [user, setUser] = useState<User>(emptyUser);
  const [avatar, setAvatar] = useState<string>('');
  // const [errands, setErrands] = useState<ErrandsData>(emptyErrandList);
  // const [newErrands, setNewErrands] = useState<ErrandsData>(emptyErrandList);
  // const [ongoingErrands, setOngoingErrands] = useState<ErrandsData>(emptyErrandList);
  // const [suspendedErrands, setSuspendedErrands] = useState<ErrandsData>(emptyErrandList);
  // const [assignedErrands, setAssignedErrands] = useState<ErrandsData>(emptyErrandList);
  // const [closedErrands, setClosedErrands] = useState<ErrandsData>(emptyErrandList);
  const [errand, setErrand] = useState<IErrand>({} as IErrand);
  const [messages, setMessages] = useState<MessageNode[]>([]);
  const [messageTree, setMessageTree] = useState<MessageNode[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedErrandStatuses, setSelectedErrandStatuses] = useState<string[]>(['ArendeInkommit']);
  const [municipalityId, setMunicipalityId] = useState<string>('');
  const [sidebarLabel, setSidebarLabel] = useState<string>('');
  const [administrators, setAdministrators] = useState<Admin[]>([]);
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);
  const [notifications, setNotifications] = useState<CaseDataNotification[]>([]);
  const [uiPhase, setUiPhase] = useState<UiPhase>(UiPhase.inkommet);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),

        subPage,
        setSubPage: (subPage: string) => setSubPage(subPage),

        isLoggedIn,
        setIsLoggedIn: (isLoggedIn: boolean) => setIsLoggedIn(isLoggedIn),

        user,
        setUser: (user: User) => setUser(user),

        avatar,
        setAvatar: (avatar: string) => setAvatar(avatar),

        errand,
        setErrand: (errand: IErrand) => setErrand(errand),

        messages,
        setMessages: (messages: MessageNode[]) => setMessages(messages),

        messageTree,
        setMessageTree: (messages: MessageNode[]) => setMessageTree(messages),

        assets,
        setAssets: (assets: Asset[]) => setAssets(assets),

        selectedErrandStatuses,
        setSelectedErrandStatuses: (selectedErrandStatuses: string[]) =>
          setSelectedErrandStatuses(selectedErrandStatuses),

        municipalityId,
        setMunicipalityId: (municipalityId: string) => setMunicipalityId(municipalityId),

        // errands,
        // setErrands: (errands: ErrandsData) => setErrands(errands),

        // newErrands,
        // setNewErrands: (errands: ErrandsData) => setNewErrands(errands),

        // ongoingErrands,
        // setOngoingErrands: (errands: ErrandsData) => setOngoingErrands(errands),

        // suspendedErrands,
        // setSuspendedErrands: (errands: ErrandsData) => setSuspendedErrands(errands),

        // assignedErrands,
        // setAssignedErrands: (errands: ErrandsData) => setAssignedErrands(errands),

        // closedErrands,
        // setClosedErrands: (errands: ErrandsData) => setClosedErrands(errands),

        sidebarLabel,
        setSidebarLabel: (sidebarLabel: string) => setSidebarLabel(sidebarLabel),

        notifications,
        setNotifications: (notifications: CaseDataNotification[]) => setNotifications(notifications),

        administrators,
        setAdministrators: (admins: Admin[]) => {
          setAdministrators(admins);
        },

        isCookieConsentOpen,
        setIsCookieConsentOpen: (isOpen: boolean) => setIsCookieConsentOpen(isOpen),

        uiPhase,
        setUiPhase: (phase: UiPhase) => setUiPhase(phase),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

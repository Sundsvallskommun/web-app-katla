import { Asset } from '@interfaces/asset';
import { emptyErrandList, ErrandsData, IErrand } from '@interfaces/errand';
import { UiPhase } from '@interfaces/errand-phase';
import { ErrandStatus, getStatusKeys, ongoingStatuses } from '@interfaces/errand-status';
import { MessageNode } from '@interfaces/message';
import { Notification as CaseDataNotification } from '@interfaces/notification';
import { User } from '@interfaces/user';
import { Admin, emptyUser } from '@services/user-service';
import { ReactNode, useState } from 'react';
import { AppContext } from './app-context-interface';

export function AppWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>(emptyUser);
  const [avatar, setAvatar] = useState<string>('');
  const [errands, setErrands] = useState<ErrandsData>(emptyErrandList);
  const [ongoingErrands, setOngoingErrands] = useState<ErrandsData>(emptyErrandList);
  const [suspendedErrands, setSuspendedErrands] = useState<ErrandsData>(emptyErrandList);
  const [assignedErrands, setAssignedErrands] = useState<ErrandsData>(emptyErrandList);
  const [draftErrands, setDraftErrands] = useState<ErrandsData>(emptyErrandList);
  const [closedErrands, setClosedErrands] = useState<ErrandsData>(emptyErrandList);
  const [errand, setErrand] = useState<IErrand>({} as IErrand);
  const [conversation, setConversation] = useState<MessageNode[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedErrandStatuses, setSelectedErrandStatuses] = useState<ErrandStatus[]>(
    getStatusKeys(ongoingStatuses) as ErrandStatus[]
  );
  const [municipalityId, setMunicipalityId] = useState<string>('');
  const [sidebarLabel, setSidebarLabel] = useState<string>('');
  const [administrators, setAdministrators] = useState<Admin[]>([]);
  const [notifications, setNotifications] = useState<CaseDataNotification[]>([]);
  const [uiPhase, setUiPhase] = useState<UiPhase>(UiPhase.inkommet);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),

        user,
        setUser: (user: User) => setUser(user),

        avatar,
        setAvatar: (avatar: string) => setAvatar(avatar),

        errand,
        setErrand: (errand: IErrand) => setErrand(errand),

        conversation,
        setConversation: (conversation: MessageNode[]) => setConversation(conversation),

        assets,
        setAssets: (assets: Asset[]) => setAssets(assets),

        selectedErrandStatuses,
        setSelectedErrandStatuses: (selectedErrandStatuses: ErrandStatus[]) =>
          setSelectedErrandStatuses(selectedErrandStatuses),

        municipalityId,
        setMunicipalityId: (municipalityId: string) => setMunicipalityId(municipalityId),

        errands,
        setErrands: (errands: ErrandsData) => setErrands(errands),

        ongoingErrands,
        setOngoingErrands: (errands: ErrandsData) => setOngoingErrands(errands),

        suspendedErrands,
        setSuspendedErrands: (errands: ErrandsData) => setSuspendedErrands(errands),

        assignedErrands,
        setAssignedErrands: (errands: ErrandsData) => setAssignedErrands(errands),

        draftErrands,
        setDraftErrands: (errands: ErrandsData) => setDraftErrands(errands),

        closedErrands,
        setClosedErrands: (errands: ErrandsData) => setClosedErrands(errands),

        sidebarLabel,
        setSidebarLabel: (sidebarLabel: string) => setSidebarLabel(sidebarLabel),

        notifications,
        setNotifications: (notifications: CaseDataNotification[]) => setNotifications(notifications),

        administrators,
        setAdministrators: (admins: Admin[]) => {
          setAdministrators(admins);
        },

        uiPhase,
        setUiPhase: (phase: UiPhase) => setUiPhase(phase),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

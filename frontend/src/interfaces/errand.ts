import { Data } from '@services/api-service';
import { Attachment } from './attachment';
import { Channels } from './channels';
import { Decision } from './decision';
import { ErrandPhase } from './errand-phase';
import { ApiErrandStatus } from './errand-status';
import { ErrandNote } from './errandNote';
import { FacilityDTO } from './facilities';
import { All, Priority } from './priority';
import { CasedataOwnerOrContact, CreateStakeholderDto, Stakeholder } from './stakeholder';
import { ExtraParameter } from './extra-parameters';
import { Notification } from './notification';

export interface ApiErrand {
  id: number;
  errandNumber: string;
  externalCaseId: string;
  caseType: string;
  priority: Priority;
  phase: ErrandPhase;
  channel: string;
  status: ApiErrandStatus;
  statuses: ApiErrandStatus[];
  description: string;
  caseTitleAddition: string;
  startDate: string;
  endDate: string;
  diaryNumber: string;
  municipalityId: string;
  applicationReceived: string;
  extraParameters: ExtraParameter[];
  decisions: Decision[];
  created: string;
  updated: string;
  stakeholders: Stakeholder[];
  facilities: FacilityDTO[];
  notes: ErrandNote[];
  messageIds: { messageId: string; adAccount: string }[];
  suspension?: {
    suspendedFrom?: string;
    suspendedTo?: string;
  };
  notifications?: Notification[];
  relatesTo?: RelatedErrand[];
}

export interface ApiPagingData {
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PagedApiErrandsResponse extends ApiPagingData {
  content: ApiErrand[];
}

export interface IErrand {
  id: number;
  externalCaseId: string;
  errandNumber: string;
  caseType: string;
  label: string;
  description: string;
  administrator: Stakeholder;
  administratorName: string;
  priority: string;
  status: ApiErrandStatus;
  statuses: ApiErrandStatus[];
  phase: ErrandPhase;
  channel: Channels;
  municipalityId: string;
  stakeholders: CasedataOwnerOrContact[];
  facilities: FacilityDTO[];
  created: string;
  updated: string;
  notes: ErrandNote[];
  decisions: Decision[];
  attachments: Attachment[];
  messageIds: { messageId: string; adAccount: string }[];
  extraParameters: ExtraParameter[];
  suspension?: {
    suspendedFrom?: string;
    suspendedTo?: string;
  };
  notifications?: Notification[];
  relatesTo?: RelatedErrand[];
}

export interface ErrandsData extends Data {
  errands: IErrand[];
  isLoading?: boolean;
  page?: number;
  size?: number;
  totalPages?: number;
  totalElements?: number;
  labels: {
    label: string;
    screenReaderOnly: boolean;
    sortable: boolean;
    sticky?: boolean;
    shownForStatus: ErrandPhase | All;
  }[];
  suspension?: {
    suspendedFrom?: string;
    suspendedTo?: string;
  };
}

export interface RelatedErrand {
  errandId?: number;
  errandNumber?: string;
  relationReason?: string;
}
export interface RegisterErrandData {
  id?: string;
  errandNumber?: string;
  externalCaseId: string;
  priority: string;
  caseType: string;
  description: string;
  caseTitleAddition: string;
  startDate: string;
  endDate: string;
  diaryNumber: string;
  status: ApiErrandStatus;
  phase: ErrandPhase;
  municipalityId: string;
  statuses: ApiErrandStatus[];
  stakeholders: Partial<CreateStakeholderDto>[];
  facilities: string[];
  attachments: string[] | FileList[];
  applicationReceived: string;
  decision: string;
  extraParameters: ExtraParameter[];
  suspension?: {
    suspendedFrom?: string;
    suspendedTo?: string;
  };
  relatesTo?: RelatedErrand[];
}

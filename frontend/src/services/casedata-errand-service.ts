import { AppContext } from '@contexts/app-context-interface';
import { Attachment } from '@interfaces/attachment';
import { FTCaseLabel, FTCaseType } from '@interfaces/case-type';
import { ApiChannels, Channels } from '@interfaces/channels';
import { ApiErrand, ErrandsData, IErrand, PagedApiErrandsResponse, RegisterErrandData } from '@interfaces/errand';
import { ErrandPhase, UiPhase } from '@interfaces/errand-phase';
import { ErrandStatus } from '@interfaces/errand-status';
import { ExtraParameter } from '@interfaces/extra-parameters';
import { All, ApiPriority, Priority } from '@interfaces/priority';
import { Role } from '@interfaces/role';
import { Stakeholder } from '@interfaces/stakeholder';
import { User } from '@interfaces/user';
import {
  getLastUpdatedAdministrator,
  makeStakeholdersList,
  stakeholder2Contact,
} from '@services/casedata-stakeholder-service';
import { useSnackbar } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useCallback, useContext, useEffect } from 'react';
import { ApiResponse, apiService } from './api-service';
import { fetchErrandAttachments, MAX_FILE_SIZE_MB } from './casedata-attachment-service';
import {
  extractExtraParameters,
  extraParametersToUppgiftMapper,
  replaceExtraParameter,
  saveExtraParameters,
} from './casedata-extra-parameters-service';

interface CasedataFormModel {
  id: string;
  errandNumber: string;
  caseType: string;
  administrator?: Stakeholder;
  administratorName: string;
  priority: Priority;
  status: string;
  phase: ErrandPhase;
  supplementDueDate: string;
}

export const emptyErrandList: ErrandsData = {
  errands: [],
  labels: [],
  page: 0,
  size: 0,
  totalPages: 0,
  totalElements: 0,
};

export const ongoingCaseDataPTErrandLabels = [
  { label: 'Status', screenReaderOnly: false, sortable: false, shownForStatus: All.ALL },
  { label: 'Ärendetyp', screenReaderOnly: false, sortable: true, shownForStatus: All.ALL },
  { label: 'Registrerat', screenReaderOnly: false, sortable: true, shownForStatus: All.ALL },
  { label: 'Prioritet', screenReaderOnly: false, sortable: true, shownForStatus: All.ALL },
  { label: 'Inkom via', screenReaderOnly: false, sortable: true, shownForStatus: All.ALL },
];

export const newStatuses = [ErrandStatus.ArendeInkommit];

export const ongoingStatuses = [
  ErrandStatus.ArendeInkommit,
  ErrandStatus.UnderGranskning,
  ErrandStatus.VantarPaKomplettering,
  ErrandStatus.InterntAterkoppling,
  ErrandStatus.UnderUtredning,
  ErrandStatus.UnderBeslut,
  ErrandStatus.Beslutad,
  ErrandStatus.BeslutVerkstallt,
  ErrandStatus.BeslutOverklagat,
];

export const suspendedStatuses = [ErrandStatus.Parkerad];
export const assignedStatuses = [ErrandStatus.Tilldelat];

export const draftStatuses = [ErrandStatus.Utkast];

export const closedStatuses = [
  ErrandStatus.ArendeAvslutat,
  ErrandStatus.ArendetAvvisas,
  ErrandStatus.HanterasIAnnatSystem,
];

export const getStatusLabel = (statuses: ErrandStatus[]) => {
  if (statuses.length > 0) {
    if (statuses.some((s) => newStatuses.includes(s))) {
      return 'Öppna ärenden';
    } else if (statuses.some((s) => draftStatuses.includes(s))) {
      return 'Utkast';
    } else if (statuses.some((s) => closedStatuses.includes(s))) {
      return 'Avslutade ärenden';
    } else {
      return 'Ärenden';
    }
  }
  return '';
};

export const findPriorityKeyForPriorityLabel = (key: string) =>
  Object.entries(Priority).find((e: [string, string]) => e[1] === key)?.[0];

export const findStatusKeyForStatusLabel = (statusKey: string) =>
  Object.entries(ErrandStatus).find((e: [string, string]) => e[1] === statusKey)?.[0];

export const findStatusLabelForStatusKey = (statusLabel: string) =>
  Object.entries(ErrandStatus).find((e: [string, string]) => e[1] === statusLabel)?.[1];

export const getCaseTypes = () => FTCaseType;
export const getCaseLabels = () => FTCaseLabel;

export const findCaseTypeForCaseLabel = (caseLabel: string) => {
  return Object.entries(getCaseLabels()).find((e: [string, string]) => e[1] === caseLabel)?.[0];
};

export const findCaseLabelForCaseType = (caseType: string) =>
  Object.entries(getCaseLabels()).find((e: [string, string]) => e[0] === caseType)?.[1];

export const isErrandClosed: (errand: IErrand | CasedataFormModel) => boolean = (errand) => {
  return errand?.status === ErrandStatus.ArendeAvslutat;
};

export const isErrandLocked: (errand: IErrand | CasedataFormModel) => boolean = (errand) => {
  if (errand?.status && typeof errand?.status === 'object') {
    return (
      errand?.status?.statusType === ErrandStatus.ArendeAvslutat ||
      errand?.status?.statusType === ErrandStatus.Parkerad ||
      phaseChangeInProgress(errand as IErrand)
    );
  } else {
    return errand?.status === ErrandStatus.ArendeAvslutat;
  }
};

export const emptyErrand: Partial<IErrand> = {
  caseType: '',
  channel: Channels.ESERVICE_KATLA,
  description: '',
  municipalityId: '2281',
  phase: ErrandPhase.aktualisering,
  priority: Priority.MEDIUM,
  status: { statusType: ErrandStatus.ArendeInkommit },
};
export const mapErrandToIErrand: (e: ApiErrand, municipalityId: string) => IErrand | undefined = (
  e,
  municipalityId
) => {
  const administrator = getLastUpdatedAdministrator(e.stakeholders);
  try {
    const ierrand: IErrand = {
      id: e.id,
      externalCaseId: e.externalCaseId,
      errandNumber: e.errandNumber,
      caseType: e.caseType,
      label: findCaseLabelForCaseType(FTCaseType[e.caseType as keyof typeof FTCaseType]) || '',
      description: e.description || '',
      administrator: administrator,
      administratorName: administrator ? `${administrator.firstName} ${administrator.lastName}` : '',
      priority: Priority[e.priority as unknown as keyof typeof Priority],
      status: e.status,
      statuses: e.statuses,
      phase: e.phase,
      channel: e.channel ? Channels[e.channel as keyof typeof Channels] : Channels.ESERVICE_KATLA,
      municipalityId: e.municipalityId || municipalityId,
      stakeholders: e.stakeholders.map(stakeholder2Contact),
      facilities: e.facilities,
      created: e.created ? dayjs(e.created).format('YYYY-MM-DD HH:mm') : '',
      updated: e.updated ? dayjs(e.updated).format('YYYY-MM-DD HH:mm') : '',
      notes: e.notes.sort((a, b) =>
        dayjs(a.updated).isAfter(dayjs(b.updated)) ? -1
        : dayjs(b.updated).isAfter(dayjs(a.updated)) ? 1
        : 0
      ),
      decisions: e.decisions,
      attachments: [],
      messageIds: [],
      extraParameters: e.extraParameters,
      suspension: {
        suspendedFrom: e.suspension?.suspendedFrom,
        suspendedTo: e.suspension?.suspendedTo,
      },

      notifications: e.notifications,
      relatesTo: e.relatesTo,
    };
    return ierrand;
  } catch (e) {
    console.error('Error: could not map errands.');
    throw e;
  }
};

export const handleErrandResponse: (res: ApiErrand[], municipalityId: string) => IErrand[] = (res, municipalityId) => {
  const errands = res
    .map((res) => mapErrandToIErrand(res, municipalityId))
    .filter((errand): errand is IErrand => !!errand);
  return errands;
};

export const getErrand: (
  municipalityId: string,
  id: string
) => Promise<{ errand: IErrand | undefined; error?: string }> = (municipalityId, id) => {
  const url = `casedata/${municipalityId}/errand/${id}`;
  return apiService
    .get<ApiResponse<ApiErrand>>(url)
    .then(async (res) => {
      const errand = mapErrandToIErrand(res.data.data, municipalityId);
      let error: string | undefined = undefined;
      let errandAttachments;
      if (errand) {
        errandAttachments = await fetchErrandAttachments(municipalityId, errand.id);
      } else {
        throw new Error('Errand is undefined');
      }
      if (errandAttachments.message === 'error') {
        error = 'Ärendets bilagor kunde inte hämtas';
      }
      errand.attachments = errandAttachments.data;
      return { errand, error };
    })
    .catch(
      (e) =>
        ({ errand: undefined, error: e.response?.status ?? 'UNKNOWN ERROR' }) as {
          errand: undefined;
          error?: string;
        }
    );
};

export const getErrandByErrandNumber: (
  municipalityId: string,
  errandNumber: string
) => Promise<{ errand: IErrand | undefined; error?: string }> = (municipalityId, errandNumber) => {
  const url = `casedata/${municipalityId}/errand/errandNumber/${errandNumber}`;
  return apiService
    .get<ApiResponse<ApiErrand>>(url)
    .then(async (res) => {
      const errand = mapErrandToIErrand(res.data.data, municipalityId);
      let error: string = '';
      let errandAttachments;
      if (errand) {
        errandAttachments = await fetchErrandAttachments(municipalityId, errand.id);
      } else {
        throw new Error('Errand is undefined');
      }
      if (errandAttachments.message === 'error') {
        error = 'Ärendets bilagor kunde inte hämtas';
      }
      errand.attachments = errandAttachments.data;
      return { errand, ...(error && { error }) };
    })
    .catch(() => ({ errand: undefined, error: 'Ärende kunde inte hämtas' }) as { errand: undefined; error?: string });
};

export const getErrands: (
  municipalityId: string,
  page?: number,
  size?: number,
  filter?: { [key: string]: string | boolean | number },
  sort?: { [key: string]: 'asc' | 'desc' },
  extraParameters?: { [key: string]: string }
) => Promise<ErrandsData> = (
  municipalityId = process.env.NEXT_PUBLIC_MUNICIPALITY_ID,
  page = 0,
  size = 8,
  filter = {},
  sort = { created: 'desc' },
  extraParameters = {}
) => {
  let url = `casedata/${municipalityId}/errands?page=${page}&size=${size}`;

  const filterQuery = Object.keys(filter)
    .map((key) => key + '=' + filter[key])
    .join('&');
  const sortQuery = `${Object.keys(sort)
    .map((key) => `sort=${key}%2C${sort[key]}`)
    .join('&')}`;

  const extraParametersQuery = Object.keys(extraParameters)
    .map((key) => key + '=' + extraParameters[key])
    .join('&');

  url = filterQuery ? `casedata/${municipalityId}/errands?page=${page}&size=${size}&${filterQuery}` : url;
  url = sortQuery ? `${url}&${sortQuery}` : url;
  url = extraParametersQuery ? `${url}&${extraParametersQuery}` : url;

  return apiService
    .get<ApiResponse<PagedApiErrandsResponse>>(url)
    .then((res) => {
      let response = {} as ErrandsData;
      response = {
        errands: handleErrandResponse(res.data.data.content, municipalityId || ''),
        page: res.data.data.pageable.pageNumber,
        size: res.data.data.pageable.pageSize,
        totalPages: res.data.data.totalPages,
        totalElements: res.data.data.totalElements,
        labels: ongoingCaseDataPTErrandLabels,
      } as ErrandsData;
      return response;
    })
    .catch((e) => {
      if (e.response.status) {
        return { ...emptyErrandList, error: e.response?.status.toString() ?? 'UNKNOWN ERROR' } as ErrandsData;
      } else {
        throw e;
      }
    });
};

export const useErrands = (
  municipalityId: string,
  page?: number,
  size?: number,
  filter?: { [key: string]: string | boolean | number },
  sort?: { [key: string]: 'asc' | 'desc' },
  extraParameters?: { [key: string]: string }
): ErrandsData => {
  const toastMessage = useSnackbar();
  const {
    setIsLoading,
    setErrands,
    setNewErrands,
    setOngoingErrands,
    setDraftErrands,
    setClosedErrands,
    errands,
    newErrands,
    ongoingErrands,
    draftErrands,
    closedErrands,
  } = useContext(AppContext);

  const fetchErrands = useCallback(
    async (page: number = 0) => {
      setIsLoading(true);
      if (!filter) {
        return;
      }
      await getErrands(municipalityId, page, size, filter, sort, extraParameters)
        .then((res) => {
          setErrands({ ...res, isLoading: false });
          if (res.error && res.error !== '404') {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Ärenden kunde inte hämtas',
              status: 'error',
            });
          }
        })
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Nya ärenden kunde inte hämtas',
            status: 'error',
          });
        });

      const fetchPromises = [
        getErrands(
          municipalityId,
          page,
          1,
          { ...filter, status: newStatuses.map(findStatusKeyForStatusLabel).join(',') },
          sort
        )
          .then((res) => {
            setNewErrands(res);
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Nya ärenden kunde inte hämtas',
              status: 'error',
            });
          }),

        getErrands(
          municipalityId,
          page,
          1,
          {
            ...filter,
            status: ongoingStatuses.map(findStatusKeyForStatusLabel).join(','),
          },
          sort
        )
          .then((res) => {
            setOngoingErrands(res);
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Pågående ärenden kunde inte hämtas',
              status: 'error',
            });
          }),

        getErrands(
          municipalityId,
          page,
          1,
          {
            ...filter,
            status: draftStatuses.map(findStatusKeyForStatusLabel).join(','),
          },
          sort
        )
          .then((res) => {
            setDraftErrands(res);
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Utkast kunde inte hämtas',
              status: 'error',
            });
          }),

        getErrands(
          municipalityId,
          page,
          1,
          {
            ...filter,
            status: closedStatuses.map(findStatusKeyForStatusLabel).join(','),
          },
          sort
        )
          .then((res) => {
            setClosedErrands(res);
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Avslutade ärenden kunde inte hämtas',
              status: 'error',
            });
          }),
      ];
      return Promise.allSettled(fetchPromises);
    },
    //eslint-disable-next-line
    [
      setErrands,
      setNewErrands,
      setOngoingErrands,
      setDraftErrands,
      setClosedErrands,
      errands,
      newErrands,
      ongoingErrands,
      draftErrands,
      closedErrands,
      size,
      filter,
      sort,
      toastMessage,
    ]
  );

  useEffect(() => {
    if (size && size > 0) {
      fetchErrands().then(() => setIsLoading(false));
    }
    //eslint-disable-next-line
  }, [filter, size, sort]);

  useEffect(() => {
    if (page !== errands.page) fetchErrands(page).then(() => setIsLoading(false));
    //eslint-disable-next-line
  }, [page]);

  return errands;
};

export const blobToBase64: (blobl: Blob) => Promise<string> = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const createApiErrandData: (data: Partial<IErrand>) => Partial<RegisterErrandData> = (data) => {
  const stakeholders = makeStakeholdersList(data);
  const e: Partial<RegisterErrandData> = {
    ...(data.id && { id: data.id?.toString() }),
    ...(data.priority && { priority: ApiPriority[data.priority as keyof typeof ApiPriority] }),
    ...(data.caseType && { caseType: data.caseType }),
    ...(data.channel && { channel: ApiChannels[data.channel as keyof typeof ApiChannels] }),
    ...(data.description && { description: data.description }),
    ...(data.caseType &&
      data.caseType in FTCaseLabel && { caseTitleAddition: FTCaseLabel[data.caseType as keyof typeof FTCaseLabel] }),
    ...(data.status && { status: data.status }),
    ...(data.statuses && { statuses: data.statuses }),
    ...(data.phase && { phase: data.phase }),
    stakeholders: stakeholders,
  };
  return e;
};

interface SaveErrandResponse {
  errandId?: string;
  errandSuccessful: boolean;
  attachmentsSuccessful: boolean;
  noteSuccessful: boolean;
}

export const saveErrand: (data: Partial<IErrand>, municipalityId: string) => Promise<SaveErrandResponse> = (
  data,
  municipalityId
) => {
  const result: SaveErrandResponse = {
    errandSuccessful: false,
    attachmentsSuccessful: false,
    noteSuccessful: false,
  };

  const errandData: Partial<RegisterErrandData> = createApiErrandData(data);
  const uppgiftFields = extraParametersToUppgiftMapper(data)[data.caseType ?? ''] ?? [];
  const extractedExtraParameters = extractExtraParameters(uppgiftFields, () => data);

  return errandData.id ?
      apiService
        .patch<ApiResponse<ApiErrand>, Partial<RegisterErrandData>>(
          `casedata/${municipalityId}/errands/${errandData.id}`,
          errandData
        )
        .then(async () => {
          result.errandSuccessful = true;
          result.errandId = errandData.id;

          if (extractedExtraParameters.length > 0) {
            await saveExtraParameters(municipalityId, extractedExtraParameters, data as IErrand);
          }

          return result;
        })
        .catch((e) => {
          console.error('Something went wrong when patching errand', e);
          return result;
        })
    : apiService
        .post<ApiResponse<ApiErrand>, Partial<RegisterErrandData>>(`casedata/${municipalityId}/errands`, errandData)
        .then(async (res) => {
          result.errandSuccessful = true;
          result.errandId = res.data.data.id.toString();

          if (result.errandId && extractedExtraParameters.length > 0) {
            const { errand } = await getErrand(municipalityId, result.errandId);
            if (errand) {
              await saveExtraParameters(municipalityId, extractedExtraParameters, errand);
            }
          }

          return result;
        })
        .catch((e) => {
          console.error('Something went wrong when creating errand', e);
          return result;
        });
};

export const saveCroppedImage = async (
  municipalityId: string,
  errandId: number,
  attachment: Attachment,
  _blob: Blob
) => {
  if (!attachment?.id) {
    throw 'No attachment id found. Cannot save attachment without id.';
  }
  if (_blob.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
    throw new Error('MAX_SIZE');
  }
  const blob64 = await blobToBase64(_blob);
  const obj: Attachment = {
    category: attachment.category,
    name: attachment.name,
    note: '',
    extension: attachment.name.split('.').pop() || '',
    mimeType: attachment.mimeType,
    file: blob64.split(',')[1],
  };
  const buf = Buffer.from(obj.file, 'base64');
  const blob = new Blob([buf], { type: obj.mimeType });

  // Building form data
  const formData = new FormData();
  formData.append(`files`, blob, obj.name);
  formData.append(`category`, obj.category);
  formData.append(`name`, obj.name);
  formData.append(`note`, obj.note);
  formData.append(`extension`, obj.extension);
  formData.append(`mimeType`, obj.mimeType);
  const url = `casedata/${municipalityId}/errands/${errandId}/attachments/${attachment.id}`;
  return apiService
    .put<boolean, FormData>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('Something went wrong when creating attachment ', obj.category);
      throw e;
    });
};

export const updateErrandStatus = async (municipalityId: string, id: string, status: ErrandStatus) => {
  const e: Partial<RegisterErrandData> = {
    id,
    status: { statusType: status },
  };
  return apiService
    .patch<boolean, Partial<RegisterErrandData>>(`casedata/${municipalityId}/errands/${id}`, e)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.error('Something went wrong when updating errand status', e);
      throw 'Något gick fel när ärendets status skulle uppdateras.';
    });
};

export const validateStatusForDecision: (e: IErrand) => { valid: boolean; reason: string } = (e) => {
  return { valid: true, reason: e.status?.statusType || '' };
};

export const validateStakeholdersForDecision: (e: IErrand) => { valid: boolean; reason: string } = (e) => {
  if (!e.stakeholders.some((s) => s.roles.includes(Role.APPLICANT))) {
    return { valid: false, reason: 'Ärendeägare saknas' };
  }
  return { valid: true, reason: '' };
};

export const phaseChangeInProgress = (errand: IErrand) => {
  if (!errand?.id) {
    return false;
  }
  if (errand.extraParameters.find((p) => p.key === 'process.phaseAction')?.values?.[0] === 'CANCEL') {
    return (errand.extraParameters?.find((p) => p.key === 'process.phaseStatus')?.values?.[0] ?? '') !== 'CANCELED';
  }

  if (errand.status?.statusType === ErrandStatus.ArendeAvslutat) {
    return false;
  }
  if (typeof errand.extraParameters?.find((p) => p.key === 'process.phaseStatus')?.values?.[0] === 'undefined') {
    return true;
  }
  if (
    (errand.extraParameters?.find((p) => p.key === 'process.displayPhase')?.values?.[0] ?? '') ===
      UiPhase.registrerad &&
    !!errand.administrator
  ) {
    return true;
  }
  if (
    errand.phase === ErrandPhase.aktualisering ||
    errand.phase === ErrandPhase.utredning ||
    errand.phase === ErrandPhase.beslut ||
    errand.phase === ErrandPhase.verkstalla ||
    errand.phase === ErrandPhase.uppfoljning
  ) {
    return (errand.extraParameters?.find((p) => p.key === 'process.phaseAction')?.values?.[0] ?? '') === 'COMPLETE';
  } else {
    return (errand.extraParameters?.find((p) => p.key === 'process.phaseStatus')?.values?.[0] ?? '') !== 'WAITING';
  }
};

export const cancelErrandPhaseChange = async (municipalityId: string, errand: IErrand) => {
  if (!errand.id) {
    console.error('No id found. Cannot update errand wihout id. Returning.');
    return;
  }
  const newParameter: ExtraParameter = {
    key: 'process.phaseAction',
    values: ['CANCEL'],
  };
  const e: Partial<RegisterErrandData> = {
    id: errand.id.toString(),
    extraParameters: replaceExtraParameter(errand.extraParameters, newParameter),
  };
  return apiService
    .patch<boolean, Partial<RegisterErrandData>>(`casedata/${municipalityId}/errands/${errand.id}`, e)
    .catch((e) => {
      console.error('Something went wrong when cancelling errand phase change', e);
      throw e;
    });
};

export const triggerErrandPhaseChange = async (municipalityId: string, errand: IErrand) => {
  if (!errand?.id) {
    console.error('No id found. Cannot update errand wihout id. Returning.');
    return;
  }
  const newParameter: ExtraParameter = {
    key: 'process.phaseAction',
    values: ['COMPLETE'],
  };
  const e: Partial<RegisterErrandData> = {
    id: errand.id.toString(),
    extraParameters: replaceExtraParameter(errand.extraParameters, newParameter),
  };
  return apiService
    .patch<boolean, Partial<RegisterErrandData>>(`casedata/${municipalityId}/errands/${errand.id}`, e)
    .catch((e) => {
      console.error('Something went wrong when triggering errand phase change', e);
      throw e;
    });
};

export const getUiPhase: (errand: IErrand) => UiPhase = (errand) =>
  errand?.extraParameters?.find((p) => p.key === 'process.displayPhase')?.values?.[0] as UiPhase;

export const validateAction: (errand: IErrand, user: User) => boolean = (errand, user) => {
  let allowed = false;
  if (errand?.extraParameters?.find((p) => p.key === 'process.displayPhase')?.values?.[0] === UiPhase.registrerad) {
    allowed = true;
  }
  if (user.username.toLocaleLowerCase() === errand?.administrator?.adAccount?.toLocaleLowerCase()) {
    allowed = true;
  }
  return allowed;
};

import { IErrand } from '@interfaces/errand';
import { ErrandStatus } from '@interfaces/errand-status';
import { isErrandLocked } from '@services/casedata-errand-service';

export function isErrandReadOnly(errand: IErrand): boolean {
  if (isErrandLocked(errand)) return true;

  const errandStatus = errand?.status?.statusType;
  const errandCreated = !!errand.created;

  const isReadOnly = errandCreated && errandStatus && errandStatus !== ErrandStatus.Utkast;

  return !!isReadOnly;
}

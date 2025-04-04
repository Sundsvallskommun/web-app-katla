import { User } from '@interfaces/user';
import { ApiResponse } from '@services/api-service';

// export const defaultPermissions: Permissions = {
//     canEditSystemMessages: false,
// };

export const emptyUser: User = {
  name: '',
  email: '',
  username: '',
  firstName: '',
  lastName: '',

  userSettings: {
    readNotificationsClearedDate: '',
  },
  permissions: {
    canEditCasedata: false,
    canEditSupportManagement: false,
    canViewAttestations: false,
    canEditAttestations: false,
  },
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};

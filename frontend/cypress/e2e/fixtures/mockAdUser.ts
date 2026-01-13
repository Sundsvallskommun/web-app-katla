import { mockAddress } from './mockAddress';
import { mockProtectedInfo } from './mockProtectedInfo';

export const mockAdUser = {
  data: {
    personid: mockProtectedInfo.personId,
    givenname: 'Test',
    lastname: 'Testsson',
    email: mockProtectedInfo.emails.user,
    mobilePhone: mockProtectedInfo.phoneNumbers.swedish,
    workPhone: '',
    street: mockAddress.address,
    postalCode: mockAddress.postalCode,
    city: mockAddress.city,
    careof: '',
    loginName: 'PERSONAL\\test',
    company: 'Sundsvalls kommun',
    orgTree: 'Kommun|ADM01|Njurunda¤',
  },
  message: 'success',
};

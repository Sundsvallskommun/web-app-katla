import { mockAddress } from './mockAddress';
import { mockProtectedInfo } from './mockProtectedInfo';

export const mockAddressResponse = {
  data: {
    personId: mockProtectedInfo.personId,
    givenname: 'Test',
    lastname: 'Testsson',
    gender: 'M',
    nrDate: '20230101',
    classified: 'N',
    protectedNR: 'N',
    addresses: [
      {
        realEstateDescription: mockAddress.realEstateDescription,
        address: mockAddress.address,
        addressArea: mockAddress.addressArea,
        addressNumber: mockAddress.addressNumber,
        postalCode: mockAddress.postalCode,
        city: mockAddress.city,
        municipality: '2281',
        country: mockAddress.country,
        emigrated: false,
        addressType: mockAddress.addressType,
      },
    ],
  },
  message: 'success',
};

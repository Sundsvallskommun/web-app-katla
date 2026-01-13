import { apiServiceName } from '@/config/api-config';
import { logger } from '@/utils/logger';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import ApiService from '@services/api.service';
import { IsString } from 'class-validator';
import { Body, Controller, Get, Param, Post, Req, Res, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

class SsnPayload {
  @IsString()
  ssn: string;
}

interface Citizenaddress {
  personId: string;
  givenname: string;
  lastname: string;
  gender: string;
  civilStatus: string;
  nrDate: string;
  classified: string;
  protectedNR: string;
  addresses: [
    {
      realEstateDescription: string;
      co?: string;
      address: string;
      addressArea?: string;
      addressNumber?: string;
      addressLetter?: string;
      appartmentNumber: string;
      postalCode: string;
      city: string;
      municipality: string;
      country: string;
      emigrated: boolean;
      addressType: string;
    },
  ];
}

interface EmployeeAddress {
  personid: string;
  givenname: string;
  lastname: string;
  fullname: string;
  address: string;
  postalCode: string;
  city: string;
  workPhone: string;
  mobilePhone: string;
  aboutMe: string;
  email: string;
  mailNickname: string;
  company: string;
  companyId: number;
  orgTree: string;
  referenceNumber: string;
  isManager: boolean;
  loginName: string;
}

interface EmployedPersonData {
  domain: string;
  loginName: string;
}
interface ResponseData {
  data: Citizenaddress;
  message: string;
}

interface PersonIdResponseData {
  data: { personId: string };
  message: string;
}

@Controller()
export class AddressController {
  private apiService = new ApiService();
  SERVICE = apiServiceName('citizen');
  EMPLOYEE_SERVICE = apiServiceName('employee');

  @Post('/address/')
  @OpenAPI({ summary: 'Return adress for given person number' })
  @UseBefore(authMiddleware, validationMiddleware(SsnPayload, 'body'))
  async cases(@Req() req: RequestWithUser, @Res() response: any, @Body() ssnPayload: SsnPayload): Promise<ResponseData> {
    const guidUrl = `${this.SERVICE}/${process.env.MUNICIPALITY_ID}/${ssnPayload.ssn}/guid`;
    const guidRes = await this.apiService.get<string>({ url: guidUrl }, req.user);

    const url = `${apiServiceName('citizen')}/${process.env.MUNICIPALITY_ID}/${guidRes.data}`;
    const res = await this.apiService.get<Citizenaddress>({ url }, req.user);

    return { data: res.data, message: 'success' } as ResponseData;
  }

  @Post('/personid/')
  @OpenAPI({ summary: 'Return personId for given person number' })
  @UseBefore(authMiddleware, validationMiddleware(SsnPayload, 'body'))
  async personId(@Req() req: RequestWithUser, @Res() response: any, @Body() ssnPayload: SsnPayload): Promise<PersonIdResponseData> {
    const guidUrl = `${this.SERVICE}/${process.env.MUNICIPALITY_ID}/${ssnPayload.ssn}/guid`;
    const guidRes = await this.apiService.get<string>({ url: guidUrl }, req.user);

    const url = `${this.SERVICE}/${process.env.MUNICIPALITY_ID}/citizen/${guidRes.data}`;
    const res = await this.apiService.get<Citizenaddress>({ url }, req.user);

    return { data: { personId: res.data.personId }, message: 'success' } as PersonIdResponseData;
  }

  @Get('/portalpersondata/personal/:loginName')
  @OpenAPI({ summary: 'Fetch user information for given AD user' })
  @UseBefore(authMiddleware)
  async username(
    @Req() req: RequestWithUser,
    @Param('loginName') loginName: string,
    @Res() response: any,
  ): Promise<{ data: EmployeeAddress; message: string }> {
    const url = `${this.EMPLOYEE_SERVICE}/${process.env.MUNICIPALITY_ID}/portalpersondata/PERSONAL/${loginName}`;
    const res = await this.apiService.get<EmployeeAddress>({ url }, req.user).catch(e => {
      logger.error('Error when fetching user information');
      throw e;
    });
    return { data: res.data, message: 'success' };
  }

  @Get('/employed/:personalNumber/loginname')
  @OpenAPI({ summary: 'Fetch employed user information' })
  @UseBefore(authMiddleware)
  async employed(
    @Req() req: RequestWithUser,
    @Param('personalNumber') personalNumber: string,
    @Res() response: any,
  ): Promise<{ data: EmployedPersonData; message: string }> {
    const url = `${this.EMPLOYEE_SERVICE}/${process.env.MUNICIPALITY_ID}/employed/${personalNumber}/loginname`;
    const res = await this.apiService.get<EmployedPersonData>({ url }, req.user).catch(e => {
      logger.error('Error when fetching employed user information');
      throw e;
    });
    return { data: res.data, message: 'success' };
  }
}

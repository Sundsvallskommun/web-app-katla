import { MUNICIPALITY_ID } from '@/config';
import { apiServiceName } from '@/config/api-config';
import { Asset } from '@/data-contracts/partyassets/data-contracts';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ApiService from '@services/api.service';
import { logger } from '@utils/logger';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

interface AssetsResponseData {
  data: Asset[];
  message: string;
}

@Controller()
export class PartyAssetsController {
  private apiService = new ApiService();
  private readonly SERVICE = apiServiceName('partyassets');

  /**
   * List the assets ("insatser") registered for a given person/party.
   *
   * @param partyId The party (person) identifier to look up assets for. Equals
   *   the `personId` resolved through the citizen search.
   */
  @Get('/partyassets/assets/:partyId')
  @OpenAPI({ summary: 'List assets (insatser) for a given party/person' })
  @UseBefore(authMiddleware)
  async getAssetsByPartyId(@Req() req: RequestWithUser, @Param('partyId') partyId: string): Promise<AssetsResponseData> {
    const params = new URLSearchParams({ partyId });

    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/assets?${params.toString()}`;
    const res = await this.apiService.get<Asset[]>({ url }, req.user).catch(e => {
      logger.error(`Error when fetching assets for party ${partyId}`);
      throw e;
    });

    return { data: res.data, message: 'success' };
  }
}

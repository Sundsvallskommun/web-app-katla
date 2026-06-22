import { MUNICIPALITY_ID } from '@/config';
import { apiServiceName } from '@/config/api-config';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ApiService from '@services/api.service';
import { logger } from '@utils/logger';
import { Controller, Get, Param, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

/**
 * Shape returned by the JsonSchema API for a single schema / ui-schema. Only the
 * fields consumed here are typed; `value` holds the actual JSON Schema document.
 */
interface JsonSchemaResource {
  id?: string;
  value?: Record<string, unknown>;
}

interface SchemaResponseData {
  data: {
    schema: Record<string, unknown>;
    uiSchema: Record<string, unknown>;
    schemaId: string;
  };
  message: string;
}

@Controller()
export class SchemaController {
  private apiService = new ApiService();
  private readonly SERVICE = apiServiceName('jsonschema');

  /** Best-effort fetch of a schema's ui-schema; returns `{}` when none exists. */
  private async fetchUiSchema(schemaId: string, req: RequestWithUser): Promise<Record<string, unknown>> {
    try {
      const url = `${this.SERVICE}/${MUNICIPALITY_ID}/schemas/${schemaId}/ui-schema`;
      const res = await this.apiService.get<JsonSchemaResource>({ url }, req.user);
      return res.data.value ?? {};
    } catch {
      logger.info(`No UI schema found for ${schemaId}, using empty object`);
      return {};
    }
  }

  /**
   * Fetch a JSON Schema (and its optional ui-schema) by id. Used to resolve the
   * human-readable labels and enum titles of an asset's `jsonParameters`.
   */
  @Get('/schemas/:schemaId')
  @OpenAPI({ summary: 'Fetch a JSON schema and its ui-schema by id' })
  @UseBefore(authMiddleware)
  async getSchemaById(@Req() req: RequestWithUser, @Param('schemaId') schemaId: string): Promise<SchemaResponseData> {
    const url = `${this.SERVICE}/${MUNICIPALITY_ID}/schemas/${schemaId}`;
    const res = await this.apiService.get<JsonSchemaResource>({ url }, req.user).catch(e => {
      logger.error(`Error when fetching schema ${schemaId}`);
      throw e;
    });

    const uiSchema = await this.fetchUiSchema(schemaId, req);

    return {
      data: { schema: res.data.value ?? {}, uiSchema, schemaId },
      message: 'success',
    };
  }
}

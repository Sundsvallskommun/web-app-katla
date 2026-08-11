import { CASEDATA_NAMESPACE } from '@/config';
import { apiServiceName } from '@/config/api-config';
import { AttachmentChannelEnum, Errand as ErrandDTO } from '@/data-contracts/case-data/data-contracts';
import { Attachment, CreateAttachmentDto } from '@/interfaces/attachment.interface';
import { fileUploadOptions } from '@/utils/fileUploadOptions';
import { logger } from '@/utils/logger';
import { apiURL } from '@/utils/util';
import { validateRequestBody } from '@/utils/validate';
import { RequestWithUser } from '@interfaces/auth.interface';
import authMiddleware from '@middlewares/auth.middleware';
import ApiService from '@services/api.service';
import FormData from 'form-data';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, Res, UploadedFiles, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

interface ResponseData {
  data: any;
  message: string;
}

@Controller()
export class CaseDataAttachmentController {
  private apiService = new ApiService();
  SERVICE = apiServiceName('case-data');

  @Post('/casedata/:municipalityId/errands/:errandId/attachments')
  @HttpCode(201)
  @OpenAPI({ summary: 'Add an attachment to an errand by errand number' })
  @UseBefore(authMiddleware)
  async newAttachment(
    @Req() req: RequestWithUser,
    @Param('errandId') errandId: number,
    @Param('municipalityId') municipalityId: string,
    @UploadedFiles('files', { options: fileUploadOptions, required: false }) files: Express.Multer.File[],
    @Body() attachmentData: CreateAttachmentDto,
  ): Promise<{ data: ErrandDTO; message: string }> {
    await validateRequestBody(CreateAttachmentDto, attachmentData);
    const baseURL = apiURL(this.SERVICE);

    if (!files || files.length === 0) {
      throw 'No file found. Cannot create attachment without a file.';
    }

    const url = `${municipalityId}/${CASEDATA_NAMESPACE}/errands/${errandId}/attachments`;

    // Casedata v13 stores attachments as binary, so the attachment is now created
    // with multipart/form-data: a JSON `attachment` part holding the metadata and a
    // binary `file` part holding the raw content (previously a base64 `file` field
    // on a JSON body).
    const fileName = `${attachmentData.name}.${attachmentData.extension}`;
    const metadata = {
      category: attachmentData.category,
      name: fileName,
      note: attachmentData.note,
      extension: attachmentData.extension,
      mimeType: attachmentData.mimeType,
      errandNumber: attachmentData.errandNumber,
      channel: AttachmentChannelEnum.ESERVICE,
    };

    const form = new FormData();
    form.append('file', files[0].buffer, { filename: fileName, contentType: attachmentData.mimeType });
    form.append('attachment', JSON.stringify(metadata), { contentType: 'application/json' });

    // Set the multipart Content-Type (including the boundary) under the capitalized
    // `Content-Type` key: ApiService's request interceptor merges its default
    // `Content-Type: application/json` by that exact key, so using form.getHeaders()'s
    // lowercase `content-type` would leave the JSON default in place and drop the
    // boundary. Setting the capitalized key makes the multipart type win.
    const contentType = form.getHeaders()['content-type'];
    const response = await this.apiService
      .post<ErrandDTO, FormData>({ url, baseURL, data: form, headers: { 'Content-Type': contentType } }, req.user)
      .catch(e => {
        logger.error('Attachment post error:', e);
        throw e;
      });
    return { data: response.data, message: `Attachment created on errand ${attachmentData.errandNumber}` };
  }

  @Patch('/casedata/:municipalityId/errands/:errandId/attachments/:id')
  @OpenAPI({ summary: 'Save a modified existing attachment' })
  @UseBefore(authMiddleware)
  async patchAttachment(
    @Req() req: RequestWithUser,
    @Param('errandId') errandId: number,
    @Param('municipalityId') municipalityId: string,
    @Param('id') attachmentId: number,
    @Body() attachmentData: Partial<Attachment>,
  ): Promise<ResponseData> {
    if (!attachmentId) {
      throw 'Id not found. Cannot patch attachment without id.';
    }
    const url = `${municipalityId}/${CASEDATA_NAMESPACE}/errands/${errandId}/attachments/${attachmentId}`;
    const baseURL = apiURL(this.SERVICE);
    const res = await this.apiService.patch<any, Partial<Attachment>>({ url, baseURL, data: attachmentData }, req.user);
    return { data: 'ok', message: 'success' } as ResponseData;
  }

  @Get('/casedata/:municipalityId/errands/:errandId/attachments/:id')
  @OpenAPI({ summary: 'Return an attachment file content by id' })
  @UseBefore(authMiddleware)
  async attachment(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Param('errandId') errandId: string,
    @Param('municipalityId') municipalityId: string,
    @Res() response: any,
  ): Promise<ResponseData> {
    const url = `${municipalityId}/${CASEDATA_NAMESPACE}/errands/${errandId}/attachments/${id}`;
    const baseURL = apiURL(this.SERVICE);
    // Casedata v13 streams the raw binary content from this endpoint (the metadata
    // list no longer carries a base64 `file`). Fetch it as an arraybuffer and hand
    // the client a base64 string, mirroring the conversation-attachment download.
    const res = await this.apiService.get<ArrayBuffer>({ url, baseURL, responseType: 'arraybuffer' }, req.user);
    const b64 = Buffer.from(res.data).toString('base64');
    return { data: b64, message: 'success' } as ResponseData;
  }

  @Get('/casedata/:municipalityId/errand/:errandId/attachments')
  @OpenAPI({ summary: 'Return attachments for an errand by errand id' })
  @UseBefore(authMiddleware)
  async errandAttachments(
    @Req() req: RequestWithUser,
    @Param('errandId') errandId: string,
    @Param('municipalityId') municipalityId: string,
    @Res() response: any,
  ): Promise<ResponseData> {
    const url = `${municipalityId}/${CASEDATA_NAMESPACE}/errands/${errandId}/attachments`;
    const baseURL = apiURL(this.SERVICE);
    const res = await this.apiService.get<Attachment[]>({ url, baseURL }, req.user).catch(e => {
      if (e.status === 404) {
        logger.error('Attachments not found (404) so returning empty list instead');
        return { data: [] };
      } else {
        logger.error('Error response when fetching attachments: ', e);
        throw e;
      }
    });
    return { data: res.data, message: 'success' } as ResponseData;
  }

  @Delete('/casedata/:municipalityId/errands/:errandId/attachments/:attachmentId')
  @HttpCode(201)
  @OpenAPI({ summary: 'Remove an attachment by id' })
  @UseBefore(authMiddleware)
  async removeAttachment(
    @Req() req: RequestWithUser,
    @Param('municipalityId') municipalityId: string,
    @Param('errandId') errandId: string,
    @Param('attachmentId') attachmentId: number,
  ): Promise<{ data: ErrandDTO; message: string }> {
    const url = `${municipalityId}/${CASEDATA_NAMESPACE}/errands/${errandId}/attachments/${attachmentId}`;
    const baseURL = apiURL(this.SERVICE);
    logger.info('Removing attachment:', attachmentId, 'from', baseURL, 'url:', url);
    // TODO validate action but we need errandId for that
    const response = await this.apiService.delete<ErrandDTO>({ url, baseURL }, req.user).catch(e => {
      logger.error('Something went wrong when deleting attachment');
      logger.error(e);
      throw e;
    });
    return { data: response.data, message: `Attachment ${attachmentId} removed` };
  }
}

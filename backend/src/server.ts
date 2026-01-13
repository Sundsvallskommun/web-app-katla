import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { AddressController } from './controllers/address.controller';
import { CaseDataAttachmentController } from './controllers/casedata/casedata-attachment.controller';
import { CaseDataDecisionsController } from './controllers/casedata/casedata-decision.controller';
import { CaseDataErrandController } from './controllers/casedata/casedata-errand.controller';
import { caseDataFacilitiesController } from './controllers/casedata/casedata-facilities.controller';
import { CaseDataHistoryController } from './controllers/casedata/casedata-history.controller';
import { CasedataNotificationController } from './controllers/casedata/casedata-notification-controller';
import { CasedataStakeholderController } from './controllers/casedata/casedata-stakeholder.controller';
import { CaseDataConversationController } from './controllers/casedata/casedata-conversation.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  HealthController,
  AddressController,
  CaseDataAttachmentController,
  CaseDataDecisionsController,
  CaseDataErrandController,
  caseDataFacilitiesController,
  CaseDataHistoryController,
  CasedataNotificationController,
  CasedataStakeholderController,
  CaseDataConversationController,
]);

app.listen();

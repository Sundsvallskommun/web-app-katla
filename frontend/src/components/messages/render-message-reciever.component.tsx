import { IErrand } from '@interfaces/errand';
import { MessageNode } from '@interfaces/message';
import { getOwnerStakeholder } from '@services/casedata-stakeholder-service';
import sanitized from '@services/sanitizer-service';

const getMessageSourceLabel = (message: MessageNode, errand: IErrand): string => {
  if (!message) return '';

  if (message.messageType === 'MINASIDOR' && message.direction === 'OUTBOUND') {
    const owner = getOwnerStakeholder(errand);
    return owner.firstName + ' ' + owner.lastName;
  }

  if (message.messageType === 'MINASIDOR' && message.direction === 'INBOUND') {
    return 'Draken';
  }

  if (message.messageType === 'DRAKEN') {
    return 'Draken';
  }

  return '(okänd mottagare)';
};

export const RenderMessageReciever: React.FC<{ selectedMessage: MessageNode; errand: IErrand }> = ({
  selectedMessage,
  errand,
}) => {
  const nameOfReciever = getMessageSourceLabel(selectedMessage, errand);

  return <>{sanitized(nameOfReciever)}</>;
};

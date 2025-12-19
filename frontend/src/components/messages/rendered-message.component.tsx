import { AppContext } from '@contexts/app-context-interface';
import { MessageAttachment } from '@interfaces/attachment';
import { MessageNode } from '@interfaces/message';
import { getConversationAttachment } from '@services/casedata-conversation-service';
import sanitized from '@services/sanitizer-service';
import { Button, cx, Icon, useSnackbar, useThemeQueries } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import {
  CornerDownRight,
  Image as ImageIcon,
  Mail,
  Monitor,
  Paperclip,
  Smartphone,
  SquareMinus,
  SquarePlus,
} from 'lucide-react';
import React, { useContext, useState } from 'react';
import { MessageAvatar } from './message-avatar.component';

export const RenderedMessage: React.FC<{
  message: MessageNode;
  root?: boolean;
  children: React.ReactNode;
}> = ({ message, root = false, children }) => {
  const { errand, municipalityId } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const [expanded, setExpanded] = useState<boolean>(!message?.children?.length ? true : false);
  const toastMessage = useSnackbar();

  const getSender = (msg: MessageNode) =>
    msg?.firstName && msg?.lastName ? `${msg.firstName} ${msg.lastName}` : '(okänd avsändare)';

  const getMessageTypeContent = () => {
    const iconClass = isMaxMediumDevice ? 'align-sub' : 'align-sub mx-sm';
    switch (message.messageType) {
      case 'SMS':
        return (
          <>
            <Smartphone size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' Via SMS'}
          </>
        );
      case 'EMAIL':
        return (
          <>
            <Mail size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' Via e-post'}
          </>
        );
      case 'DIGITAL_MAIL':
        return (
          <>
            <Mail size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' Via digital brevlåda'}
          </>
        );
      case 'WEB_MESSAGE':
        return (
          <>
            <Monitor size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' via e-tjänst'}
          </>
        );
      case 'DRAKEN':
        return (
          <>
            <Monitor size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' Via Draken'}
          </>
        );
      case 'MINASIDOR':
        return (
          <>
            <Monitor size="1.5rem" className={iconClass} />
            {!isMaxMediumDevice && ' Via Mina sidor'}
          </>
        );
      default:
        return '';
    }
  };

  const handleDownloadAttachment = (attachment: MessageAttachment) => {
    const attachmentId = attachment.attachmentId || attachment.id;

    if (!message.conversationId || !message.messageId || !attachmentId) {
      toastMessage({
        position: 'bottom',
        closeable: false,
        message: 'Kan inte ladda ned bilagan - information saknas',
        status: 'error',
      });
      return;
    }

    getConversationAttachment(municipalityId, errand.id, message.conversationId, message.messageId, attachmentId)
      .then((res) => {
        if (res.data) {
          //NOTE: application/octet-stream is a generic binary type
          const mimeType = attachment.contentType || attachment.mimeType || 'application/octet-stream';
          const uri = `data:${mimeType};base64,${res.data}`;
          const link = document.createElement('a');
          link.href = uri;
          link.setAttribute('download', attachment.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Filen kan inte hittas eller är skadad.',
            status: 'error',
          });
        }
      })
      .catch(() => {
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: 'Något gick fel när bilagan skulle hämtas',
          status: 'error',
        });
      });
  };

  const getAttachmentIcon = (attachment: MessageAttachment) => {
    const type = attachment.contentType || attachment.mimeType || '';
    if (type.startsWith('image/')) {
      return <Icon icon={<ImageIcon />} />;
    }
    return <Icon icon={<Paperclip />} />;
  };

  const ExpandButton = () => (
    <div className="flex gap-8 items-center" onClick={(e) => e.stopPropagation()}>
      <span
        className={cx(
          message.viewed ? 'bg-gray-200' : 'bg-vattjom-surface-primary',
          'self-center w-12 h-12 my-xs rounded-full flex items-center justify-center text-lg'
        )}
      ></span>
      <Button variant="ghost" iconButton size="sm" onClick={() => setExpanded(!expanded)}>
        <Icon icon={expanded ? <SquareMinus /> : <SquarePlus />} />
      </Button>
    </div>
  );

  return (
    <>
      <div
        key={`message-${message.messageId}`}
        className={cx(
          'rounded-4 m-0 py-sm px-sm text-md hover:bg-background-color-mixin-1',
          isMaxMediumDevice && 'cursor-pointer'
        )}
        data-cy={`node-${message?.messageId}`}
        onClick={isMaxMediumDevice ? () => setExpanded(!expanded) : undefined}
      >
        <div
          className={cx('relative flex', isMaxMediumDevice ? 'flex-col gap-sm' : 'gap-md items-start justify-between')}
        >
          <div className="flex w-full">
            <MessageAvatar message={message} />
            <div className={cx('ml-sm', isMaxMediumDevice ? 'flex-1 min-w-0' : 'w-5/6')}>
              <div className={cx('my-0', !isMaxMediumDevice && 'flex justify-between')}>
                <div>
                  {!root && <CornerDownRight size={16} className="mr-sm" />}
                  <p
                    className={cx('mr-md text-small font-bold', isMaxMediumDevice ? 'break-words' : 'break-all')}
                    dangerouslySetInnerHTML={{ __html: `Från: ${sanitized(getSender(message))}` }}
                  ></p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cx(
              'flex',
              isMaxMediumDevice ?
                'flex-wrap gap-xs items-center justify-between'
              : 'flex-col align-end items-end justify-between mt-4'
            )}
          >
            <div
              className={cx(
                'inline-flex items-center',
                isMaxMediumDevice ? 'flex-wrap gap-xs' : 'items-start flex-nowrap'
              )}
            >
              <span className="text-xs whitespace-nowrap">
                {message.sent ? dayjs(message.sent).format('YYYY-MM-DD HH:mm') : 'Datum saknas'}
              </span>
              {!isMaxMediumDevice && <span className="text-xs mx-sm">|</span>}
              {message.attachments && message.attachments.length > 0 && (
                <>
                  <div className={cx('inline-flex items-center gap-xs', !isMaxMediumDevice && 'mx-sm')}>
                    <Paperclip size="1.5rem" />
                    <span className="text-xs">{message.attachments.length}</span>
                  </div>
                  {!isMaxMediumDevice && <span className="text-xs mx-sm">|</span>}
                </>
              )}
              <span className="flex text-xs whitespace-nowrap items-center">{getMessageTypeContent()}</span>
            </div>
            {isMaxMediumDevice && <ExpandButton />}
          </div>

          {!isMaxMediumDevice && <ExpandButton />}
        </div>

        <div
          className={cx(
            `message-${message.messageId}`,
            !isMaxMediumDevice && 'px-xl',
            expanded ? '' : 'max-h-0 overflow-hidden',
            'transition-[max-height] ease-in-out'
          )}
        >
          {message?.attachments && message.attachments.length > 0 && (
            <ul className="flex flex-wrap gap-sm items-center my-12">
              {message.attachments.map((a, idx) => (
                <Button
                  key={`${a.attachmentId || a.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadAttachment(a);
                  }}
                  role="listitem"
                  leftIcon={getAttachmentIcon(a)}
                  variant="tertiary"
                  size={isMaxMediumDevice ? 'sm' : 'md'}
                  className={isMaxMediumDevice ? 'max-w-full' : undefined}
                >
                  <span className="truncate">{a.name}</span>
                </Button>
              ))}
            </ul>
          )}
          <div className="my-18">
            <p
              className="my-0 break-words [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg"
              dangerouslySetInnerHTML={{
                __html: sanitized(message?.message || ''),
              }}
            ></p>
          </div>
        </div>
      </div>
      <div className={!isMaxMediumDevice ? 'ml-lg' : ''}>{children}</div>
    </>
  );
};

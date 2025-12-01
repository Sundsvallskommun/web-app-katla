import { AppContext } from '@contexts/app-context-interface';
import { MessageNode } from '@interfaces/message';
import { getConversationAttachment } from '@services/casedata-conversation-service';
import sanitized from '@services/sanitizer-service';
import { Button, cx, Icon, useSnackbar } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { CornerDownRight, Image, Mail, Monitor, Paperclip, Smartphone, SquareMinus, SquarePlus } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { MessageAvatar } from './message-avatar.component';
import { RenderMessageReciever } from './render-message-reciever.component';

export const RenderedMessage: React.FC<{
  message: MessageNode;
  root?: boolean;
  children: React.ReactNode;
}> = ({ message, root = false, children }) => {
  const { errand, municipalityId } = useContext(AppContext);
  const [expanded, setExpanded] = useState<boolean>(!message?.children?.length ? true : false);

  const toastMessage = useSnackbar();

  const getSender = (msg: MessageNode) =>
    msg?.firstName && msg?.lastName ? `${msg.firstName} ${msg.lastName}` : '(okänd avsändare)';

  return (
    <>
      <div
        key={`message-${message.messageId}`}
        className={cx('rounded-4 m-0 py-sm px-sm text-md hover:bg-background-color-mixin-1')}
        data-cy={`node-${message?.messageId}`}
      >
        <div className="relative flex gap-md items-start justify-between">
          <div className="flex w-full">
            <MessageAvatar message={message} />
            <div className="w-5/6 ml-sm">
              <div className="my-0 flex justify-between">
                <div>
                  {!root ?
                    <CornerDownRight size={16} className="mr-sm" />
                  : null}
                  <p
                    className={cx(`mr-md break-all text-small font-bold`)}
                    dangerouslySetInnerHTML={{
                      __html: `Från: ${sanitized(getSender(message))}`,
                    }}
                  ></p>
                  <p className="mr-md break-all font-bold">
                    Till : <RenderMessageReciever selectedMessage={message} errand={errand} />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col align-end items-end justify-between mt-4">
            <div className="inline-flex items-start flex-nowrap">
              <span className="text-xs whitespace-nowrap">
                {message.sent ? dayjs(message.sent).format('YYYY-MM-DD HH:mm') : 'Datum saknas'}
              </span>
              <span className="text-xs mx-sm">|</span>
              {message.attachments && message.attachments?.length > 0 ?
                <>
                  <div className="mx-sm inline-flex items-center gap-xs">
                    <Paperclip size="1.5rem" />
                    <span className="text-xs">{message.attachments?.length}</span>
                  </div>
                  <span className="text-xs mx-sm">|</span>
                </>
              : null}
              <span className="flex text-xs whitespace-nowrap items-center">
                {(() => {
                  switch (message.messageType) {
                    case 'SMS':
                      return (
                        <>
                          <Smartphone size="1.5rem" className="align-sub mx-sm" /> Via SMS
                        </>
                      );
                    case 'EMAIL':
                      return (
                        <>
                          <Mail size="1.5rem" className="align-sub mx-sm" /> Via e-post
                        </>
                      );
                    case 'DIGITAL_MAIL':
                      return (
                        <>
                          <Mail size="1.5rem" className="align-sub mx-sm" /> Via digital brevlåda
                        </>
                      );
                    case 'WEB_MESSAGE':
                      return (
                        <>
                          <Monitor size="1.5rem" className="align-sub mx-sm" /> via e-tjänst
                        </>
                      );
                    case 'DRAKEN':
                      return (
                        <>
                          <Monitor size="1.5rem" className="align-sub mx-sm" /> Via Draken
                        </>
                      );
                    case 'MINASIDOR':
                      return (
                        <>
                          <Monitor size="1.5rem" className="align-sub mx-sm" /> Via Mina sidor
                        </>
                      );
                    default:
                      return '';
                  }
                })()}
              </span>
            </div>
          </div>
          <div className="flex gap-8">
            <span
              className={cx(
                message.viewed ? 'bg-gray-200' : `bg-vattjom-surface-primary`,
                `self-center w-12 h-12 my-xs rounded-full flex items-center justify-center text-lg`
              )}
            ></span>
            <Button
              variant="ghost"
              iconButton
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              <Icon icon={expanded ? <SquareMinus /> : <SquarePlus />} />
            </Button>
          </div>
        </div>

        <div className="pl-xl flex justify-between items-start">
          <p
            className={cx(`my-0 text-primary`, message.viewed ? 'font-normal' : 'font-bold')}
            dangerouslySetInnerHTML={{
              __html: sanitized(message.subject || ''),
            }}
          ></p>
        </div>
        <div
          className={`message-${message.messageId} px-xl ${
            expanded ? '' : 'max-h-0 overflow-hidden'
          } transition-[max-height] ease-in-out`}
        >
          {message?.attachments && message?.attachments?.length > 0 ?
            <ul className="flex flex-wrap gap-sm items-center my-12">
              <Icon icon={<Paperclip />} size="1.6rem" />
              {message?.attachments?.map((a, idx) => (
                <Button
                  key={`${a.file}-${idx}`}
                  onClick={() => {
                    if (message.conversationId && message.messageId && a.id) {
                      getConversationAttachment(
                        municipalityId,
                        errand.id,
                        message.conversationId,
                        message.messageId,
                        a.id
                      )
                        .then((res) => {
                          if (res.data) {
                            const uri = `data:${a.file};base64,${res.data}`;
                            const link = document.createElement('a');
                            const filename = a.name;
                            link.href = uri;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
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
                    }
                  }}
                  role="listitem"
                  // eslint-disable-next-line jsx-a11y/alt-text
                  leftIcon={a.name.endsWith('pdf') ? <Icon icon={<Paperclip />} /> : <Icon icon={<Image />} />}
                  variant="tertiary"
                >
                  {a.name}
                </Button>
              ))}
            </ul>
          : null}
          <div className="my-18">
            <p
              className="my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg"
              dangerouslySetInnerHTML={{
                __html: sanitized(message?.message || ''),
              }}
            ></p>
          </div>
        </div>
      </div>
      <div className="ml-lg">{children}</div>
    </>
  );
};

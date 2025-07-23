import { AppContext } from '@contexts/app-context-interface';
import { MessageResponse } from '@interfaces/message';
import { Conversation, getConversationMessages, getConversations } from '@services/casedata-conversation-service';
import { isErrandLocked } from '@services/casedata-errand-service';
import { fetchMessages, fetchMessagesTree, setMessageViewStatus } from '@services/casedata-message-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, RadioButton, useSnackbar } from '@sk-web-gui/react';
import React, { useContext, useEffect, useState } from 'react';
import { MessageComposer } from './message-composer.component';
import MessageTreeComponent from './tree.component';

export const CasedataMessagesTab: React.FC<{
  setUnsaved: (unsaved: boolean) => void;
  update: () => void;
}> = (props) => {
  const { municipalityId, errand, messages, messageTree, setMessages, setMessageTree, conversation, setConversation } =
    useContext(AppContext);
  const [selectedMessage, setSelectedMessage] = useState<MessageResponse>();
  const [showMessageComposer, setShowMessageComposer] = useState<boolean>(false);
  const [sortMessages, setSortMessages] = useState<number>(0);
  const [sortedMessages, setSortedMessages] = useState(messages);
  const toastMessage = useSnackbar();
  const [allMessages, setAllMessages] = useState<MessageResponse[]>([]);

  useEffect(() => {
    const merged = [...(messages || []), ...(conversation || [])];
    const unique = merged.filter((msg, index, self) => index === self.findIndex((m) => m.messageId === msg.messageId));
    setAllMessages(unique);
  }, [messages, conversation]);

  const setMessageViewed = (msg: MessageResponse) => {
    if (msg?.conversationId) {
      console.warn('Not implemented'); //Unsure of how acknowledge for conversation messages will work
    } else {
      setMessageViewStatus(errand.id.toString(), municipalityId, msg?.messageId || '', true)
        .then(() =>
          fetchMessagesTree(municipalityId, errand).catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Något gick fel när meddelanden hämtades',
              status: 'error',
            });
          })
        )
        .then((result) => {
          if (Array.isArray(result)) {
            setMessageTree(result);
          }
        })
        .then(() =>
          fetchMessages(municipalityId, errand).catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: 'Något gick fel när meddelanden hämtades',
              status: 'error',
            });
          })
        )
        .then((result) => {
          if (Array.isArray(result)) {
            setMessages(result);
          }
        })
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Något gick fel när meddelandets status uppdaterades',
            status: 'error',
          });
        });
    }
  };

  useEffect(() => {
    if (errand && errand.errandNumber) {
      fetchMessages(municipalityId, errand)
        .then(setMessages)
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Något gick fel när meddelanden hämtades',
            status: 'error',
          });
        });
      fetchMessagesTree(municipalityId, errand)
        .then(setMessageTree)
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: 'Något gick fel när meddelanden hämtades',
            status: 'error',
          });
        });
      getConversations(municipalityId, errand.id)
        .then((res) => {
          Promise.all(
            res.data.map((conversation: Conversation) =>
              getConversationMessages(municipalityId, errand.id, conversation.id ?? '')
                .then((messages) => {
                  const allMessages = messages.data
                    .map((msgRes) =>
                      Array.isArray(msgRes) ? msgRes
                      : msgRes ? [msgRes]
                      : []
                    )
                    .flat();
                  setConversation(allMessages);
                })
                .catch((err) => {
                  console.error('Something went wrong when fetching message', err);
                })
            )
          );
        })
        .catch((err) => {
          console.error('getConversations failed', err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipalityId, errand]);

  useEffect(() => {
    if (allMessages && messageTree) {
      if (sortMessages === 1) {
        const filteredMessages = allMessages.filter((message) => message.direction === 'INBOUND');
        setSortedMessages(filteredMessages);
      } else if (sortMessages === 2) {
        const filteredMessages = allMessages.filter((message) => message.direction === 'OUTBOUND');
        setSortedMessages(filteredMessages);
      } else {
        setSortedMessages(allMessages);
      }
    }
  }, [allMessages, messageTree, sortMessages]);

  return (
    <>
      <div className="w-full py-24 px-32">
        <div className="w-full flex justify-between items-center flex-wrap h-40">
          <div className="inline-flex mt-ms gap-lg justify-start items-center flex-wrap">
            <h2 className="text-h4-sm md:text-h4-md">Meddelanden</h2>
          </div>
          <Button
            type="button"
            disabled={isErrandLocked(errand)}
            size="sm"
            variant="primary"
            color="vattjom"
            inverted={!isErrandLocked(errand)}
            rightIcon={<LucideIcon name="mail" size={18} />}
            onClick={() => {
              setSelectedMessage(undefined);
              setShowMessageComposer(true);
            }}
            data-cy="new-message-button"
          >
            Nytt meddelande
          </Button>
        </div>
        <div className="py-8 w-full gap-24">
          <p className="w-4/5 pr-16">
            På denna sida har du möjlighet att föra dialoger och säkerställa en smidig informationsutväxling med
            ärendets olika intressenter.
          </p>
        </div>

        <RadioButton.Group inline className="mt-16">
          <RadioButton value={0} defaultChecked={true} onChange={() => setSortMessages(0)}>
            Alla
          </RadioButton>
          <RadioButton value={1} onChange={() => setSortMessages(1)}>
            Mottagna
          </RadioButton>
          <RadioButton value={2} onChange={() => setSortMessages(2)}>
            Skickade
          </RadioButton>
        </RadioButton.Group>

        {sortedMessages?.length ?
          <MessageTreeComponent
            nodes={sortedMessages}
            onSelect={(msg: MessageResponse) => {
              setMessageViewed(msg);
              setSelectedMessage(msg);
            }}
            setShowMessageComposer={setShowMessageComposer}
          />
        : <>
            <Divider className="pt-24" />
            <p className="pt-24 text-dark-disabled">Inga meddelanden</p>
          </>
        }
      </div>
      <div className="h-xl"></div>
      <MessageComposer
        message={selectedMessage ?? ({} as MessageResponse)}
        show={showMessageComposer}
        closeHandler={() => {
          setTimeout(() => {
            setShowMessageComposer(false);
            setSelectedMessage(undefined);
          }, 0);
        }}
        setUnsaved={props.setUnsaved}
        update={props.update}
      />
    </>
  );
};

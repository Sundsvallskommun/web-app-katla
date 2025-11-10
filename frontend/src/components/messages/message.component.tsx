import { AppContext } from '@contexts/app-context-interface';
import { MessageResponse } from '@interfaces/message';
import { Conversation, getConversationMessages, getConversations } from '@services/casedata-conversation-service';
import { isErrandLocked } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, RadioButton } from '@sk-web-gui/react';
import React, { useContext, useEffect, useState } from 'react';
import { MessageComposer } from './message-composer.component';
import MessageTreeComponent from './tree.component';

export const CasedataMessagesTab: React.FC<{
  setUnsaved: (unsaved: boolean) => void;
  update: () => void;
}> = (props) => {
  const { municipalityId, errand, conversation, setConversation } = useContext(AppContext);
  const [selectedMessage, setSelectedMessage] = useState<MessageResponse>();
  const [showMessageComposer, setShowMessageComposer] = useState<boolean>(false);
  const [sortMessages, setSortMessages] = useState<number>(0);
  const [sortedMessages, setSortedMessages] = useState(conversation);

  const setMessageViewed = (msg: MessageResponse) => {
    console.warn('Not implemented', msg); //Unsure of how acknowledge for conversation messages will work
  };

  useEffect(() => {
    if (errand && errand.errandNumber) {
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
    if (conversation) {
      let filteredMessages = conversation;
      if (sortMessages === 1) {
        filteredMessages = conversation.filter((message) => message.direction === 'INBOUND');
      } else if (sortMessages === 2) {
        filteredMessages = conversation.filter((message) => message.direction === 'OUTBOUND');
      }

      const sorted = [...filteredMessages].sort((a, b) => {
        if (!a.sent || !b.sent) return 0;
        return new Date(b.sent).getTime() - new Date(a.sent).getTime();
      });
      setSortedMessages(sorted);
    }
  }, [sortMessages, conversation]);

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

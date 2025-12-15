import { AppContext } from '@contexts/app-context-interface';
import { Conversation, getConversationMessages, getConversations } from '@services/casedata-conversation-service';
import { isErrandLocked } from '@services/casedata-errand-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Divider, RadioButton, useThemeQueries } from '@sk-web-gui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MessageComposer } from './message-composer.component';
import MessageTreeComponent from './tree.component';

export const CasedataMessagesTab: React.FC<{
  setUnsaved: (unsaved: boolean) => void;
}> = (props) => {
  const { errand, conversation, setConversation } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const [sortMessages, setSortMessages] = useState(0);
  const [sortedMessages, setSortedMessages] = useState(conversation);

  const fetchMessages = useCallback(() => {
    if (errand && errand.errandNumber) {
      getConversations(errand.id)
        .then((res) => {
          Promise.all(
            res.data.map((conv: Conversation) =>
              getConversationMessages(errand.id, conv.id ?? '')
                .then((messages) => {
                  return messages.data
                    .map((msgRes) =>
                      Array.isArray(msgRes) ? msgRes
                      : msgRes ? [msgRes]
                      : []
                    )
                    .flat();
                })
                .catch(() => [])
            )
          ).then((allConversationMessages) => {
            const allMessages = allConversationMessages.flat();
            setConversation(allMessages);
          });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errand]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
      <div className={`w-full ${isMaxMediumDevice ? '' : 'px-32 py-24'}`}>
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
            onClick={() => setShowMessageComposer(true)}
            data-cy="new-message-button"
          >
            Nytt meddelande
          </Button>
        </div>
        <div className="py-8 w-full gap-24">
          <p className={isMaxMediumDevice ? 'w-full' : 'w-4/5 pr-16'}>
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
          <MessageTreeComponent nodes={sortedMessages} />
        : <>
            <Divider className="pt-24" />
            <p className="pt-24 text-dark-disabled">Inga meddelanden</p>
          </>
        }
      </div>
      <div className="h-xl"></div>
      <MessageComposer
        show={showMessageComposer}
        closeHandler={() => setShowMessageComposer(false)}
        setUnsaved={props.setUnsaved}
        update={fetchMessages}
      />
    </>
  );
};

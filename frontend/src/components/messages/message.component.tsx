import { AppContext } from '@contexts/app-context-interface';
import { Conversation, getConversationMessages, getConversations } from '@services/casedata-conversation-service';
import { isErrandLocked } from '@services/casedata-errand-service';
import { Divider, RadioButton, useThemeQueries } from '@sk-web-gui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MessageComposer } from './message-composer.component';
import MessageTreeComponent from './tree.component';

export const CasedataMessagesTab: React.FC = () => {
  const { municipalityId, errand, conversation, setConversation } = useContext(AppContext);
  const { isMaxMediumDevice } = useThemeQueries();
  const [sortMessages, setSortMessages] = useState(0);
  const [sortedMessages, setSortedMessages] = useState(conversation);

  const fetchMessages = useCallback(() => {
    if (errand && errand.errandNumber) {
      getConversations(municipalityId, errand.id)
        .then((res) => {
          Promise.all(
            res.data.map((conv: Conversation) =>
              getConversationMessages(municipalityId, errand.id, conv.id ?? '')
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
  }, [municipalityId, errand]);

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
    <div className={`w-full ${isMaxMediumDevice ? '' : 'px-32 py-24'}`}>
      <h2 className="text-h4-sm md:text-h4-md">Meddelanden</h2>

      {!isErrandLocked(errand) && <MessageComposer update={fetchMessages} />}

      <Divider className="my-24" />

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
  );
};

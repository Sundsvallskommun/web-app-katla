import React, { Fragment, useState } from 'react';
import { RenderedMessage } from './rendered-message.component';
import { Button, cx, Divider } from '@sk-web-gui/react';
import { MessageNode } from '@interfaces/message';
import { countAllMessages, countUnreadMessages } from '@services/casedata-conversation-service';

interface MessageTreeProps {
  nodes: MessageNode[];
}

const MessageNodeComponent: React.FC<{
  node: MessageNode;
  root?: boolean;
}> = ({ node, root = false }) => {
  const [showChildren, setShowChildren] = useState(true);

  return (
    <>
      <div className="m-md mr-0" id={`node-${node?.messageId}`}>
        <RenderedMessage message={node} root={root}>
          {root && node.children?.length ?
            <Button
              size="sm"
              className="text-small"
              variant="link"
              onClick={(e) => {
                e.preventDefault();
                setShowChildren(!showChildren);
              }}
            >
              {showChildren ?
                `Dölj svar`
              : `Visa svar (${countAllMessages(node.children)} varav ${countUnreadMessages(node.children)} ${
                  countUnreadMessages(node.children) === 1 ? 'oläst' : 'olästa'
                })`
              }
            </Button>
          : null}
        </RenderedMessage>
        {showChildren && node.children && node.children.length > 0 && (
          <div className={cx(root ? 'border-l' : 'border-l')}>
            {node.children.map((child, idx) => (
              <MessageNodeComponent
                key={`${idx}`}
                node={child}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const MessageTreeComponent: React.FC<MessageTreeProps> = ({ nodes }) => {
  return (
    <div className="my-lg" data-cy="message-container">
      {nodes.map((node, idx) => (
        <Fragment key={`${idx}`}>
          <Divider />
          <MessageNodeComponent node={node} root={true} />
        </Fragment>
      ))}
    </div>
  );
};

export default MessageTreeComponent;

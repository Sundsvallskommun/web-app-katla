
import { MessageNode } from '@interfaces/message';
import { Avatar } from '@sk-web-gui/react';

const getSenderInitials = (msg: MessageNode): string => {
  if ('firstName' in msg && 'lastName' in msg) {
    return `${msg.firstName?.[0]}${msg.lastName?.[0]}`;
  }
  return '@';
};

export const MessageAvatar: React.FC<{
  message: MessageNode;
}> = ({ message }) => {
  return (
    <Avatar
      rounded
      color={message.direction === 'OUTBOUND' ? 'juniskar' : 'bjornstigen'}
      size={'md'}
      initials={getSenderInitials(message)}
    />
  );
};

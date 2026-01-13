import { MessageNode } from '@interfaces/message';
import { Avatar, useThemeQueries } from '@sk-web-gui/react';

const getSenderInitials = (msg: MessageNode): string => {
  if ('firstName' in msg && 'lastName' in msg) {
    return `${msg.firstName?.[0]}${msg.lastName?.[0]}`;
  }
  return '@';
};

export const MessageAvatar: React.FC<{
  message: MessageNode;
}> = ({ message }) => {
  const { isMaxMediumDevice } = useThemeQueries();
  return (
    <Avatar
      rounded
      color={message.direction === 'OUTBOUND' ? 'juniskar' : 'bjornstigen'}
      size={isMaxMediumDevice ? 'sm' : 'md'}
      initials={getSenderInitials(message)}
    />
  );
};

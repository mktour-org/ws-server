import type { Message } from '@/types/ws-events';

export const errorMessage = (receivedMessage: Message) => {
  return JSON.stringify({
    type: 'error',
    data: receivedMessage,
  });
};

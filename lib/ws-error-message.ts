import type { Message } from "@/types/ws-events";

export const errorMessage = (text: string, receivedMessage: Message) => {
    const {type, ...message} = receivedMessage
    return JSON.stringify({
        type: 'error',
        body: {
          message:
            text,
          type,
          body: message
        },
      })
    };
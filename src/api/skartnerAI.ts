const skartnerAI = {
  chat: ({
    sessionId,
    userMessage,
  }: {
    sessionId: string;
    userMessage: string;
  }) => {
    return `/chat?session_id=${sessionId}&user_message=${userMessage}`;
  },
  chatHistory: (sessionId: string) => {
    return `/chat_history?session_id=${sessionId}`;
  },
  chatSessions: (sessionPrefix: string) => {
    return `/messages/sessions?prefix=${sessionPrefix}`;
  },
};
export default skartnerAI;

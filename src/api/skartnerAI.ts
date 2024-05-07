import env from "@/lib/env";
import axios from "axios";

const skartnerAI = {
  chat: async ({
    sessionId,
    userMessage,
  }: {
    sessionId: string;
    userMessage: string;
  }) => {
    const response = await axios.post(`${env.SKARTNER_AI}/chat`, {
      session_id: sessionId,
      user_message: userMessage,
    });
    return response.data;
  },
  chatHistory: (sessionId: string) => {
    const url = `/chat_history?session_id=${sessionId}`;
    return {
      key: [url],
      fn: async () => {
        const resonse = await axios.get(`${env.SKARTNER_AI}${url}`);
        return resonse.data;
      },
    };
  },
  chatSessions: (sessionPrefix: string) => {
    const url = `/messages/sessions?prefix=${sessionPrefix}`;
    return {
      key: [url],
      fn: async () => {
        const resonse = await axios.get(`${env.SKARTNER_AI}${url}`);
        return resonse.data;
      },
    };
  },
};
export default skartnerAI;

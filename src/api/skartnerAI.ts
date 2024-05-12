import env from "@/lib/env";
import axios from "axios";
export type AnswerEvaluatorType =
  | "gre_analyze_an_issue_task"
  | "ielts_writing_task_2"
  | "ielts_academic_writing_task_1"
  | "ielts_general_writing_task_1";
const skartnerAI = {
  chat: async ({
    sessionId,
    userMessage,
    filesAttachedUrls,
  }: {
    sessionId: string;
    userMessage: string;
    filesAttachedUrls: string[];
  }) => {
    const response = await axios.post(`${env.SKARTNER_AI}/chat`, {
      session_id: sessionId,
      user_message: userMessage,
      files_attached_urls: filesAttachedUrls,
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
  mergeText: async ({ first, second }: { first: string; second: string }) => {
    const response = await axios.post<string>(`${env.SKARTNER_AI}/merge_text`, {
      first,
      second,
    });
    const merged = response.data;
    // console.log({ first, second, merged });
    return merged;
  },
  answerEvaluator: async ({
    type,
    args,
  }: {
    type: AnswerEvaluatorType;
    args: any;
  }) => {
    const response = await axios.post<any>(
      `${env.SKARTNER_AI}/answer_evaluator`,
      {
        type,
        args,
      }
    );
    return response.data;
  },
};
export default skartnerAI;

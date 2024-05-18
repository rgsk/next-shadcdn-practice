import { AnswerEvaluatorType } from "@/api/skartnerAI";
import { GaEventType, trackGaEvent } from "./gaAnalytics";

const eventTracker = {
  answerEvaluated: ({
    type,
    task,
    image_url,
    attempt,
  }: {
    type: AnswerEvaluatorType;
    task: string;
    image_url?: string;
    attempt: string;
  }) => {
    trackGaEvent(GaEventType.answer_evaluated, {
      type,
      task,
      image_url,
      attempt,
    });
  },
};

export default eventTracker;

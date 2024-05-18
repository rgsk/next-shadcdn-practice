import { getAnalytics, logEvent } from "firebase/analytics";
import { firebaseApp } from "./firebaseApp";

export const trackGaEvent = (type: GaEventType, body: Record<string, any>) => {
  const analytics = getAnalytics(firebaseApp);
  logEvent(analytics, type, body);
};

export enum GaEventType {
  "answer_evaluated" = "answer_evaluated",
}

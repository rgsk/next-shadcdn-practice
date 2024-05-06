import skartnerAI from "@/api/skartnerAI";
import env from "@/lib/env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
interface ChatPageProps {}
const ChatPage: React.FC<ChatPageProps> = ({}) => {
  const router = useRouter();
  const { email, sessionSuffix } = router.query;
  const chatSessionsUrl = skartnerAI.chatSessions(`${email}/`);
  const chatSessionsQuery = useQuery({
    queryKey: [chatSessionsUrl],
    queryFn: () => axios.get(`${env.SKARTNER_AI}${chatSessionsUrl}`),
  });
  const sessionIds = chatSessionsQuery.data?.data;
  const chatHistoryUrl = skartnerAI.chatHistory(`${email}/${sessionSuffix}`);
  const chatHistoryQuery = useQuery({
    queryKey: [chatHistoryUrl],
    queryFn: () => axios.get(`${env.SKARTNER_AI}${chatHistoryUrl}`),
  });
  const messages = chatHistoryQuery.data?.data.messages;
  return (
    <div className="bg-[#212121] h-screen w-screen">
      {messages?.map((item: any, i: any) => (
        <div key={i}>
          <p>{item.type}</p>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
};
export default ChatPage;

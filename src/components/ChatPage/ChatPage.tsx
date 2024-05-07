import skartnerAI from "@/api/skartnerAI";
import useResizeObserver from "@/hooks/useResizeObserver";
import useWindowSize from "@/hooks/useWindowSize";
import { getUploadURL, getUrlFromUploadUrl } from "@/lib/s3Utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import RenderMessages, { OpenAILogo } from "./Children/RenderMessages";
export type Message = { type: "human" | "ai"; content: string };
interface ChatPageProps {}
const ChatPage: React.FC<ChatPageProps> = ({}) => {
  const router = useRouter();
  const { email, sessionSuffix } = router.query;
  const [text, setText] = useState("");
  const sessionId = `${email}/${sessionSuffix}`;
  const chatSessionsQuery = skartnerAI.chatSessions(`${email}/`);
  const chatSessionsQueryResult = useQuery({
    queryKey: chatSessionsQuery.key,
    queryFn: chatSessionsQuery.fn,
  });
  const [filesAttachedUrls, setFilesAttachedUrls] = useState<string[]>([]);
  const sessionIds = chatSessionsQueryResult.data;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageInputContainerRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const messageInputContainer = useResizeObserver(messageInputContainerRef);
  const chatHistoryQuery = skartnerAI.chatHistory(`${email}/${sessionSuffix}`);
  const chatHistoryQueryResult = useQuery({
    queryKey: chatHistoryQuery.key,
    queryFn: chatHistoryQuery.fn,
  });
  const [messages, setMessages] = useState<Message[]>();
  useEffect(() => {
    setMessages(chatHistoryQueryResult.data?.messages);
  }, [chatHistoryQueryResult.data?.messages]);
  const chatMutation = useMutation({
    mutationFn: skartnerAI.chat,
    onSuccess: () => {
      chatHistoryQueryResult.refetch();
    },
  });
  const scrollToBottom = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight - scrollContainer.clientHeight,
      });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = () => {
    chatMutation.mutate({ sessionId, userMessage: text, filesAttachedUrls });
    setMessages((prev) => [...(prev ?? []), { type: "human", content: text }]);
    setText("");
  };

  return (
    <div className="flex bg-[#212121] h-screen overflow-hidden">
      {/* <div className="min-w-[400px]"></div> */}
      <div className="flex-1">
        <div className="">
          <div
            className="overflow-auto flex justify-center"
            style={{
              height:
                windowSize.windowHeight - (messageInputContainer?.height ?? 0),
            }}
            ref={scrollContainerRef}
          >
            <div className="w-[800px]">
              {messages && messages.length ? (
                <>
                  <div className="h-[30px]"></div>
                  <RenderMessages messages={messages} />
                  <div className="h-[30px]"></div>{" "}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="border border-gray-600 rounded-full p-1.5">
                      <OpenAILogo className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl">How can I help you today?</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            multiple
            onChange={async (event) => {
              const files = event.target.files;

              const fileUrls = await Promise.all(
                [...(files ?? [])].map(async (file) => {
                  const uploadUrl = await getUploadURL({ key: file.name });
                  await axios.put(uploadUrl, file);
                  const fileUrl = getUrlFromUploadUrl(uploadUrl);
                  return fileUrl;
                })
              );
              setFilesAttachedUrls(fileUrls);
            }}
          />
          <div className="flex justify-center">
            <div ref={messageInputContainerRef} className="w-[800px]">
              <form
                className="relative flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message"
                  className="w-full resize-none border border-gray-400 focus:outline-none rounded-xl py-[15px] pl-6"
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    className="p-0 aspect-square rounded-lg"
                    type="submit"
                  >
                    <UpArrow />
                  </Button>
                </div>
              </form>
              <div className="h-[30px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;

interface UpArrowProps {}
const UpArrow: React.FC<UpArrowProps> = ({}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white dark:text-black"
    >
      <path
        d="M7 11L12 6L17 11M12 18V7"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  );
};

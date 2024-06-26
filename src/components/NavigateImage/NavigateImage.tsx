/* eslint-disable @next/next/no-img-element */
import useLocalStorageState from "@/hooks/useLocalStorageState";
import useResizeObserver from "@/hooks/useResizeObserver";
import useWindowSize from "@/hooks/useWindowSize";
import env from "@/lib/env";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "../ui/button";
export type MarkedPosition = {
  text: string;
  position: {
    top: string;
    left: string;
  };
};
interface NavigateImageProps {}
const NavigateImage: React.FC<NavigateImageProps> = ({}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { edit } = router.query;
  const topBarRect = useResizeObserver(topBarRef);
  const windowSize = useWindowSize();
  const [markedPositions, setMarkedPositions] = useLocalStorageState<
    MarkedPosition[]
  >("markedPositions", []);
  const [queryText, setQueryText] = useState("");
  const [position, setPosition] = useState({ top: "0%", left: "0%" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const sendQuery = async (user_query: string) => {
    setError(false);
    setLoading(true);
    const result = await axios.get(
      `${env.SKARTNER_AI}/navigate_image?user_query=${user_query}`
    );
    console.log("result.data", result.data);
    if (
      result.data.content.top === "-1%" &&
      result.data.content.left === "-1%"
    ) {
      setError(true);
    } else {
      setPosition(result.data.content);
    }
    setLoading(false);
  };

  const [transcriptsFinal, setTranscriptsFinal] = useState("");

  useEffect(() => {
    if (transcriptsFinal) {
      sendQuery(transcriptsFinal);
    }
  }, [transcriptsFinal]);

  const startConverting = useCallback(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      var speechRecognizer = new window.webkitSpeechRecognition();
      // speechRecognizer.continuous = true;
      // speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";
      speechRecognizer.start();
      setSpeaking(true);

      var finalTranscripts = "";
      // @ts-ignore
      speechRecognizer.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          transcript.replace("\n", "<br>");
          finalTranscripts += transcript;
        }
        setTranscriptsFinal(finalTranscripts);
      };

      speechRecognizer.onspeechend = () => {
        setSpeaking(false);
      };
    } else {
      alert(
        "Your browser is not supported. Please download Google chrome or Update your Google chrome!!"
      );
    }
  }, []);

  return (
    <div>
      <div ref={topBarRef} className="p-2">
        <div className="h-[10px]"></div>
        <div>
          <form
            className="flex gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setQueryText("");
              if (transcriptsFinal === queryText) {
                setTranscriptsFinal("");
                setTimeout(() => {
                  setTranscriptsFinal(queryText);
                });
              } else {
                setTranscriptsFinal(queryText);
              }
            }}
          >
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="border border-purple-300 px-2 w-[300px] rounded-md"
              placeholder="button or text"
            />
            <Button type="submit" disabled={loading}>
              Send
            </Button>
          </form>
        </div>
        <div className="h-[10px]"></div>
        <div className="flex items-center gap-[20px]">
          <Button onClick={startConverting} disabled={loading}>
            {speaking ? (
              <div className="w-[15px] h-[15px] rounded-full bg-red-500"></div>
            ) : (
              <img src="/microphone.png" alt="" className="w-[20px]" />
            )}
          </Button>
          <p>
            <span>{transcriptsFinal}</span>{" "}
          </p>
          <ClipLoader
            color={"#fff"}
            loading={loading}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          {error && <p className="text-red-500">Not Found</p>}
        </div>
        <div className="h-[10px]"></div>
      </div>
      <div
        className="flex"
        style={{ height: windowSize.windowHeight - (topBarRect?.height ?? 0) }}
      >
        <div
          ref={divRef}
          className="h-full relative"
          onClick={(e) => {
            if (edit == "true") {
              const divE = divRef.current!;
              const rect = divE.getBoundingClientRect();

              const leftOffset = Math.floor(
                ((e.clientX - rect.x) / rect.width) * 100
              );
              const topOffset = Math.floor(
                ((e.clientY - rect.y) / rect.height) * 100
              );

              const text = prompt();
              if (text) {
                const newValue = {
                  text,
                  position: { top: `${topOffset}%`, left: `${leftOffset}%` },
                };
                setMarkedPositions([...markedPositions, newValue]);
              }
            }
          }}
        >
          <div
            className="absolute h-[20px] w-[20px] rounded-full bg-red-500 opacity-80"
            style={{
              top: position.top,
              left: position.left,
            }}
          ></div>
          <img src="/form_image.png" alt="form image" className="h-full" />
        </div>
      </div>
    </div>
  );
};
export default NavigateImage;

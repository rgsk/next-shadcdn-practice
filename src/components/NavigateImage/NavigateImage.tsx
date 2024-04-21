/* eslint-disable @next/next/no-img-element */
import useResizeObserver from "@/hooks/useResizeObserver";
import useWindowSize from "@/hooks/useWindowSize";
import env from "@/lib/env";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "../ui/button";

interface NavigateImageProps {}
const NavigateImage: React.FC<NavigateImageProps> = ({}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const topBarRect = useResizeObserver(topBarRef);
  const windowSize = useWindowSize();
  const [values, setValues] = useState<any[]>([]);
  const [queryText, setQueryText] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const sendQuery = async (user_query: string) => {
    setError(false);
    setLoading(true);
    const result = await axios.get(
      `${env.SKARTNER_AI}/navigate_image?user_query=${user_query}`
    );
    const content = result.data;
    console.log("result.data", result.data);
    try {
      const [top, left] = JSON.parse(content.content);
      setPosition({ top, left });
    } catch (e) {
      setError(true);
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
          {error && <p className="text-red-500">Error</p>}
        </div>
        <div className="h-[10px]"></div>
      </div>
      <div
        className="flex"
        style={{ height: windowSize.windowHeight - (topBarRect?.height ?? 0) }}
      >
        <div
          ref={divRef}
          className="h-full relative border border-red-500"
          onClick={(e) => {
            const divE = divRef.current!;
            const width = divE.clientWidth ?? 0;
            const height = divE.clientHeight ?? 0;
            const leftOffset = Math.floor((e.clientX / width) * 100);
            const topOffset = Math.floor((e.clientY / height) * 100);

            // const text = prompt();
            // const newValue = {
            //   text,
            //   position: { top: `${topOffset}%`, left: `${leftOffset}%` },
            // };
            // console.log(newValue);
            // setValues([...values, newValue]);
          }}
        >
          <div
            className="absolute h-[20px] w-[20px] rounded-full bg-red-500 opacity-80"
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
          ></div>
          <img src="/form_image.png" alt="form image" className="h-full" />
        </div>
      </div>
    </div>
  );
};
export default NavigateImage;

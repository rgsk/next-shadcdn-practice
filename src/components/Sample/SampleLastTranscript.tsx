import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

interface SampleLastTranscriptProps {}
const SampleLastTranscript: React.FC<SampleLastTranscriptProps> = ({}) => {
  const [speaking, setSpeaking] = useState(false);
  const [transcriptsFinal, setTranscriptsFinal] = useState("");
  const stopRecognizerRef = useRef<any>();
  const startConverting = useCallback(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      var speechRecognizer = new window.webkitSpeechRecognition();
      speechRecognizer.continuous = true;
      //   speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";
      speechRecognizer.start();

      // @ts-ignore
      speechRecognizer.onresult = function (event) {
        setTranscriptsFinal(
          event.results[event.results.length - 1][0].transcript
        );
      };
      stopRecognizerRef.current = speechRecognizer;
    } else {
      alert(
        "Your browser is not supported. Please download Google chrome or Update your Google chrome!!"
      );
    }
  }, []);
  return (
    <div className="p-4">
      <Button
        onClick={() => {
          if (speaking) {
            if (stopRecognizerRef.current) {
              setSpeaking(false);
              stopRecognizerRef.current.stop();
            }
          } else {
            setSpeaking(true);
            startConverting();
          }
        }}
      >
        {speaking ? (
          <div>
            <div className="h-[20px] w-[20px] rounded-sm border-2 border-black"></div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="w-[20px] h-[20px] rounded-full bg-red-500"></div>
        )}
      </Button>
      <div className="h-[10px]"></div>
      <p className="text-xl">Transcripts</p>
      <div className="h-[10px]"></div>
      <p>{transcriptsFinal}</p>
    </div>
  );
};
export default SampleLastTranscript;

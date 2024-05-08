import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

export const useTranscripts = () => {
  const [speaking, setSpeaking] = useState(false);
  const [finalTranscripts, setFinalTranscripts] = useState("");
  const [interimTranscripts, setInterimTranscripts] = useState("");

  const stopRecognizerRef = useRef<any>();
  const startConverting = useCallback(() => {
    // @ts-ignore
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      var speechRecognizer = new window.webkitSpeechRecognition();
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";
      speechRecognizer.start();

      // @ts-ignore
      speechRecognizer.onresult = function (event) {
        var _finalTranscripts = "";
        var _interimTranscripts = "";
        const _finalTranscriptsList: string[] = [];
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          //   transcript.replace("\n", "<br>");
          if (event.results[i].isFinal) {
            // console.log("final", transcript);
            _finalTranscripts += transcript;
          } else {
            // console.log("interim", transcript);
            _interimTranscripts += transcript;
          }
          if (event.results[i].isFinal) {
            _finalTranscriptsList.push(transcript);
          }
        }
        setFinalTranscripts(_finalTranscripts);
        setInterimTranscripts(_interimTranscripts);
      };
      stopRecognizerRef.current = speechRecognizer;
      speechRecognizer.onspeechend = () => {
        setSpeaking(false);
      };
    } else {
      alert(
        "Your browser is not supported. Please download Google chrome or Update your Google chrome!!"
      );
    }
  }, []);
  return {
    toggleTranscribe: () => {
      if (speaking) {
        if (stopRecognizerRef.current) {
          setSpeaking(false);
          stopRecognizerRef.current.stop();
        }
      } else {
        setSpeaking(true);
        startConverting();
      }
    },
    finalTranscripts,
    interimTranscripts,
    speaking,
  };
};

interface SampleUseTranscriptsProps {}
const SampleUseTranscripts: React.FC<SampleUseTranscriptsProps> = ({}) => {
  const { finalTranscripts, interimTranscripts, speaking, toggleTranscribe } =
    useTranscripts();
  return (
    <div>
      <Button onClick={toggleTranscribe}>
        {speaking ? (
          <div>
            <div className="h-[20px] w-[20px] rounded-sm border-2 border-black"></div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="w-[20px] h-[20px] rounded-full bg-red-500"></div>
        )}
      </Button>
      <p>
        {finalTranscripts}
        <span className="text-[#999]">{interimTranscripts}</span>
      </p>
    </div>
  );
};
export default SampleUseTranscripts;

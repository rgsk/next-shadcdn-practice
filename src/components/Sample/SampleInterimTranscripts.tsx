import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";

interface SampleInterimTranscriptsProps {}
const SampleInterimTranscripts: React.FC<
  SampleInterimTranscriptsProps
> = ({}) => {
  const [speaking, setSpeaking] = useState(false);
  const [transcriptsFinal, setTranscriptsFinal] = useState("");
  const [transcriptsInterim, setTranscriptsInterim] = useState("");
  const [finalTranscriptsList, setFinalTranscriptsList] = useState<string[]>(
    []
  );
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
      var finalTranscripts = "";

      // @ts-ignore
      speechRecognizer.onresult = function (event) {
        var interimTranscripts = "";
        const _finalTranscriptsList: string[] = [];
        console.log(event.results);
        console.log(event.resultIndex);
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          //   transcript.replace("\n", "<br>");
          if (event.results[i].isFinal) {
            // console.log("final", transcript);
            finalTranscripts += transcript;
          } else {
            // console.log("interim", transcript);
            interimTranscripts += transcript;
          }
          if (event.results[i].isFinal) {
            _finalTranscriptsList.push(transcript);
          }
        }
        setFinalTranscriptsList((prev) => [...prev, ..._finalTranscriptsList]);
        setTranscriptsFinal(finalTranscripts);
        setTranscriptsInterim(interimTranscripts);
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
      <p>
        {transcriptsFinal}
        <span className="text-[#999]">{transcriptsInterim}</span>
      </p>

      <div className="h-[20px]"></div>
      <p>List:</p>
      <div className="h-[20px]"></div>
      <div>
        <div>
          {finalTranscriptsList.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SampleInterimTranscripts;

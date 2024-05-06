import { useState } from "react";
import { Button } from "../ui/button";

interface TextToSpeechExampleProps {}
const TextToSpeechExample: React.FC<TextToSpeechExampleProps> = ({}) => {
  return (
    <div>
      <WebSpeechAPITextToSpeech />
    </div>
  );
};
export default TextToSpeechExample;

const initialText =
  "Hello! Feel free to change this text and don't forget to turn your volume on.";
interface WebSpeechAPITextToSpeechProps {}
const WebSpeechAPITextToSpeech: React.FC<
  WebSpeechAPITextToSpeechProps
> = ({}) => {
  const [text, setText] = useState(initialText);
  return (
    <div className="flex flex-col items-start p-4">
      <textarea
        className="border border-white rounded-lg h-[100px] w-full max-w-[400px] p-4"
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="h-[20px]"></div>
      <Button
        onClick={() => {
          // stop any speaking in progress
          window.speechSynthesis.cancel();

          // speak text
          const utterance = new SpeechSynthesisUtterance(text);
          window.speechSynthesis.speak(utterance);
        }}
      >
        Speak Text
      </Button>
    </div>
  );
};

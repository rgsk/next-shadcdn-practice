import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
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
const webSpeechVoice = "web speech voice";
const textToSpeechVoices = [
  webSpeechVoice,
  "nova",
  "alloy",
  "echo",
  "fable",
  "onyx",
  "shimmer",
];

enum Methods {
  buffer = "buffer",
  "upload-url" = "upload-url",
}

const initialText =
  "Hello! Feel free to change this text and don't forget to turn your volume on.";
interface WebSpeechAPITextToSpeechProps {}
const WebSpeechAPITextToSpeech: React.FC<
  WebSpeechAPITextToSpeechProps
> = ({}) => {
  const [text, setText] = useState(initialText);
  const [voiceName, setVoiceName] = useState(webSpeechVoice);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState(Methods.buffer);

  return (
    <div className="flex flex-col items-start p-4">
      <textarea
        className="border border-white rounded-lg h-[100px] w-full max-w-[400px] p-4"
        placeholder="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="h-[20px]"></div>
      <Select value={voiceName} onValueChange={(v) => setVoiceName(v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Voice" />
        </SelectTrigger>
        <SelectContent>
          {textToSpeechVoices.map((voice) => (
            <SelectItem key={voice} value={voice}>
              {voice == webSpeechVoice ? "" : "openai -"} {voice}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="h-[20px]"></div>
      <Button
        onClick={async () => {
          setAudioUrl(undefined);
          if (voiceName === webSpeechVoice) {
            // stop any speaking in progress
            window.speechSynthesis.cancel();

            // speak text
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
          } else {
            setLoading(true);

            if (method == Methods.buffer) {
              const response = await axios.post(
                "http://localhost:8000/general/text-to-speech-buffer",
                {
                  input: text,
                  voice: voiceName,
                },
                { responseType: "arraybuffer" }
              );
              const data = response.data;
              const blob = new Blob([data]);
              const localUrl = URL.createObjectURL(blob);
              setLoading(false);
              setAudioUrl(localUrl);
            } else {
              const response = await axios.post(
                "http://localhost:8000/general/text-to-speech",
                {
                  input: text,
                  voice: voiceName,
                }
              );
              const data = response.data;
              setLoading(false);
              setAudioUrl(data.url);
            }
          }
        }}
      >
        {voiceName === webSpeechVoice ? "Speak Text" : "Generate"}
      </Button>
      <div className="h-[20px]"></div>
      <ClipLoader
        color={"#fff"}
        loading={loading}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="h-[20px]"></div>
      {audioUrl && (
        <>
          <audio id="audioPlayer" controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
          <div className="h-[20px]"></div>
          <p>Audio Url: </p>
          <p>{audioUrl}</p>
          <div className="h-[20px]"></div>
        </>
      )}
      {voiceName === webSpeechVoice ? null : (
        <>
          <div className="h-[1px] w-full bg-gray-300"></div>
          <div className="h-[20px]"></div>
          <p>Upload Method:</p>
          <div className="h-[20px]"></div>
          <RadioGroup
            value={method}
            onValueChange={(v) => setMethod((Methods as any)[v])}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Methods.buffer} id={Methods.buffer} />
              <Label htmlFor={Methods.buffer}>Buffer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={Methods["upload-url"]}
                id={Methods["upload-url"]}
              />
              <Label htmlFor={Methods["upload-url"]}>Upload Url</Label>
            </div>
          </RadioGroup>
        </>
      )}
    </div>
  );
};

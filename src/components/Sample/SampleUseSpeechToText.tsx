"use client";
import { Button } from "@/components/ui/button";
import env from "@/lib/env";
import axios from "axios";
import { useRef, useState } from "react";
import GenerateRadio from "../Shared/GenerateRadio";
type SpeechToTextType = "transcription" | "translation";
export const useSpeechToText = (type: SpeechToTextType = "transcription") => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [text, setText] = useState<string>();
  const resetFields = () => {
    setText(undefined);
    setAudioUrl(undefined);
  };
  const handleStartRecording = () => {
    resetFields();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          handleDownload(event.data);
        };
        mediaRecorder.start();
        setRecording(true);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleDownload = async (blob: Blob) => {
    const localUrl = URL.createObjectURL(blob);
    setAudioUrl(localUrl);
    const formData = new FormData();
    formData.append("audio", blob);
    const response = await axios.post(
      `${env.SKARTNER_SERVER}/general/speech-to-text?&type=${type}`,
      formData
    );
    setText(response.data.text);
  };
  return {
    recording,
    handleStartRecording,
    handleStopRecording,
    text,
    audioUrl,
  };
};

const SampleUseSpeechToText = () => {
  const [type, setType] = useState<SpeechToTextType>("transcription");
  const {
    handleStartRecording,
    handleStopRecording,
    recording,
    text,
    audioUrl,
  } = useSpeechToText(type);
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Button onClick={handleStartRecording} disabled={recording}>
          Start Recording
        </Button>
        <Button onClick={handleStopRecording} disabled={!recording}>
          Stop Recording
        </Button>
      </div>
      <div className="h-[20px]"></div>

      <p>{text}</p>
      <div className="h-[20px]"></div>
      <GenerateRadio
        options={[
          { value: "transcription", label: "Transcription" },
          { value: "translation", label: "Translation" },
        ]}
        value={type}
        onValueChange={(v) => {
          setType(v as any);
        }}
      />
      <div className="h-[20px]"></div>
      <p>{audioUrl}</p>
      <div className="h-[20px]"></div>
      <audio controls src={audioUrl} />
      <div className="h-[20px]"></div>
    </div>
  );
};
export default SampleUseSpeechToText;

"use client";
import { Button } from "@/components/ui/button";
import env from "@/lib/env";
import axios from "axios";
import { useRef, useState } from "react";

export const useSpeechToText = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string>();
  const [translation, setTranslation] = useState<string>();
  const resetFields = () => {
    setTranscription(undefined);
    setTranslation(undefined);
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
    const formData = new FormData();
    formData.append("audio", blob);
    const response = await axios.post(
      `${env.SKARTNER_SERVER}/general/speech-to-text`,
      formData
    );
    setTranscription(response.data.transcription);
    setTranslation(response.data.translation);
  };
  return {
    recording,
    handleStartRecording,
    handleStopRecording,
    transcription,
    translation,
  };
};

const SampleUseSpeechToText = () => {
  const {
    handleStartRecording,
    handleStopRecording,
    recording,
    transcription,
    translation,
  } = useSpeechToText();
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
      <p>Transcription: </p>
      <div className="h-[20px]"></div>
      <p>{transcription}</p>
      <div className="h-[20px]"></div>
      <p>Translation: </p>
      <div className="h-[20px]"></div>
      <p>{translation}</p>
    </div>
  );
};
export default SampleUseSpeechToText;

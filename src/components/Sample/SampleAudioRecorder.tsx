"use client";
import { Button } from "@/components/ui/button";
import {
  getPresignedUrl,
  getUploadURL,
  getUrlFromUploadUrl,
} from "@/lib/s3Utils";
import axios from "axios";
import { useRef, useState } from "react";
const SampleAudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [remoteUrl, setRemoteUrl] = useState<string>();

  const handleStartRecording = () => {
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
    const extension = blob.type.split(";")[0].split("/")[1];
    const filename = "sample-audio-" + Date.now() + "." + extension;
    const uploadUrl = await getUploadURL({ key: filename });
    await axios.put(uploadUrl, blob);
    const fileUrl = getUrlFromUploadUrl(uploadUrl);
    const presignedUrl = await getPresignedUrl(fileUrl);
    setRemoteUrl(presignedUrl);
  };

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
      <p>Local Url: </p>
      <div className="h-[20px]"></div>
      <p>{audioUrl}</p>
      <div className="h-[20px]"></div>

      <audio controls src={audioUrl} />
      <div className="h-[20px]"></div>

      <p>Remote Url: </p>
      <div className="h-[20px]"></div>

      <p>{remoteUrl}</p>
      <div className="h-[20px]"></div>

      <audio controls src={remoteUrl} />
    </div>
  );
};
export default SampleAudioRecorder;

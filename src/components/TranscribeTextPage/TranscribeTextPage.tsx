/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ResizableBox } from "react-resizable";
import ClipLoader from "react-spinners/ClipLoader";

interface TranscribeTextPageProps {}
const TranscribeTextPage: React.FC<TranscribeTextPageProps> = ({}) => {
  const [] = useState();
  return (
    <div>
      <FileUploadForm />
    </div>
  );
};
export default TranscribeTextPage;

import env from "@/lib/env";
import axios from "axios";
import React from "react";

function FileUploadForm() {
  const [file, setFile] = useState<File | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFile(event.target.files?.[0]);
  };

  useEffect(() => {
    (async () => {
      if (file) {
        setTranscribedText("");
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        const result = await axios.post(
          `${env.SKARTNER_AI}/transcribe_handwritten_text`,
          formData
        );
        const text = result.data.content;
        setTranscribedText(text);
        setLoading(false);
      }
    })();
  }, [file]);

  return (
    <div className="p-6">
      <h1 className="text-3xl">Transcribe Handwritten Text</h1>
      <div className="h-[30px]"></div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="h-[30px]"></div>
      <div className="h-[30px]"></div>
      {file && (
        <ResizableBox width={600} height={450}>
          <img
            src={URL.createObjectURL(file)}
            alt="image"
            className="w-full h-full object-contain object-right-bottom"
          />{" "}
        </ResizableBox>
      )}
      <div className="h-[30px]"></div>
      <ClipLoader
        color={"#fff"}
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />{" "}
      {transcribedText && (
        <div>
          <p className="text-xl">Transcribed Text: </p>
          <div className="h-[20px]"></div>
          <p
            dangerouslySetInnerHTML={{
              __html: transcribedText.replace(/(\r\n|\n)/g, "<br />"),
            }}
          />
        </div>
      )}
    </div>
  );
}

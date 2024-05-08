"use client";
import React from "react";
import SampleGenerateOpenAITranscripts from "../Sample/SampleGenerateOpenAITranscripts";

interface PracticePageProps {}
const PracticePage: React.FC<PracticePageProps> = ({}) => {
  return (
    <div>
      <SampleGenerateOpenAITranscripts />
    </div>
  );
};
export default PracticePage;

"use client";
import React from "react";
import TextToSpeechExample from "../TextToSpeechExample/TextToSpeechExample";

interface PracticePageProps {}
const PracticePage: React.FC<PracticePageProps> = ({}) => {
  return (
    <div>
      <TextToSpeechExample />
    </div>
  );
};
export default PracticePage;

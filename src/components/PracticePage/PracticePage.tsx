"use client";
import React from "react";
import SampleUseSpeechToText from "../Sample/SampleUseSpeechToText";

interface PracticePageProps {}
const PracticePage: React.FC<PracticePageProps> = ({}) => {
  return (
    <div>
      <SampleUseSpeechToText />
    </div>
  );
};
export default PracticePage;

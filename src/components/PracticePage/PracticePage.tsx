"use client";
import React from "react";
import SampleAudioRecorder from "../Sample/SampleAudioRecorder";

interface PracticePageProps {}
const PracticePage: React.FC<PracticePageProps> = ({}) => {
  return (
    <div>
      <SampleAudioRecorder />
    </div>
  );
};
export default PracticePage;

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import openAI from "@/server/openAI";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const textToSpeechSchema = z.object({
  input: z.string(),
  voice: z.enum(["nova", "alloy", "echo", "fable", "onyx", "shimmer"]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { input, voice } = textToSpeechSchema.parse(req.body);
    const mp3 = await openAI.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: input,
    });
    const arrayBuffer = await mp3.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  }
}

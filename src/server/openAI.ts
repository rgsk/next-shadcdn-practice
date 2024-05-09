import { OpenAI } from "openai";

const openAI = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

export default openAI;

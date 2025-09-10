import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { interviewCovers } from "@/constants";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  // Debug: Check if API key is loaded
  console.log("API Key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  console.log("API Key length:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length);
  console.log("All env vars:", Object.keys(process.env).filter(key => key.includes('GOOGLE')));
  console.log("NODE_ENV:", process.env.NODE_ENV);

  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyC4Xhbtexxlm0Py1HzWM8mszLbnwFzqTT0";
    console.log("Using API key:", apiKey ? "Found" : "Not found");

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Generate random cover image inline to avoid import issues
    const randomIndex = Math.floor(Math.random() * interviewCovers.length);
    const coverImage = `/covers${interviewCovers[randomIndex]}`;

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: coverImage,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
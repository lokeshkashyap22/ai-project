import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_API,
});

export async function POST(req: NextRequest) {
  try {
    // Extract the question from the request body
    const { askedQuestion } = await req.json();

    // Validate the input
    if (!askedQuestion) {
      return NextResponse.json(
        { message: "Question is required" },
        { status: 400 }
      );
    }

    // Call Groq's API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: askedQuestion,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false,
    });

    // Extract the response content
    const responseContent =
      chatCompletion.choices[0]?.message?.content || "No response";

    // Return the response content as JSON
    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    console.error("Error in Groq API:", error);
    return NextResponse.json(
      { message: "Something went wrong, try again..." },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};

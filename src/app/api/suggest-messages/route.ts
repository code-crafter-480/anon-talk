import OpenAI from "openai";
// import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai'
import { NextResponse } from "next/server";
const { Configuration, OpenAiApi } = require("openai")

// Create an OpenAI API client (that's edge friendly)
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAiApi(configuration)

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
    try {
        
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curisity, and contribute to a positive and welcoming conversational enviourment."

        // Ask OpenAI for a streaming chat completion given the prompt
        // const response = await generateText({
        //     model: openai('gpt-3.5-turbo-instruct'),
        //     max_tokens: 2000,
        //     stream: true,
        //     prompt
        // });

        const response = await openai.createCompltion({
            model: 'gpt-3.5-turbo-instruct',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 400,
            stream: true,
        });
    
        return response.toDataStreamResponse();

    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error        // API key thik moto na pouchale 'headers' error asbe... 
            return NextResponse.json({
                name, status, headers, message
            }, {status})
        } else {
            console.error("An unexpected error occured ", error)
            throw error
        }
    }

}


import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { aiRole } from "../types/roles";

export const initOpentAI = (apiKey: string): OpenAI => {
    return new OpenAI({
        apiKey: apiKey,
      });
}

export const callOpenAI = async <T>(messages: ChatCompletionMessageParam[], openai: OpenAI): Promise<T> => {
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: "json_object" },
        messages,
    });

    return JSON.parse(chat.choices[0].message.content!) as T;
}

export const addMessages = (messages: ChatCompletionMessageParam[], role: aiRole, content: string | object) => {
    messages.push({
        role,
        content: typeof content === 'string' ? content : JSON.stringify(content),
    });
}

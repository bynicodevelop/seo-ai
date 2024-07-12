import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { aiRole } from "../types/roles";

export const initOpentAI = (apiKey: string): OpenAI => {
    return new OpenAI({
        apiKey: apiKey,
    });
}

export const callOpenAI = async <T>(
    messages: ChatCompletionMessageParam[],
    openai: OpenAI,
    type: "json_object" | "text" | undefined = 'json_object'
): Promise<T> => {
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type },
        messages,
    });

    return type === 'json_object' ? JSON.parse(chat.choices[0].message.content!) as T : chat.choices[0].message.content as T;
}

export const addMessages = (messages: ChatCompletionMessageParam[], role: aiRole, content: string | object) => {
    messages.push({
        role,
        content: typeof content === 'string' ? content : JSON.stringify(content),
    });
}

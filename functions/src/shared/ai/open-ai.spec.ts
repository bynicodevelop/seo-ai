import type { ChatCompletionMessageParam } from 'openai/resources';
import {
 describe, it, expect 
} from 'vitest';

import { addMessages } from './open-ai';

describe(
    'open-ai',
    () => {
        it(
            'Doit ajouter un message',
            () => {
                const messages: ChatCompletionMessageParam[] = [];
                addMessages(
                    messages,
                    'user',
                    'Hello'
                );
                expect(
                    messages
                ).toEqual(
                    [{
 role: 'user',
content: 'Hello' 
}]
                );
            }
        );

        it(
            'Doit ajouter 2 messages',
            () => {
                const messages: ChatCompletionMessageParam[] = [];
                addMessages(
                    messages,
                    'assistant',
                    'Hello'
                );
                addMessages(
                    messages,
                    'user',
                    'Hello'
                );
                expect(
                    messages
                ).toEqual(
                    [{
 role: 'assistant',
content: 'Hello' 
},
                        {
 role: 'user',
content: 'Hello' 
}]
                );
            }
        );
    }
);
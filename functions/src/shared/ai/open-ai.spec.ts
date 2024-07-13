import { describe, it, expect } from 'vitest';
import { ChatCompletionMessageParam } from "openai/resources";
import { addMessages } from './open-ai';

describe('open-ai', () => {
    it('should add messages', () => {
        const messages: ChatCompletionMessageParam[] = [];
        addMessages(messages, 'user', 'Hello');
        expect(messages).toEqual([{ role: 'user', content: 'Hello' }]);
    });
});
import { describe, it, expect, vi } from 'vitest';
import type { H3Event, EventHandlerRequest } from 'h3';
import { getDomain } from './domain';
import { getHeaders } from 'h3';

// Moquer la fonction getHeaders
vi.mock('h3', () => ({
    getHeaders: vi.fn()
}));

describe('getDomain', () => {
    it('should return the domain from x-forwarded-host header', () => {
        const event = {
            node: {
                req: {
                    headers: {
                        'x-forwarded-host': 'example.com'
                    }
                }
            }
        } as unknown as H3Event<EventHandlerRequest>;

        // Mock de getHeaders pour retourner les headers de l'event
        (getHeaders as unknown as jest.Mock).mockReturnValue(event.node.req.headers);

        const domain = getDomain(event);
        expect(domain).toBe('example.com');
    });

    it('should return undefined if x-forwarded-host header is not present', () => {
        const event = {
            node: {
                req: {
                    headers: {}
                }
            }
        } as unknown as H3Event<EventHandlerRequest>;

        // Mock de getHeaders pour retourner les headers de l'event
        (getHeaders as unknown as jest.Mock).mockReturnValue(event.node.req.headers);

        const domain = getDomain(event);
        expect(domain).toBeUndefined();
    });
});
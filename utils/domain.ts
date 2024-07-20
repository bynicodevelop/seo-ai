import type {
 H3Event, EventHandlerRequest 
} from 'h3'
import { getHeaders } from 'h3';

export const getDomain = (event: H3Event<EventHandlerRequest>) => {
    const headers = getHeaders(event);
    const domain = headers['x-forwarded-host'] as string;
    return domain;
}
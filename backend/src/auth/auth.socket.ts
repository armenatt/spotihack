import { WebSocket } from 'ws';

export type AuthSocket = WebSocket & { userId: string };

// export const sessions: Record<
//   string,
//   { sessionId: string; email: string; valid: boolean }
// > = {};

import { RedisClient } from '../loaders/redis';
import { v4 as uuidv4 } from 'uuid';
import { SessionInformation } from '../interfaces';

export async function getSession(sessionId: string) {
  const session = await RedisClient.get(sessionId);
  return session ? (JSON.parse(session) as SessionInformation) : null;
}

export async function invalidateSession(sessionId: string) {
  await RedisClient.del(sessionId);
}

export async function createSession(
  email: string,
  name: string,
  userId: string
) {
  const sessionId = 'satsibase' + uuidv4();

  const session = { sessionId, email, valid: true, name, userId };
  await RedisClient.set(sessionId, JSON.stringify(session));
  return session;
}

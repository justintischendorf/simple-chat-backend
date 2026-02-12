import { Redis } from "ioredis";
import type { Message } from "../../../database/generated/prisma/client";

const redis = new Redis();

export async function addMessageToCache(data: Message) {
  await redis.set(data.id, JSON.stringify(data), "EX", 43200);
  // redis.get(key)
}

export async function deleteAllFromCache() {
  await redis.flushdb();
}

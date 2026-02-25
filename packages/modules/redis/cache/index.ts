import { Redis } from "ioredis";
import type { Message } from "../../../database/generated/prisma/client";

const redis = new Redis();

export async function postMessageToCache(data: Message) {
  await redis.set(data.id, JSON.stringify(data), "EX", 43200);
}

export async function deleteAllFromCache() {
  await redis.flushdb();
}

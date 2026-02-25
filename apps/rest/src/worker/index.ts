import { CloudEvent } from "cloudevents";
import { prisma } from "../../../../packages/database/src";
import Redis from "ioredis";
import { postMessageToCache } from "../../../../packages/modules/redis/cache";

interface MessageData {
  id: string;
  content: string;
  sender: string;
}

const redis = new Redis();

while (true) {
  try {
    const result = await redis.blpop("message-inbox", 0);
    if (result) {
      const data = JSON.parse(result[1]);
      const event = new CloudEvent<MessageData>(data);
      if (event.data === undefined) {
        throw new Error("Missing required data.");
      } else {
        const message = await prisma.message.create({
          data: {
            id: event.data.id,
            content: event.data.content,
            sender: event.data.sender,
            createdAt: new Date().toISOString(),
          },
        });
        postMessageToCache(message);
        console.log("Processing Event ID: " + event.id);
      }
    }
  } catch (e) {
    console.error("Error processing job: ", e);
  }
}

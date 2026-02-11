import { v4 as uuidv4 } from "uuid";
import { CloudEvent } from "cloudevents";
import { redis } from "bun";

export async function enqueueMessage({
  data,
  source,
  type,
}: {
  source: string;
  type: string;
  data: any;
}) {
  const event = new CloudEvent({
    specversion: "1.0",
    type: type,
    source: source,
    id: uuidv4(),
    time: new Date().toISOString(),
    datacontenttype: "application/json",
    data: data,
  });

  await redis.lpush("message-inbox", JSON.stringify(event));
  return event;
}

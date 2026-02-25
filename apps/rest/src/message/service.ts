import { prisma } from "../../../../packages/database/src";
import {
  deleteAllFromCache,
  postMessageToCache,
} from "../../../../packages/modules/redis/cache";
import { enqueueMessage } from "../../../../packages/modules/redis/queue";
import {
  CLOUD_EVENT_SOURCE,
  CLOUD_EVENT_TYPES,
} from "../../../../packages/modules/utils";
import type { MessageModel } from "./model";

export abstract class MessageService {
  static async getAllMessages() {
    const messages = await prisma.message.findMany();
    return messages;
  }

  static async createMessage({
    body,
  }: {
    body: (typeof MessageModel.PostMessageBody)["static"];
  }) {
    const createdMessage = await enqueueMessage({
      type: CLOUD_EVENT_TYPES.MESSAGE_SENT,
      source: CLOUD_EVENT_SOURCE.MESSAGE_SENT,
      data: {
        ...body,
      },
    });

    return createdMessage;
  }

  static async updateMessage({
    body,
    params,
  }: {
    body: (typeof MessageModel.PostMessageBody)["static"];
    params: (typeof MessageModel.PatchMessageParams)["static"];
  }) {
    const updatedMessage = await prisma.message.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
      },
    });
    postMessageToCache(updatedMessage);
    return updatedMessage;
  }

  static async deleteMessage() {
    prisma.message.deleteMany();
    deleteAllFromCache();
  }
}

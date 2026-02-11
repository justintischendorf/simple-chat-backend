import { prisma } from "../../../../packages/database/src";
import type { MessageModel } from "./model";

export abstract class MessageService {
  static async createMessage({
    body,
  }: {
    body: (typeof MessageModel.PostMessageBody)["static"];
  }) {
    const createdMessage = await prisma.message.create({
      data: {
        ...body,
      },
    });
    return createdMessage;
  }

  static async getAllMessages() {
    const messages = await prisma.message.findMany();
    return messages;
  }
}
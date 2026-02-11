import { Elysia } from "elysia";
import { MessageModel } from "./model";
import { MessageService } from "./service";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { MissingArgumentsError } from "../../../../packages/modules/errors";

new Elysia({ prefix: "/api" })

  .get("/messages", async ({ set }) => {
    const messages = await MessageService.getAllMessages();
    set.status = 200;
    return messages;
  })

  .post(
    "/messages",
    async ({ body, set }) => {
      try {
        if (!body.content?.trim() || !body.sender?.trim()) {
          set.status = 422;
          return new MissingArgumentsError("Required parameters are missing.");
        }
        const createdMessage = await MessageService.createMessage({ body });
        set.status = 202;
        return createdMessage;
      } catch (e) {
        if (e instanceof PrismaClientInitializationError) {
          set.status = 503;
          return { error: "Unable to establish database connection." };
        }
        if (
          e instanceof PrismaClientKnownRequestError ||
          e instanceof PrismaClientUnknownRequestError ||
          e instanceof PrismaClientRustPanicError
        ) {
          set.status = 500;
          return { error: "The server encountered an unexpected exception." };
        }
        set.status = 500;
        return { error: "The server encountered an unexpected exception." };
      }
    },
    {
      body: MessageModel.PostMessageBody,
    },
  )
  .listen(3000);

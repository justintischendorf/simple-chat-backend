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
        if (!body.content.trim() || !body.sender.trim()) {
          set.status = 422;
          return new MissingArgumentsError("Missing arguments.");
        }
        const createdMessage = await MessageService.createMessage({ body });
        set.status = 202;
        return createdMessage;
      } catch (e) {
        if (e instanceof PrismaClientInitializationError) {
          set.status = 503;
          return { error: "Database unavailable" };
        }
        if (
          e instanceof PrismaClientKnownRequestError ||
          e instanceof PrismaClientUnknownRequestError ||
          e instanceof PrismaClientRustPanicError
        ) {
          set.status = 500;
          return { error: "Internal Server Error" };
        }
        set.status = 500;
        return { error: "Internal Server Error" };
      }
    },
    {
      body: MessageModel.PostMessageBody,
    },
  )
  .listen(3000);

import { Elysia } from "elysia";
import { MessageModel } from "./model";
import type { Message } from "../Utils";

let messages: Message[] = [];

new Elysia({ prefix: "/messages" })

  .post(
    "/",
    ({ body, set }) => {
      body: body;

      if (body.content && body.sender != undefined) {
        set.status = 201;
        const message: Message = body;
        messages.push(message);
        return message;
      } else {
        set.status = 400;
        return new Error("Missing arguments.");
      }
    },
    {
      body: MessageModel.PostMessageBody,
    },
  )

  .get("/", ({ set }) => {
    set.status = 200;
    return messages;
  })
  .listen(3000);
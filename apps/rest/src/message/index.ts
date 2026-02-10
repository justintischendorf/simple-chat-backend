import { Elysia } from "elysia";
import { MessageModel } from "./model";
import { MessageService } from "./service";

new Elysia({ prefix: "/messages" })

  .get("/", ({ set }) => {
    const messages = MessageService.getAllMessages();
    set.status = 200;
    return messages;
  })

  .post(
    "/",
    ({ body, set }) => {
      const createdMessage = MessageService.createMessage({ body });
      if (createdMessage != undefined) {
        set.status = 201;
        return createdMessage;
      } else {
        set.status = 400;
        return new Error("Missing arguments.");
      }
    },
    {
      body: MessageModel.PostMessageBody,
    },
  )
  .listen(3000);

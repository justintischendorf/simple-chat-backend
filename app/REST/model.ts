import { t } from "elysia";

export namespace MessageModel {
  export const PostMessageBody = t.Object({
    sender: t.String(),
    content: t.String(),
  });
}

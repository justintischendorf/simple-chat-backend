import { t } from "elysia";

export namespace MessageModel {
  export const PostMessageBody = t.Object({
    sender: t.String(),
    content: t.String(),
  });
  export const PatchMessageParams = t.Object({
    id: t.String(),
  });
}

import { z } from "zod";

export const webhookListItemSchema = z.object({
  id: z.uuidv7(),
  method: z.string(),
  pathname: z.string(),
  createdAt: z.coerce.date(),
});

export const webhookListSchema = z.object({
  webhooks: z.array(webhookListItemSchema),
  nextCursor: z.string().nullable(),
});

export const webhookDetailsSchema = z.object({
  id: z.uuidv7(),
  method: z.string(),
  pathname: z.string(),
  ip: z.string(),
  body: z.string().nullable(),
  statusCode: z.number(),
  headers: z.record(z.string(), z.string()),
  queryParams: z.record(z.string(), z.string()).nullable(),
  contentType: z.string().nullable(),
  contentLength: z.number().nullable(),
  createdAt: z.coerce.date(),
});

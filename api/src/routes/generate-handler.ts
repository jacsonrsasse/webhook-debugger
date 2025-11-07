import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { webhooks } from "../db/schema";
import { db } from "../db";
import { eq, inArray } from "drizzle-orm";

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/generate",
    {
      schema: {
        summary: "Generate a TypeScript handler for a webhook",
        tags: ["webhook"],
        body: z.object({
          webhookIds: z.array(z.uuidv7()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body;
      const result = await db
        .select({
          body: webhooks.body,
        })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds));

      const webhooksBodies = result.map(({ body }) => body).join("\n\n");

      reply.status(201).send({
        code: webhooksBodies,
      });
    }
  );
};

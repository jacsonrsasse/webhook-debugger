import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { webhooks } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks/:id",
    {
      schema: {
        summary: "Get a specific webhook by id",
        tags: ["webhook"],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: createSelectSchema(webhooks),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await db
        .select()
        .from(webhooks)
        .where(eq(webhooks.id, id))
        .limit(1);

      if (!result.length) {
        reply.status(404).send({ message: "Webhook not found" });
      }

      reply.send(result[0]);
    }
  );
};

import { fastify } from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { listWebhooks } from "./routes/list-webhooks";
import { env } from "./env";

const app = fastify();

app.withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Webhook Debugger",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
});

app.register(listWebhooks);

app.listen({ port: env.PORT, host: "0.0.0.0" }, () => {
  console.log("Http server running at http://localhost:3333");
  console.log("Docs available at http://localhost:3333/docs");
});

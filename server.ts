import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import { getCourses } from "./src/routes/courses/get-courses";
import { getCourseById } from "./src/routes/courses/get-course-by-id";
import { createCourse } from "./src/routes/courses/create-couse";
import ScalarAPIReference from "@scalar/fastify-api-reference";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV !== "production") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Documentação API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(ScalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      title: "Documentação API",
    },
  });
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(getCourses);
server.register(getCourseById);
server.register(createCourse);

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});

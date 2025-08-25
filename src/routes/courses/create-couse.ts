import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client";
import { courses } from "../../database/schema";
import z from "zod";

export const createCourse: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      schema: {
        tags: ["Courses"],
        summary: "Create a new course",
        body: z.object({
          title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
        }),
        response: {
          201: z.object({
            courseId: z.uuid().describe("Course created"),
          }),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;

      const result = await db
        .insert(courses)
        .values({ title: courseTitle })
        .returning();

      reply.status(201).send({
        courseId: result[0].id,
      });
    }
  );
};

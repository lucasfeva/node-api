import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client";
import { courses } from "../../database/schema";
import z from "zod";

export const getCourses: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["Courses"],
        summary: "Get all courses",
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await db.select().from(courses);
      return reply.send({ courses: result });
    }
  );
};

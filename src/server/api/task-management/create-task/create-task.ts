import z from "zod/v4";
import { authorizedProcedure } from "../../trpc";
import { prisma } from "../../../../../prisma/client";

const getTasksInput = z.object({
  title: z.string(),
  description: z.string(),
});

const getTasksOutput = z.object({
  taskId: z.string()
});


export const createTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksInput)
  .output(getTasksOutput)
  .mutation(async (opts) => {
    const task = await prisma.task.create({
      data: { 
        title: opts.input.title,
        description: opts.input.description,
        ownerId: opts.ctx.userId 
      }
    })

    return { taskId: task.id };
  });

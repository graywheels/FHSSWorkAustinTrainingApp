import z from 'zod';
import { authorizedProcedure } from '../../trpc';
import { prisma } from '../../../../../prisma/client';
import { TRPCError } from '@trpc/server';
import { isPrismaError } from '../../../utils/prisma';

const deleteTaskInput = z.object({
  taskId: z.string(),
})

const deleteTaskOutput = z.void();

export const deleteTask = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(deleteTaskInput)
  .output(deleteTaskOutput)
  .mutation(async (opts) => {
    try{
      await prisma.task.delete({
        where: {
          id: opts.input.taskId, 
          ownerId: opts.ctx.userId,
        },
      });
    } catch (error) {
      if (isPrismaError(error, 'NOT_FOUND')) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      throw error;
    }
  });
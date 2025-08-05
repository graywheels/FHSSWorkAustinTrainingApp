import { z } from 'zod/v4';
import { prisma } from '../../../../../prisma/client';
import { authorizedProcedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { Status } from '../../../../../prisma/generated/enums';

const getTasksByUserInput = z.object({
  pageSize: z.number(),
  pageOffset: z.number(),
});

const getTasksByUserOutput = z.object({
  //array of objects with these attributes
  data: z.array(z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    title: z.string(),
    description: z.string(),
    completedAt: z.date().nullable(),
    ownerId: z.string(),
    //tells the typescript that string will exactly match one of TaskStatus options
    status: z.literal(Object.values(Status)),
  })),
  totalCount: z.number(),
});

export const getTasksByUser = authorizedProcedure
  .meta({ requiredPermissions: ['manage-tasks'] })
  .input(getTasksByUserInput)
  .output(getTasksByUserOutput)
  .mutation(async (opts) => {
    const totalCount = await prisma.task.count({
      where: { ownerId: opts.ctx.userId }
    })

    const data = await prisma.task.findMany({
      where: { ownerId: opts.ctx.userId },
      take: opts.input.pageSize,
      skip: opts.input.pageOffset,
      orderBy: { createdAt: 'desc' },
    });

    return { data, totalCount };
    throw new TRPCError({ code: 'NOT_IMPLEMENTED' });
  });

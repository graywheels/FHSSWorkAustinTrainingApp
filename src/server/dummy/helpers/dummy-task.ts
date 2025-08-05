import { Prisma, Status } from '../../../../prisma/client';
import { faker } from '@faker-js/faker';

/**
 * Generates dummy task data for testing or seeding purposes.
 *
 * @param opts - Optional configuration for the dummy task data.
 * @returns A Prisma.TaskCreateInput object populated with dummy data.
 * @see Prisma.TaskCreateInput
 */
export function generateDummyTaskData(opts: {
  ownerId: string;
  title?: string;
  description?: string;
  status?: Status;
  completedDate?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}) {
  return {
    ownerId: opts.ownerId,
    title: opts.title ?? faker.book.title(),
    description: opts.description ?? faker.hacker.phrase(),
    status: opts.status ?? getRandomStatus(),
    completedDate: opts.completedDate ?? faker.date.recent(),
    updatedAt: opts.updatedAt ?? faker.date.recent(),
    createdAt: opts.createdAt ?? faker.date.past(),
  };
}

export function getRandomStatus(): Status {
  const taskStatuses = Object.values(Status);
  return taskStatuses[faker.number.int(taskStatuses.length - 1)];
}
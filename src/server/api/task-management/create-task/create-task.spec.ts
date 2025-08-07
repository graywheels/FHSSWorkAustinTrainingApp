import { describe } from "vitest";
import { prisma, User } from "../../../../../prisma/client";
import { appRouter } from "../../api.routes";
import { generateDummyUserData } from "../../../dummy/helpers/dummy-user";
import { faker } from "@faker-js/faker";

describe('Create task', () => {
  let requestingUser: User;
  let createTask: ReturnType<typeof appRouter.createCaller>['taskManagement']['createTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks'],
        roles: [],
      }),
    });
    createTask = appRouter.createCaller({userId: requestingUser.id}).taskManagement.createTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id } });
  })

  it('creates the task', async () => {
    const title = faker.book.title();
    const description = faker.commerce.productDescription();

    const createdTaskId = await createTask({title, description})

    try{
      const foundTask = await prisma.task.findUnique({where: {id: createdTaskId.taskId}})
      expect(foundTask).toBeDefined();
      expect(foundTask?.title).toBe(title);
      expect(foundTask?.description).toBe(description);
      expect(foundTask?.status).toBe("Incomplete");

    } finally {
      await prisma.task.delete({where: {id: createdTaskId.taskId}})
    }
  })

})
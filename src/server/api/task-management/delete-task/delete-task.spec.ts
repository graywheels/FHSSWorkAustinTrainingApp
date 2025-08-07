import { describe, expect, it } from "vitest";
import { prisma, User } from "../../../../../prisma/client";
import { appRouter } from "../../api.routes";
import { generateDummyUserData } from "../../../dummy/helpers/dummy-user";
import { generateDummyTaskData } from "../../../dummy/helpers/dummy-task";
import { faker } from "@faker-js/faker";

describe('Delete task', () => {
  let requestingUser: User;
  let deleteTask: ReturnType<typeof appRouter.createCaller>['taskManagement']['deleteTask'];

  beforeAll(async () => {
    requestingUser = await prisma.user.create({
      data: generateDummyUserData({
        permissions: ['manage-tasks']
      }),
    });
    deleteTask = appRouter.createCaller({userId: requestingUser.id}).taskManagement.deleteTask;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: requestingUser.id}});
  })

  it('deletes the task', async () => {
    const taskData = generateDummyTaskData({ownerId: requestingUser.id})
    const task = await prisma.task.create({data: taskData});

    try{
      await deleteTask({taskId: task.id});

      const foundTask = await prisma.task.findUnique({where: {id: task.id}});
      expect(foundTask).toBeNull()

    }catch(err) {
      await prisma.task.delete({where: {id: task.id}})
      throw (err)
    }
  })

  it('errors if the task does not exist', async () => {
    let error

    try{
      await deleteTask({ taskId: faker.string.uuid()})
    }
    catch (err) {
      error = err
    }

    expect(error).toBeDefined();
    expect(error).toHaveProperty('code', 'NOT_FOUND');
  })
    
})